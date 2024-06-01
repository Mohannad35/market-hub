import { authMiddleware } from "@/lib/middleware/auth";
import { wrapperMiddleware } from "@/lib/middleware/wrapper";
import { formatErrors, getQueryObject } from "@/lib/utils";
import { usersQuerySchema } from "@/lib/validation/user-schema";
import { logger } from "@/logger";
import prisma from "@/prisma/client";
import { Prisma, User } from "@prisma/client";
import sendgrid from "@sendgrid/mail";
import { ApiError } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";

if (!process.env.SENDGRID_API_KEY)
  logger.warn("SENDGRID_API_KEY is missing. Emails will not be sent.");
else sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

async function GET_handler(request: NextRequest) {
  const { role } = JSON.parse(request.cookies.get("user")!.value!) as User;
  if (role !== "admin") throw new ApiError(401, "Unauthorized");
  const searchParams = request.nextUrl.searchParams;
  const query = getQueryObject(searchParams);
  const { success, data, error } = usersQuerySchema.safeParse(query);
  if (!success) throw new ApiError(400, formatErrors(error).message);
  const { sortBy, direction, search } = data;
  let orderBy:
    | Prisma.UserOrderByWithRelationInput
    | Prisma.UserOrderByWithRelationInput[]
    | undefined;
  if (sortBy === "phoneNumber") orderBy = { phoneNumber: { number: direction as "asc" | "desc" } };
  else orderBy = { [sortBy]: direction as "asc" | "desc" };
  const users = await prisma.user.findMany({
    where: { name: { contains: search, mode: "insensitive" } },
    orderBy,
  });
  return NextResponse.json(users);
}

export const GET = wrapperMiddleware(authMiddleware, GET_handler);
