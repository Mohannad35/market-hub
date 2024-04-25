import { formatErrors } from "@/components/utils";
import { signUpSchema } from "@/components/validationSchemas";
import prisma from "@/prisma/client";
import { hash } from "bcryptjs";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";

export async function POST(req: NextRequest) {
  // Get the body of the request and validate it
  const body = await req.json();
  const { success, data, error } = signUpSchema.safeParse(body);
  if (!success) return NextResponse.json({ error: formatErrors(error).messege }, { status: 400 });

  // Check if the user already exists
  const { email, password } = data;
  const exist = await prisma.user.findUnique({ where: { email } });
  if (exist) return NextResponse.json({ error: "Email already exists." }, { status: 400 });

  // Create a slug for the user
  let slug = slugify(data.name, { lower: true, strict: true, trim: true });
  while (await prisma.user.findFirst({ where: { slug } })) slug = `${slug}-${nanoid(6)}`;

  // Hash the password, Create the user, and return it
  const pwHash = await hash(password, 10);
  const user = await prisma.user.create({ data: { ...data, password: pwHash, slug } });
  return NextResponse.json({ user }, { status: 201 });
}
