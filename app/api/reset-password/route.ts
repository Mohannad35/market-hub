import PasswordChangedTemplate from "@/emails/password-changed-template";
import { wrapperMiddleware } from "@/lib/middleware/wrapper";
import { formatErrors } from "@/lib/utils";
import { resetPasswordTokenSchema } from "@/lib/validation/user-schema";
import { logger } from "@/logger";
import prisma from "@/prisma/client";
import { render } from "@react-email/render";
import sendgrid from "@sendgrid/mail";
import { hash } from "bcryptjs";
import { ApiError } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";

if (!process.env.SENDGRID_API_KEY)
  logger.warn("SENDGRID_API_KEY is missing. Emails will not be sent.");
else sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

async function POST_handler(request: NextRequest) {
  // Get the body of the request and validate it
  const body = await request.json();
  const { success, data, error } = resetPasswordTokenSchema.safeParse(body);
  if (!success) throw new ApiError(400, formatErrors(error).message);
  const { password, confirmPassword } = data;
  // Find the user by token
  const token = await prisma.token.findUnique({
    where: { token: data.token },
    include: { user: true },
  });
  if (!token) throw new ApiError(404, "Token not found");
  if (token.type !== "reset") throw new ApiError(400, "Invalid token type");
  if (token.expires < new Date()) throw new ApiError(400, "Token expired");
  const user = token.user;
  if (!user) throw new ApiError(404, "User not found");
  if (password !== confirmPassword) throw new ApiError(400, "Passwords do not match");
  // Hash the new password
  const pwHash = await hash(password, 10);
  // Update the user password
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { password: pwHash, tokens: { delete: { token: data.token } } },
    include: { tokens: true },
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
        subject: "Password changed successfully",
        html: passwordChangedEmailHtml,
      })
      .then(() => logger.info("Email sent"))
      .catch(logger.error);
  }
  return NextResponse.json(updatedUser);
}

export const POST = wrapperMiddleware(POST_handler);
