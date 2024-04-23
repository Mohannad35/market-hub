import { formatErrors } from "@/components/utils";
import { signUpSchema } from "@/components/validationSchemas";
import prisma from "@/prisma/client";
import { hash } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { success, data, error } = signUpSchema.safeParse(body);
  if (!success) return NextResponse.json({ error: formatErrors(error).messege }, { status: 400 });
  const { email, password } = data;
  const exist = await prisma.user.findUnique({ where: { email } });
  if (exist) return NextResponse.json({ error: "Email already exists." }, { status: 400 });
  const pwHash = await hash(password, 10);
  const user = await prisma.user.create({ data: { ...data, password: pwHash } });
  return NextResponse.json({ user }, { status: 201 });
}
