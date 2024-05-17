import { logger } from "@/logger";

export async function processResponse(response: Response) {
  if (response.ok) return await response.json();
  else if (response.status >= 400 && response.status < 500) {
    throw new Error((await response.json()).message || response.statusText);
  } else {
    logger.error(response);
    throw new Error("A server error occurred");
  }
}
