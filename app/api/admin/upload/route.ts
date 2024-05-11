import cloudinary from "@/lib/cloudinary";
import { wrapperMiddleware } from "@/lib/middleware/wrapper";
import { formatErrors } from "@/lib/utils";
import { adminUploadSchema } from "@/lib/validation-schemas";
import { ApiError } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";

async function DELETE_handler(request: NextRequest) {
  // Get the body of the request and validate it
  const body = await request.json();
  const { success, data, error } = adminUploadSchema.safeParse(body);
  if (!success) throw new ApiError(400, formatErrors(error).message);
  const { publicId } = data;
  publicId.forEach(async id => {
    console.log("Deleting image with publicId:", id);
    const { result } = await cloudinary.uploader.destroy(id, { invalidate: true });
    console.log(id, result);
  });
  return NextResponse.json({}, { status: 202 });
}

export const DELETE = wrapperMiddleware(DELETE_handler);
