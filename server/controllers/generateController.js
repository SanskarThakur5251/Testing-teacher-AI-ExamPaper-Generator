import fs from "fs";
import { getGeminiModel } from "../utils/gemini.js";

export const generatePaper = async (req, res) => {
  try {
    console.log("🔥 API HIT");

    const model = getGeminiModel();

    const questionData = JSON.parse(req.body.questionData);
    const totalMarks = req.body.totalMarks;

    // ⚠️ For now using text file (PDF handled separately)
    const fileContent = fs.readFileSync(req.file.path, "utf-8").slice(0, 3000);

    const prompt = `
Generate a CBSE-style question paper.

Content:
${fileContent}

Requirements:
MCQ: ${questionData.mcq.count} (${questionData.mcq.marks} marks each)
Fill in the blanks: ${questionData.fillBlanks.count}
Descriptive: ${questionData.descriptive.count}
Match: ${questionData.match.count}
Diagram: ${questionData.diagram.count}

Total Marks: ${totalMarks}

Rules:
- Sections A–E
- Clean format
- Include answers
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.json({ paper: text });

  } catch (error) {
    console.error("❌ Gemini Error:", error);

    res.json({
      paper: "⚠️ Failed to generate. Try again later.",
    });
  }
};