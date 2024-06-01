import { Role, User } from "@prisma/client";
import { ApiError } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "./auth";

/**
 * Check if the user has the required permissions
 * Hierarchy of roles: admin > support > vendor > user
 * ex: admin means only admin is allowed
 * ex: vendor means admin, support and vendor are allowed
 * @param minAllowedRole  The minimum role required
 * @param user The user object
 * @returns { boolean } True if the user has the required permissions
 */
export function isAllowed(minAllowedRole: Role, user: User): boolean {
  const rolesHierarchy: Role[] = ["admin", "support", "vendor", "user"];
  const allowed = rolesHierarchy.slice(
    0,
    rolesHierarchy.findIndex(value => value === minAllowedRole)
  );
  return allowed.includes(user.role);
}

/**
 * Middleware to check if the user has the required permissions
 * @param permissions { Permissions } The permissions required
 */
export const allowedMiddleware =
  (role: Role) => async (request: NextRequest, response: NextResponse) => {
    await authMiddleware(request, response);
    const user = JSON.parse(request.cookies.get("user")!.value!) as User;
    if (isAllowed(role, user)) return;
    throw new ApiError(403, "Unauthorized");
  };
