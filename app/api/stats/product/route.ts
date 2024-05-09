import { authMiddleware } from "@/lib/middleware/auth";
import { wrapperMiddleware } from "@/lib/middleware/wrapper";
import prisma from "@/prisma/client";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";

const GET_handler = async (request: NextRequest) => {
  const monthlyProducts = await prisma.$transaction([
    ...Array.from({ length: 12 }).map((_, i) =>
      prisma.product.aggregate({
        _count: true,
        where: {
          createdAt: {
            // prettier-ignore
            gte: moment().subtract(12 - i, "month").toDate(),
            // prettier-ignore
            lt: moment().subtract(11 - i, "month").toDate(),
          },
        },
      })
    ),
  ]);

  return NextResponse.json(
    monthlyProducts.map(({ _count }, i) => ({
      products: _count,
      // prettier-ignore
      month: moment().subtract(11 - i, "month").format("MMM"),
    }))
  );
};

export const GET = wrapperMiddleware(authMiddleware, GET_handler);
