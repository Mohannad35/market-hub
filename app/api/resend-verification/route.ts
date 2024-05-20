import VerificationTemplate from "@/emails/verification-template";
import { authMiddleware } from "@/lib/middleware/auth";
import { wrapperMiddleware } from "@/lib/middleware/wrapper";
import { logger } from "@/logger";
import prisma from "@/prisma/client";
import { getLocalTimeZone, now } from "@internationalized/date";
import { User } from "@prisma/client";
import { render } from "@react-email/render";
import sendgrid from "@sendgrid/mail";
import { randomBytes } from "crypto";
import { ApiError } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";

if (!process.env.SENDGRID_API_KEY)
  logger.warn("SENDGRID_API_KEY is missing. Emails will not be sent.");
else sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

async function GET_handler(request: NextRequest): Promise<NextResponse<User | null>> {
  const { id } = JSON.parse(request.cookies.get("user")!.value!) as User;
  const user = await prisma.user.findFirst({ where: { id }, include: { tokens: true } });
  if (!user) throw new ApiError(404, "User not found");
  // Check if the user is verified
  if (user.isVerified) throw new ApiError(400, "User is already verified");
  // Create a verification token
  const token = {
    type: "verification",
    token: randomBytes(16).toString("hex"),
    expires: now(getLocalTimeZone()).add({ days: 2 }).toDate(),
  };
  // Edit the user
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      isVerified: false,
      tokens: {
        upsert: {
          where: { userId_type: { userId: user.id, type: "verification" } },
          create: token,
          update: token,
        },
      },
    },
    include: { tokens: true },
  });
  const updatedToken = updatedUser.tokens.find(token => token.type === "verification");
  if (!updatedToken) throw new ApiError(500, "Token not found");
  // Send verification email if SENDGRID_API_KEY is set
  if (process.env.SENDGRID_API_KEY) {
    // Send verification email
    const verificationEmailHtml = render(
      VerificationTemplate({
        username: updatedUser.name,
        emailVerificationToken: updatedToken.token,
        baseUrl: request.nextUrl.origin,
      })
    );
    await sendgrid
      .send({
        from: { email: "mohannadragab53@gmail.com", name: "Market Hub Support Team" },
        to: updatedUser.email!,
        subject: "Email Verification",
        html: verificationEmailHtml,
      })
      .then(() => logger.info("Email sent"))
      .catch(logger.error);
  }
  return NextResponse.json(updatedUser);
}

export const GET = wrapperMiddleware(authMiddleware, GET_handler);
