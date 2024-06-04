import UserDeletedTemplate from "@/emails/user-deleted";
import VerificationTemplate from "@/emails/verification-template";
import { authMiddleware } from "@/lib/middleware/auth";
import { allowedMiddleware } from "@/lib/middleware/permissions";
import { wrapperMiddleware } from "@/lib/middleware/wrapper";
import { formatErrors } from "@/lib/utils";
import { deleteUserSchema, editProfileSchema } from "@/lib/validation/user-schema";
import { logger } from "@/logger";
import prisma from "@/prisma/client";
import { getLocalTimeZone, now } from "@internationalized/date";
import { Gender, User } from "@prisma/client";
import { render } from "@react-email/render";
import sendgrid from "@sendgrid/mail";
import { randomBytes } from "crypto";
import { isEqual } from "lodash";
import { ApiError } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";

if (!process.env.SENDGRID_API_KEY)
  logger.warn("SENDGRID_API_KEY is missing. Emails will not be sent.");
else sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

async function GET_handler(request: NextRequest): Promise<NextResponse<User | null>> {
  const user = JSON.parse(request.cookies.get("user")!.value!) as User;
  return NextResponse.json(user);
}

async function PATCH_handler(request: NextRequest) {
  const { id } = JSON.parse(request.cookies.get("user")!.value!) as User;
  const user = await prisma.user.findFirst({ where: { id }, include: { tokens: true } });
  if (!user) throw new ApiError(404, "User not found");
  // Get the body of the request and validate it
  const body = await request.json();
  const { success, data, error } = editProfileSchema.safeParse(body);
  if (!success) throw new ApiError(400, formatErrors(error).message);
  // Check if the user is trying to change the email
  if (data.email && data.email !== user.email) {
    if (await prisma.user.findFirst({ where: { email: data.email } }))
      throw new ApiError(400, "Email already in use");
  }
  // Check if the user is trying to change the username
  if (data.username && data.username !== user.username) {
    if (await prisma.user.findFirst({ where: { username: data.username } }))
      throw new ApiError(400, "Username not available");
  }
  // Check if the user is trying to change the phone number
  if (data.phoneNumber && isEqual(data.phoneNumber, user.phoneNumber)) {
    if (await prisma.user.findFirst({ where: { phoneNumber: data.phoneNumber } }))
      throw new ApiError(400, "Phone number already in use");
  }
  // Check if the user is trying to change the password
  if (data.password) {
    throw new ApiError(400, "To change password, use the change password endpoint");
  }
  const token = {
    token: randomBytes(16).toString("hex"),
    expires: now(getLocalTimeZone()).add({ days: 2 }).toDate(),
  };
  // Edit the user
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      ...data,
      gender: data.gender ? (data.gender as Gender) : undefined,
      isVerified: data.email ? false : undefined,
      tokens: data.email
        ? {
            upsert: {
              where: { userId_type: { userId: user.id, type: "verification" } },
              create: { ...token, type: "verification" },
              update: { ...token },
            },
          }
        : undefined,
    },
    include: { tokens: true },
  });
  // Send verification email if the email was changed
  if (data.email) {
    // Find verification token
    const verificationToken = user.tokens.find(token => token.type === "verification");
    if (!verificationToken) throw new ApiError(500, "Token not found");
    // Send emails if SENDGRID_API_KEY is set
    if (process.env.SENDGRID_API_KEY) {
      // Send verification email
      const verificationEmailHtml = render(
        VerificationTemplate({
          username: updatedUser.name,
          emailVerificationToken: verificationToken.token,
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
  }
  return NextResponse.json(updatedUser);
}

// Delete User
async function DELETE_handler(request: NextRequest) {
  const body = await request.json();
  const { success, data, error } = deleteUserSchema.safeParse(body);
  if (!success) throw new ApiError(400, formatErrors(error).message);
  const { username, reason, uponRequest } = data;
  // Get the user to be deleted
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) throw new ApiError(404, "User not found");

  // Delete the user
  const deletedUser = await prisma.user.delete({ where: { id: user.id } });

  // Send emails if SENDGRID_API_KEY is set
  if (process.env.SENDGRID_API_KEY) {
    // Send email to notify the deleted user
    const userBannedEmailHtml = render(
      UserDeletedTemplate({
        name: deletedUser.name,
        reason,
        uponRequest,
        baseUrl: request.nextUrl.origin,
      })
    );
    await sendgrid
      .send({
        from: { email: "mohannadragab53@gmail.com", name: "Market Hub Support Team" },
        to: deletedUser.email!,
        subject: "Account Deleted",
        html: userBannedEmailHtml,
      })
      .then(() => logger.info("Email sent"))
      .catch(logger.error);
  }
}

export const GET = wrapperMiddleware(authMiddleware, GET_handler);
export const PATCH = wrapperMiddleware(authMiddleware, PATCH_handler);
export const DELETE = wrapperMiddleware(allowedMiddleware("admin"), DELETE_handler);
