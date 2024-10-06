import mongoose from "mongoose";
import { createServer } from "http";

import app from "./app";
import { getEnv } from "./utils";

const port = getEnv("PORT", 3000);
const mongodb_password = getEnv("MONGODB_PASSWORD");
const mongodb_url = getEnv("MONGODB_URL").replace(
  "<db_password>",
  mongodb_password
);

mongoose
  .connect(mongodb_url, { dbName: "intelliger" })
  .then(() => console.log("Mongodb connected successfully!"))
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });

export const server = createServer(app);

server.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
