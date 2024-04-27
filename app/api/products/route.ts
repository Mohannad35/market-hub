import { auth } from "@/auth";
import { newProductSchema, productQuerySchema } from "@/lib/validation-schemas";
import { formatErrors, getQueryObject } from "@/lib/utils";
import prisma from "@/prisma/client";
import { Prisma } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
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
    page,
    pageSize,
    sortBy,
    search,
    direction,
    category,
    brands,
    minPrice,
    maxPrice,
    populate,
    popular,
  } = data;
  const popObj: Prisma.ProductInclude<DefaultArgs> | null | undefined = {};
  if (populate) populate.forEach(pop => (popObj[pop as "brand" | "category" | "vendor"] = true));
  if (brands) popObj.brand = { where: { slug: { in: brands } } };
  if (category) popObj.category = { where: { slug: category } };
  const prismaQuery: Prisma.ProductFindManyArgs = {
    where: {
      name: { contains: search || undefined, mode: "insensitive" },
      price: { gte: minPrice, lte: maxPrice },
    },
    orderBy: popular
      ? [{ rating: "desc" }, { ratingCount: "desc" }, { sold: "desc" }, { createdAt: "desc" }]
      : { [sortBy!]: direction },
    take: pageSize || 20,
    skip: ((page || 1) - 1) * (pageSize || 20),
    include: popObj,
  };
  const [products, count] = await prisma.$transaction([
    prisma.product.findMany(prismaQuery),
    prisma.product.count({ where: prismaQuery.where }),
  ]);
  return NextResponse.json({ products, count });
}
