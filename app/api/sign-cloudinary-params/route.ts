import { wrapperMiddleware } from "@/lib/middleware/wrapper";
import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

async function POST_handler(request: NextRequest) {
  const body = await request.json();
  const { paramsToSign } = body;
  if (!process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET)
    throw new Error("NEXT_PUBLIC_CLOUDINARY_API_SECRET is not set");
  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET
  );

  return NextResponse.json({ signature });
}

export const POST = wrapperMiddleware(POST_handler);
