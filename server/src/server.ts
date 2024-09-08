import dotenv from "dotenv";
import mongoose from "mongoose";
import { createServer } from "http";

import app from "./app";
import { getEnv } from "./utils";

dotenv.config();

const port = getEnv("PORT", 3000);
const mongodb_password = getEnv("MONGODB_PASSWORD");
const mongodb_url = getEnv("MONGODB_URL").replace(
  "<db_password>",
  mongodb_password
);

mongoose
  .connect(mongodb_url, { dbName: "intelliger" })
  .then(() => console.log("Mongodb connected successfully!"))
  .catch((err) => console.error(err));

const server = createServer(app);

server.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
