import ResetPasswordTemplate from "@/emails/reset-password-template";
import { wrapperMiddleware } from "@/lib/middleware/wrapper";
import { formatErrors } from "@/lib/utils";
import { forgotPasswordSchema } from "@/lib/validation/user-schema";
import { logger } from "@/logger";
import prisma from "@/prisma/client";
import { getLocalTimeZone, now } from "@internationalized/date";
import { render } from "@react-email/render";
import sendgrid from "@sendgrid/mail";
import { randomBytes } from "crypto";
import { ApiError } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";

if (!process.env.SENDGRID_API_KEY)
  logger.warn("SENDGRID_API_KEY is missing. Emails will not be sent.");
else sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

async function POST_handler(request: NextRequest) {
  // Get the body of the request and validate it
  const body = await request.json();
  const { success, data, error } = forgotPasswordSchema.safeParse(body);
  if (!success) throw new ApiError(400, formatErrors(error).message);
  // Find the user by email
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user) throw new ApiError(404, "This email is not registered");
  // Generate a reset token
  const token = {
    type: "reset",
    token: randomBytes(16).toString("hex"),
    expires: now(getLocalTimeZone()).add({ days: 2 }).toDate(),
  };
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      tokens: {
        upsert: {
          where: { userId_type: { userId: user.id, type: "reset" } },
          create: token,
          update: token,
        },
      },
    },
    include: { tokens: true },
  });
  const updatedToken = updatedUser.tokens.find(token => token.type === "reset");
  if (!updatedToken) throw new ApiError(500, "Token not found");
  // Send reset password email if SENDGRID_API_KEY is set
  if (process.env.SENDGRID_API_KEY) {
    // Send reset password email
    const forgotPasswordEmailHtml = render(
      ResetPasswordTemplate({
        userFirstname: updatedUser.name,
        resetPasswordLink: `${request.nextUrl.origin}/auth/reset-password?token=${updatedToken.token}`,
        origin: request.nextUrl.origin,
      })
    );
    await sendgrid
      .send({
        from: { email: "mohannadragab53@gmail.com", name: "Market Hub Support Team" },
        to: updatedUser.email!,
        subject: "Reset your password",
        html: forgotPasswordEmailHtml,
      })
      .then(() => logger.info("Email sent"))
      .catch(logger.error);
  }
  return NextResponse.json(updatedUser);
}

export const POST = wrapperMiddleware(POST_handler);
