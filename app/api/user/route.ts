import { authMiddleware } from "@/lib/middleware/auth";
import { wrapperMiddleware } from "@/lib/middleware/wrapper";
import { User } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

async function GET_handler(request: NextRequest): Promise<NextResponse<User | null>> {
  const user = JSON.parse(request.cookies.get("user")!.value!) as User;
  return NextResponse.json(user);
}

export const GET = wrapperMiddleware(authMiddleware, GET_handler);
