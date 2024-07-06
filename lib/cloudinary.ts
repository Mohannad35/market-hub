import { v2 } from "cloudinary";

declare global {
  var cloudinaryGlobal: undefined | typeof v2;
}

const cloudinarySingleton = () => {
  v2.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  return v2;
};

const cloudinary = globalThis.cloudinaryGlobal ?? cloudinarySingleton();

export default cloudinary;

if (process.env.NODE_ENV !== "production") globalThis.cloudinaryGlobal = cloudinary;
