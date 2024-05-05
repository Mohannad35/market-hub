import { formatErrors } from "@/lib/utils";
import { signUpSchema } from "@/lib/validation-schemas";
import prisma from "@/prisma/client";
import { User } from "@prisma/client";
import { hash } from "bcryptjs";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";

/**
 * API route to create a new user
 * @param request NextRequest object
 * @returns { Promise<NextResponse<User | { message: string }>> }
 * @returns returns the created user if successfully created
 * @returns returns an error message if the request body is invalid with status 400
 * @returns returns an error message if the user email already exists with status 400
 * @access public
 * @method POST
 * @example /api/auth
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<User | { message: string }>> {
  // Get the body of the request and validate it
  const body = await request.json();
  const { success, data, error } = signUpSchema.safeParse(body);
  if (!success) return NextResponse.json(formatErrors(error), { status: 400 });
  // Check if the user already exists
  const { email, password } = data;
  const exist = await prisma.user.findUnique({ where: { email } });
  if (exist) return NextResponse.json({ message: "Email already exists." }, { status: 400 });
  // Create a slug for the user
  let slug = slugify(data.name, { lower: true, strict: true, trim: true });
  while (await prisma.user.findFirst({ where: { slug } })) slug = `${slug}-${nanoid(6)}`;
  // Hash the password, Create the user, and return it
  const pwHash = await hash(password, 10);
  const user = await prisma.user.create({ data: { ...data, password: pwHash, slug } });
  return NextResponse.json(user, { status: 201 });
}
