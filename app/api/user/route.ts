import { authMiddleware } from "@/lib/middleware/auth";
import { wrapperMiddleware } from "@/lib/middleware/wrapper";
import { formatErrors } from "@/lib/utils";
import { editProfileSchema } from "@/lib/validation/user-schema";
import prisma from "@/prisma/client";
import { Gender, User } from "@prisma/client";
import { nanoid } from "nanoid";
import { ApiError } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";

async function GET_handler(request: NextRequest): Promise<NextResponse<User | null>> {
  const user = JSON.parse(request.cookies.get("user")!.value!) as User;
  return NextResponse.json(user);
}

async function PATCH_handler(request: NextRequest) {
  const user = JSON.parse(request.cookies.get("user")!.value!) as User;
  // Get the body of the request and validate it
  const body = await request.json();
  const { success, data, error } = editProfileSchema.safeParse(body);
  if (!success) throw new ApiError(400, formatErrors(error).message);
  // Check if the user is trying to change the email
  if (data.email && data.email !== user.email) {
    const existingUser = await prisma.user.findFirst({ where: { email: data.email } });
    if (existingUser) throw new ApiError(400, "Email already in use");
  }
  // Create a slug for the user if the name is provided
  let newSlug = user.slug;
  if (data.name) {
    newSlug = slugify(data.name, { lower: true, strict: true, trim: true });
    while (await prisma.user.findFirst({ where: { slug: newSlug } }))
      newSlug = `${newSlug}-${nanoid(8)}`;
  }
  // Edit the user
  await prisma.user.update({
    where: { id: user.id },
    data: {
      ...data,
      gender: data.gender ? (data.gender as Gender) : undefined,
      slug: newSlug,
      isVerified: data.email ? false : undefined,
      // Set verificationToken
    },
  });
  return NextResponse.json(user);
}

export const GET = wrapperMiddleware(authMiddleware, GET_handler);
export const PATCH = wrapperMiddleware(authMiddleware, PATCH_handler);
