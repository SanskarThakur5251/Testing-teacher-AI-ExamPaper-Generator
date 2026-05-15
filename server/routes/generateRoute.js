// server/routes/generateRoute.js
import express from "express";
import upload from "../utils/upload.js";
import { generatePaper } from "../controllers/generateController.js";

const router = express.Router();

router.post("/generate", upload.single("file"), generatePaper);

export default router;