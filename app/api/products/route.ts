import { auth } from "@/auth";
import { formatErrors } from "@/components/utils";
import { newProductSchema } from "@/components/validationSchemas";
import prisma from "@/prisma/client";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({}, { status: 401 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({}, { status: 401 });

  // Get the body of the request and validate it
  const body = await req.json();
  body.price = parseFloat(body.price);
  body.quantity = parseInt(body.quantity);
  const { success, data, error } = newProductSchema.safeParse(body);
  if (!success) return NextResponse.json({ error: formatErrors(error).messege }, { status: 400 });

  // Create a slug for the product
  let slug = slugify(data.name, { lower: true, strict: true, trim: true });
  while (await prisma.product.findUnique({ where: { slug } })) slug = `${slug}-${nanoid(8)}`;

  // Create the product
  const product = await prisma.product.create({ data: { ...data, slug, vendorId: user.id } });

  return NextResponse.json(product, { status: 201 });
}
