import EmailVerifiedTemplate from "@/emails/email-verified-template";
import { wrapperMiddleware } from "@/lib/middleware/wrapper";
import { formatErrors } from "@/lib/utils";
import { verifyEmailSchema } from "@/lib/validation/user-schema";
import { logger } from "@/logger";
import prisma from "@/prisma/client";
import { render } from "@react-email/render";
import sendgrid from "@sendgrid/mail";
import { ApiError } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";

if (!process.env.SENDGRID_API_KEY)
  logger.warn("SENDGRID_API_KEY is missing. Emails will not be sent.");
else sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

async function POST_handler(request: NextRequest) {
  // Get the body of the request and validate it
  const body = await request.json();
  const { success, data, error } = verifyEmailSchema.safeParse(body);
  if (!success) throw new ApiError(400, formatErrors(error).message);
  const { token } = data;
  // Find the user by token
  const dbToken = await prisma.token.findUnique({ where: { token }, include: { user: true } });
  if (!dbToken) throw new ApiError(404, "Token not found");
  if (dbToken.type !== "verification") throw new ApiError(400, "Invalid token type");
  if (dbToken.expires < new Date()) throw new ApiError(400, "Token expired");
  const user = dbToken.user;
  if (!user) throw new ApiError(404, "User not found");
  // Update the user password
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { isVerified: true, tokens: { delete: { token } } },
    include: { tokens: true },
  });
  if (process.env.SENDGRID_API_KEY) {
    // Send email verified email
    const emailVerifiedHtml = render(
      EmailVerifiedTemplate({ username: updatedUser.name, baseUrl: request.nextUrl.origin })
    );
    await sendgrid
      .send({
        from: { email: "mohannadragab53@gmail.com", name: "Market Hub Support Team" },
        to: updatedUser.email!,
        subject: "Email verified successfully",
        html: emailVerifiedHtml,
      })
      .then(() => logger.info("Email sent"))
      .catch(logger.error);
  }
  return NextResponse.json(updatedUser);
}

export const POST = wrapperMiddleware(POST_handler);
