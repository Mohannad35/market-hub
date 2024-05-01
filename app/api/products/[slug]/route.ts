import { formatErrors, getQueryObject } from "@/lib/utils";
import { productDetailsQuerySchema } from "@/lib/validation-schemas";
import prisma from "@/prisma/client";
import { Prisma } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params: { slug } }: { params: { slug: string } }
) {
  const searchParams = request.nextUrl.searchParams;
  const query = getQueryObject(searchParams);
  const { success, data, error } = productDetailsQuerySchema.safeParse(query);
  if (!success) return NextResponse.json(formatErrors(error), { status: 400 });
  const { populate } = data;
  const include: Prisma.ProductInclude<DefaultArgs> | null | undefined = {};
  if (populate) populate.forEach(pop => (include[pop as "brand" | "category" | "vendor"] = true));
  const product = await prisma.product.findUnique({ where: { slug }, include });
  return NextResponse.json(product);
}
