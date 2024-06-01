import UserBannedTemplate from "@/emails/user-banned";
import UserUnBannedTemplate from "@/emails/user-unbanned";
import { allowedMiddleware } from "@/lib/middleware/permissions";
import { wrapperMiddleware } from "@/lib/middleware/wrapper";
import { formatErrors } from "@/lib/utils";
import { banUserSchema, unBanUserSchema } from "@/lib/validation/user-schema";
import { logger } from "@/logger";
import prisma from "@/prisma/client";
import { render } from "@react-email/render";
import sendgrid from "@sendgrid/mail";
import { ApiError } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";

if (!process.env.SENDGRID_API_KEY)
  logger.warn("SENDGRID_API_KEY is missing. Emails will not be sent.");
else sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

async function DELETE_handler(request: NextRequest) {
  const body = await request.json();
  const { success, data, error } = banUserSchema.safeParse(body);
  if (!success) throw new ApiError(400, formatErrors(error).message);
  const { username, reason } = data;
  // Get the user to be banned
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) throw new ApiError(404, "User not found");
  if (user.isBanned) throw new ApiError(404, "User is already banned");

  // Edit the user
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { isBanned: true, banReason: reason },
  });

  // Send emails if SENDGRID_API_KEY is set
  if (process.env.SENDGRID_API_KEY) {
    // Send email to notify the banned user
    const userBannedEmailHtml = render(
      UserBannedTemplate({ name: updatedUser.name, reason, baseUrl: request.nextUrl.origin })
    );
    await sendgrid
      .send({
        from: { email: "mohannadragab53@gmail.com", name: "Market Hub Support Team" },
        to: updatedUser.email!,
        subject: "Account Banned",
        html: userBannedEmailHtml,
      })
      .then(() => logger.info("Email sent"))
      .catch(logger.error);
  }

  return NextResponse.json(updatedUser);
}

// Unban a user
async function POST_handler(request: NextRequest) {
  const body = await request.json();
  const { success, data, error } = unBanUserSchema.safeParse(body);
  if (!success) throw new ApiError(400, formatErrors(error).message);
  const { username } = data;
  // Get the user to be unbanned
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) throw new ApiError(404, "User not found");
  if (!user.isBanned) throw new ApiError(404, "User is not banned");

  // Edit the user
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { isBanned: false, banReason: null },
  });

  // Send emails if SENDGRID_API_KEY is set
  if (process.env.SENDGRID_API_KEY) {
    // Send email to notify the unbanned user
    const userBannedEmailHtml = render(
      UserUnBannedTemplate({ name: updatedUser.name, baseUrl: request.nextUrl.origin })
    );
    await sendgrid
      .send({
        from: { email: "mohannadragab53@gmail.com", name: "Market Hub Support Team" },
        to: updatedUser.email!,
        subject: "Account Unbanned",
        html: userBannedEmailHtml,
      })
      .then(() => logger.info("Email sent"))
      .catch(logger.error);
  }

  return NextResponse.json(updatedUser);
}

export const DELETE = wrapperMiddleware(allowedMiddleware("support"), DELETE_handler);
export const POST = wrapperMiddleware(allowedMiddleware("support"), POST_handler);
