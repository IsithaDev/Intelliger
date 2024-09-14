import dotenv from "dotenv";
import { v2 as Cloudinary } from "cloudinary";

import { getEnv } from "../utils";

dotenv.config();

Cloudinary.config({
  cloud_name: getEnv("CLOUDINARY_CLOUD_NAME"),
  api_key: getEnv("CLOUDINARY_API_KEY"),
  api_secret: getEnv("CLOUDINARY_API_SECRET"),
});

export default Cloudinary;
