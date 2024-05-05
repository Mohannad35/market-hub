import { ApiError } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";

/**
 * Wrapper middleware to handle errors and exceptions in the route handlers
 * @param handlers Middleware functions to be executed in order. The last function should be the main handler
 * @returns route handler
 */
export const wrapperMiddleware =
  (...handlers: Function[]) =>
  async (request: NextRequest, response: NextResponse) => {
    try {
      for (const handler of handlers) {
        const res = await handler(request, response);
        if (res instanceof NextResponse) return res;
      }
    } catch (error) {
      if (error instanceof ApiError) {
        return NextResponse.json({ message: error.message }, { status: error.statusCode });
      } else if (error instanceof Error) {
        /// Log server errors using winston or your preferred logger
        console.log(error);
        return NextResponse.json(
          { message: error.message || "Server died for some reason" },
          { status: 500 }
        );
      } else {
        /// Log server errors using winston or your preferred logger
        console.log(error);
        return NextResponse.json({ message: "Server died for some reason" }, { status: 500 });
      }
    }
  };
