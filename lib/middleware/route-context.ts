/**
 * Next.js 15 App Router passes this as the second argument to route handlers.
 */
export type AppRouteContext = {
  params: Promise<Record<string, string | string[] | undefined>>;
};
