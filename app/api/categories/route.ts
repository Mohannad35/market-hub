import { auth } from "@/auth";
import { categoryQuerySchema, newCategorySchema } from "@/lib/validation-schemas";
import { formatErrors, getQueryObject } from "@/lib/utils";
import prisma from "@/prisma/client";
import { Category } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({}, { status: 401 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({}, { status: 401 });
  // Get the body of the request and validate it
  const body = await req.json();
  const { success, data, error } = newCategorySchema.safeParse(body);
  if (!success) return NextResponse.json({ error: formatErrors(error).messege }, { status: 400 });
  let predecessor: Category | null = null;
  // Check if the predecessor exists
  if (data.predecessorId) {
    predecessor = await prisma.category.findUnique({ where: { id: data.predecessorId } });
    if (!predecessor)
      return NextResponse.json({ error: "Predecessor does not exist" }, { status: 400 });
    await prisma.category.update({ where: { id: predecessor.id }, data: { isPredecessor: true } });
  }
  // Create a slug for the category
  const slug = slugify(data.name + " " + (predecessor?.name || ""), { lower: true, strict: true });
  if (await prisma.category.findUnique({ where: { slug } }))
    return NextResponse.json({ error: "Category already exists" }, { status: 400 });
  // Create the category
  const category = await prisma.category.create({ data: { ...data, slug } });
  return NextResponse.json(category, { status: 201 });
}

/**
 * API route to get categories
 * @param request NextRequest
 * @returns Category[]
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = getQueryObject(searchParams);
  const { success, data, error } = categoryQuerySchema.safeParse(query);
  if (!success) return NextResponse.json(formatErrors(error), { status: 400 });
  const { skip, take, predecessorId, main, populate } = data;
  const popObj: { [key: string]: boolean } = {};
  if (populate) populate.forEach(pop => (popObj[pop] = true));
  const categories = await prisma.category.findMany({
    where: { predecessorId: main ? { isSet: false } : predecessorId },
    orderBy: { name: "asc" },
    take,
    skip,
    include: popObj,
  });
  return NextResponse.json(categories);
}
