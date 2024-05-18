import { auth } from "@/auth";
import { wrapperMiddleware } from "@/lib/middleware/wrapper";
import prisma from "@/prisma/client";
import { User } from "@prisma/client";
import { pick } from "lodash";
import { ApiError } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";

async function GET_handler(
  request: NextRequest,
  { params: { username } }: { params: { username: string } }
): Promise<NextResponse<Partial<User> | null>> {
  const session = await auth();
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) throw new ApiError(404, "User not found");
  if (session?.user.role === "admin" || session?.user.username === user.username)
    return NextResponse.json(user);
  return NextResponse.json(
    pick(user, ["name", "avatar", "image", "role", "businessAddress", "websiteAddress"])
  );
}

export const GET = wrapperMiddleware(GET_handler);
