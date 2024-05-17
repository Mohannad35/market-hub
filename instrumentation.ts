import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // configures the initialization of Sentry on the server.
    // The config you add here will be used whenever the server handles a request.
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/

    Sentry.init({
      dsn: process.env.SENTRY_DSN,

      // Adjust this value in production, or use tracesSampler for greater control
      tracesSampleRate: 1,

      // Setting this option to true will print useful information to the console while you're setting up Sentry.
      debug: false,

      // Uncomment the line below to enable Spotlight (https://spotlightjs.com)
      // spotlight: process.env.NODE_ENV === 'development',
    });
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    // configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
    // The config you add here will be used whenever one of the edge features is loaded.
    // Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/

    Sentry.init({
      dsn: process.env.SENTRY_DSN,

      // Adjust this value in production, or use tracesSampler for greater control
      tracesSampleRate: 1,

      // Setting this option to true will print useful information to the console while you're setting up Sentry.
      debug: false,
    });
  }
}
