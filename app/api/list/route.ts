import { authMiddleware } from "@/lib/middleware/auth";
import { wrapperMiddleware } from "@/lib/middleware/wrapper";
import { formatErrors, getQueryObject } from "@/lib/utils";
import { couponQuerySchema } from "@/lib/validation/coupon-schema";
import { listNameSchema, modifyList } from "@/lib/validation/list-schema";
import prisma from "@/prisma/client";
import { User } from "@prisma/client";
import { ApiError } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";

async function GET_handler(request: NextRequest) {
  const user = JSON.parse(request.cookies.get("user")!.value!) as User;
  const searchParams = request.nextUrl.searchParams;
  const query = getQueryObject(searchParams);
  const { success, data, error } = listNameSchema.safeParse(query);
  if (!success) throw new ApiError(400, formatErrors(error).message);
  const { listName } = data;
  // if listName is provided, get the list
  if (listName && listName !== "wishlist") {
    const list = await prisma.list.findUnique({
      where: { userId_name: { userId: user.id, name: listName } },
      include: { products: true },
    });
    return NextResponse.json(list);
  }
  // Get the user wishlist
  if (!user.wishlist) return NextResponse.json(null);
  const wishlist = await prisma.list.findUnique({
    where: { id: user.wishlist },
    include: { products: true },
  });
  return NextResponse.json(wishlist);
}

async function POST_handler(request: NextRequest) {
  const user = JSON.parse(request.cookies.get("user")!.value!) as User;
  // Get the body of the request and validate it
  const body = await request.json();
  const { success, data, error } = modifyList.safeParse(body);
  if (!success) throw new ApiError(400, formatErrors(error).message);
  const { listName, productId } = data;
  // Check if product exists
  if (!(await prisma.product.findUnique({ where: { id: productId } })))
    throw new ApiError(404, "Product not found");
  // if listName is provided, add the product to the list
  if (listName && listName !== "wishlist") {
    const list = await prisma.list.findUnique({
      where: { userId_name: { userId: user.id, name: listName } },
    });
    if (!list) throw new ApiError(404, "List not found");
    // Check if the product is already in the list
    const productInList = list.productsId.find(id => id === productId);
    if (productInList) throw new ApiError(400, "Product already in list");
    // Add the product to the list
    const updatedList = await prisma.list.update({
      where: { id: list.id },
      data: { products: { connect: { id: productId } } },
    });
    return NextResponse.json(updatedList);
  }

  // Get the user wishlist
  const wishlist = user.wishlist
    ? await prisma.list.findUnique({ where: { id: user.wishlist } })
    : await prisma.list.create({
        data: { userId: user.id, name: "wishlist" },
        include: { products: true },
      });
  if (!wishlist) throw new ApiError(500, "Wishlist not found");
  // If we created a new wishlist, update the user
  if (!user.wishlist)
    await prisma.user.update({ where: { id: user.id }, data: { wishlist: wishlist.id } });
  // Check if the product is already in the wishlist
  const productInWishlist = wishlist.productsId.find(id => id === productId);
  if (productInWishlist) throw new ApiError(400, "Product already in wishlist");
  // Add the product to the wishlist
  const updatedWishlist = await prisma.list.update({
    where: { id: wishlist.id },
    data: { products: { connect: { id: productId } } },
  });
  return NextResponse.json(updatedWishlist);
}

async function DELETE_handler(request: NextRequest) {
  const user = JSON.parse(request.cookies.get("user")!.value!) as User;
  // Get the body of the request and validate it
  const body = await request.json();
  const { success, data, error } = modifyList.safeParse(body);
  if (!success) throw new ApiError(400, formatErrors(error).message);
  const { listName, productId } = data;
  // Check if product exists
  if (!(await prisma.product.findUnique({ where: { id: productId } })))
    throw new ApiError(404, "Product not found");
  // if listName is provided, delete the product from the list
  if (listName && listName !== "wishlist") {
    const list = await prisma.list.findUnique({
      where: { userId_name: { userId: user.id, name: listName } },
    });
    if (!list) throw new ApiError(404, "List not found");
    // Check if the product is already in the list
    const productInList = list.productsId.find(id => id === productId);
    if (!productInList) throw new ApiError(400, "Product not in list");
    // Delete the product from the list
    const updatedList = await prisma.list.update({
      where: { id: list.id },
      data: { products: { disconnect: { id: productId } } },
    });
    return NextResponse.json(updatedList);
  }

  // Get the user wishlist
  if (!user.wishlist) throw new ApiError(404, "Wishlist not found");
  const wishlist = await prisma.list.findUnique({ where: { id: user.wishlist } });
  if (!wishlist) throw new ApiError(404, "Wishlist not found");
  // Check if the product is not in the wishlist
  const productInWishlist = wishlist.productsId.find(id => id === productId);
  if (!productInWishlist) throw new ApiError(400, "Product not in wishlist");
  // Delete the product from the wishlist
  const updatedWishlist = await prisma.list.update({
    where: { id: wishlist.id },
    data: { products: { disconnect: { id: productId } } },
  });
  return NextResponse.json(updatedWishlist);
}

export const GET = wrapperMiddleware(authMiddleware, GET_handler);
export const POST = wrapperMiddleware(authMiddleware, POST_handler);
export const DELETE = wrapperMiddleware(authMiddleware, DELETE_handler);
