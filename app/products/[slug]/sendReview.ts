"use server";

import { auth } from "@/auth";
import { getFormDataObject } from "@/lib/utils";
import prisma from "@/prisma/client";

export const createReview = async (formData: FormData, productId: string) => {
  // Authenticate the user
  const session = await auth();
  if (!session?.user) return { error: { message: "Unauthorized" } };
  const { user } = session;
  // Get the data from the form
  const data = getFormDataObject<{ rating: string; title: string; comment: string }>(formData);
  const { title, comment } = data;
  const rate = parseInt(data.rating);
  // Get the product
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return { error: { message: "Product not found" } };
  // Check if the user has already rated the product and want to edit it
  const existingRate = await prisma.rate.findUnique({
    where: { productId_userId: { productId, userId: user.id! } },
  });
  if (existingRate) {
    // Calculate the product rating without the old rate
    const newRating =
      (product.rating * product.ratingCount - existingRate.rate + rate) / product.ratingCount;
    const [rating] = await prisma.$transaction([
      prisma.rate.update({ where: { id: existingRate.id }, data: { rate, title, comment } }),
      prisma.product.update({ where: { id: productId }, data: { rating: newRating } }),
    ]);
    return { data: rating };
  }
  // Calculate the new rating
  const newRating = (product.rating * product.ratingCount + rate) / (product.ratingCount + 1);
  const [rating] = await prisma.$transaction([
    prisma.rate.create({
      data: {
        rate,
        title,
        comment,
        product: { connect: { id: productId } },
        user: { connect: { id: user.id } },
      },
    }),
    prisma.product.update({
      where: { id: productId },
      data: {
        rating: newRating,
        ratingCount: { increment: 1 },
      },
    }),
  ]);
  return { data: rating };
};
