import { auth } from "@/auth";
import { formatErrors, getQueryObject } from "@/components/utils";
import { newProductSchema, productQuerySchema } from "@/components/validationSchemas";
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
  const { success, data, error } = newProductSchema.safeParse(body);
  if (!success) return NextResponse.json({ error: formatErrors(error).messege }, { status: 400 });

  // Create a slug for the product
  let slug = slugify(data.name, { lower: true, strict: true, trim: true });
  while (await prisma.product.findUnique({ where: { slug } })) slug = `${slug}-${nanoid(8)}`;

  // Create the product
  const product = await prisma.product.create({ data: { ...data, slug, vendorId: user.id } });

  return NextResponse.json(product, { status: 201 });
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = getQueryObject(searchParams);
  const { success, data, error } = productQuerySchema.safeParse(query);
  if (!success) return NextResponse.json(formatErrors(error), { status: 400 });

  const {
    take,
    skip,
    sortBy,
    search,
    direction,
    categoryId,
    brandId,
    minPrice,
    maxPrice,
    populate,
  } = data;
  const popObj: { [key: string]: boolean } = {};
  if (populate) populate.forEach(pop => (popObj[pop] = true));
  const products = await prisma.product.findMany({
    where: {
      name: { contains: search || undefined, mode: "insensitive" },
      categoryId,
      brandId,
      price: { gte: minPrice, lte: maxPrice },
    },
    orderBy: { [sortBy!]: direction },
    take,
    skip,
    include: popObj,
  });
  return NextResponse.json(products);
}
