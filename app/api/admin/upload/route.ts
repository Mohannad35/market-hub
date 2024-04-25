import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
cloudinary.config({
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
});

export async function DELETE(req: NextRequest) {
  // Get the body of the request and validate it
  const { publicId }: { publicId: string[] } = await req.json();
  if (!publicId || publicId.length < 1)
    return NextResponse.json({ error: "No publicId provided" }, { status: 400 });
  publicId.forEach(async id => await cloudinary.uploader.destroy(id));
  return NextResponse.json({}, { status: 202 });
}
