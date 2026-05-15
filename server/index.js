// server/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import generateRoute from "./routes/generateRoute.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", generateRoute);

app.listen(5000, () => {
  console.log("✅ Server running on http://localhost:5000");
});