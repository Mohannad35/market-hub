import PasswordChangedTemplate from "@/emails/password-changed-template";
import { authMiddleware } from "@/lib/middleware/auth";
import { wrapperMiddleware } from "@/lib/middleware/wrapper";
import { formatErrors } from "@/lib/utils";
import { changePasswordSchema } from "@/lib/validation/user-schema";
import { logger } from "@/logger";
import prisma from "@/prisma/client";
import { User } from "@prisma/client";
import { render } from "@react-email/render";
import sendgrid from "@sendgrid/mail";
import { compare, hash } from "bcryptjs";
import { ApiError } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";

if (!process.env.SENDGRID_API_KEY)
  logger.warn("SENDGRID_API_KEY is missing. Emails will not be sent.");
else sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

async function PATCH_handler(request: NextRequest) {
  const { id } = JSON.parse(request.cookies.get("user")!.value!) as User;
  const user = await prisma.user.findFirst({ where: { id }, include: { verificationToken: true } });
  if (!user) throw new ApiError(404, "User not found");
  if (!user.password)
    throw new ApiError(400, "User has no password. Use the reset password endpoint");
  // Get the body of the request and validate it
  const body = await request.json();
  const { success, data, error } = changePasswordSchema.safeParse(body);
  if (!success) throw new ApiError(400, formatErrors(error).message);
  // Check old password is correct
  if (!(await compare(data.oldPassword, user.password)))
    throw new ApiError(400, "Old password is incorrect");
  // Hash the password
  const hashedPassword = await hash(data.newPassword, 10);
  // Edit the user
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });
  if (process.env.SENDGRID_API_KEY) {
    // Send password changed email
    const passwordChangedEmailHtml = render(
      PasswordChangedTemplate({ username: updatedUser.name, baseUrl: request.nextUrl.origin })
    );
    await sendgrid
      .send({
        from: { email: "mohannadragab53@gmail.com", name: "Market Hub Support Team" },
        to: updatedUser.email!,
        subject: "Password Changed",
        html: passwordChangedEmailHtml,
      })
      .then(() => logger.info("Email sent"))
      .catch(logger.error);
  }

  return NextResponse.json(updatedUser);
}

export const PATCH = wrapperMiddleware(authMiddleware, PATCH_handler);
