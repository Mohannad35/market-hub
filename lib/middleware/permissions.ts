import { User } from "@prisma/client";
import { ApiError } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "./auth";

type Permissions = Partial<Pick<User, "isAdmin" | "isSupport" | "isVendor" | "isVerified">>;
/**
 * Middleware to check if the user has the required permissions
 * @param permissions { Permissions } The permissions required
 */
export const allowedMiddleware =
  (permissions: Permissions) => async (request: NextRequest, response: NextResponse) => {
    await authMiddleware(request, response);
    const user = JSON.parse(request.cookies.get("user")!.value!) as User;
    const allowed = Object.keys(permissions).filter(key => permissions[key as keyof Permissions]);
    if (!allowed.includes("isAdmin") && user.isAdmin) return;
    if (!allowed.includes("isSupport") && user.isSupport) return;
    if (!allowed.includes("isVendor") && user.isVendor) return;
    if (!allowed.includes("isVerified") && user.isVerified) return;
    throw new ApiError(403, "Unauthorized");
  };
