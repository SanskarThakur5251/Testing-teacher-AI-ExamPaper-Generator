import { useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);

  const [formData, setFormData] = useState({
    mcq: { count: 0, marks: 0 },
    fillBlanks: { count: 0, marks: 0 },
    descriptive: { count: 0, marks: 0 },
    match: { count: 0, marks: 0 },
    diagram: { count: 0, marks: 0 },
  });

  // 🔁 Handle input changes
  const handleChange = (e, type, field) => {
    setFormData({
      ...formData,
      [type]: {
        ...formData[type],
        [field]: Number(e.target.value),
      },
    });
  };

  // 🧮 Calculate total marks
  const calculateTotalMarks = () => {
    return (
      formData.mcq.count * formData.mcq.marks +
      formData.fillBlanks.count * formData.fillBlanks.marks +
      formData.descriptive.count * formData.descriptive.marks +
      formData.match.count * formData.match.marks +
      formData.diagram.count * formData.diagram.marks
    );
  };

  // 📋 Generate Dummy Question Paper (Fallback)
  const generateDummyPaper = (totalMarks) => {
    let dummyContent = `
      <h4>SECTION A - Multiple Choice Questions (1 mark each)</h4>
      <p><strong>1.</strong> Which of the following is correct?</p>
      <p>a) Option A &nbsp;&nbsp;&nbsp; b) Option B &nbsp;&nbsp;&nbsp; c) Option C &nbsp;&nbsp;&nbsp; d) Option D</p>
      
      <p><strong>2.</strong> What is the main concept?</p>
      <p>a) Concept 1 &nbsp;&nbsp;&nbsp; b) Concept 2 &nbsp;&nbsp;&nbsp; c) Concept 3 &nbsp;&nbsp;&nbsp; d) Concept 4</p>
      
      <p><strong>3.</strong> Choose the appropriate answer:</p>
      <p>a) Answer A &nbsp;&nbsp;&nbsp; b) Answer B &nbsp;&nbsp;&nbsp; c) Answer C &nbsp;&nbsp;&nbsp; d) Answer D</p>
      
      <hr/>
      
      <h4>SECTION B - Fill in the Blanks (1 mark each)</h4>
      <p><strong>4.</strong> The process is known as ______________.</p>
      <p><strong>5.</strong> ______________ is an important concept in this field.</p>
      <p><strong>6.</strong> The formula for this is ______________.</p>
      
      <hr/>
      
      <h4>SECTION C - Short Answer Questions (2 marks each)</h4>
      <p><strong>7.</strong> Explain the basic principle in 2-3 sentences.</p>
      <p style="min-height: 60px; border: 1px solid #ccc; padding: 10px;"></p>
      
      <p><strong>8.</strong> Describe the main characteristics in brief.</p>
      <p style="min-height: 60px; border: 1px solid #ccc; padding: 10px;"></p>
      
      <hr/>
      
      <h4>SECTION D - Long Answer Questions (5 marks each)</h4>
      <p><strong>9.</strong> Provide a detailed explanation of the topic with examples.</p>
      <p style="min-height: 100px; border: 1px solid #ccc; padding: 10px;"></p>
      
      <p><strong>10.</strong> Discuss the application and significance of this concept.</p>
      <p style="min-height: 100px; border: 1px solid #ccc; padding: 10px;"></p>
      
      <hr/>
      
      <h4>SECTION E - Answer Key</h4>
      <p><strong>1. (c)</strong></p>
      <p><strong>2. (a)</strong></p>
      <p><strong>3. (b)</strong></p>
      <p><strong>4.</strong> (Answer may vary - refer to syllabus)</p>
      <p><strong>5.</strong> (Answer may vary - refer to syllabus)</p>
      <p><strong>6.</strong> (Answer may vary - refer to syllabus)</p>
      <p><strong>7.</strong> Sample Answer: [Provide appropriate explanation based on the content]</p>
      <p><strong>8.</strong> Sample Answer: [Provide appropriate characteristics]</p>
      <p><strong>9.</strong> Sample Answer: [Provide detailed explanation with examples]</p>
      <p><strong>10.</strong> Sample Answer: [Discuss application and significance]</p>
    `;
    return dummyContent;
  };

  // 🚀 SUBMIT HANDLER (FIXED VERSION WITH DUMMY FALLBACK)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Upload file");
      return;
    }

    const totalMarks = calculateTotalMarks();

    if (totalMarks === 0) {
      alert("Enter marks");
      return;
    }

    // ✅ OPEN TAB FIRST (CRITICAL)
    const newWindow = window.open("", "_blank");

    if (!newWindow) {
      alert("Popup blocked! Please allow popups.");
      return;
    }

    // ⏳ Loading screen
    newWindow.document.write(`
      <html>
        <body style="font-family: Arial; padding: 20px;">
          <h2>Generating question paper...</h2>
          <p>Please wait ⏳</p>
        </body>
      </html>
    `);

    const data = new FormData();
    data.append("file", file);
    data.append("questionData", JSON.stringify(formData));
    data.append("totalMarks", totalMarks);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/generate",
        data
      );

      const paper = res.data.paper || "No content generated";

      // ✅ Update same tab with actual paper
      newWindow.document.body.innerHTML = `
        <div style="font-family: Times New Roman; margin: 40px;">
          <h2 style="text-align:center;">ABC Public School</h2>
          <h3 style="text-align:center;">Question Paper</h3>
          <p style="text-align:center;">Time: 3 Hours | Max Marks: ${totalMarks}</p>
          <hr/>

          <div>
            ${paper.replace(/\n/g, "<br>")}
          </div>

          <br/><br/>
          <button onclick="window.print()">🖨 Print / Save PDF</button>
        </div>
      `;
    } catch (err) {
      console.error(err);

      // 📋 Show Dummy Paper on Error
      const dummyPaper = generateDummyPaper(totalMarks);
      
      newWindow.document.body.innerHTML = `
        <div style="font-family: Times New Roman; margin: 40px;">
          <div style="background-color: #fff3cd; border: 2px solid #ff9800; padding: 15px; margin-bottom: 20px; border-radius: 5px;">
            <h3 style="color: #ff6f00; margin: 0;">⚠️ API Error - Showing Demo Paper</h3>
            <p style="color: #d84315; margin: 5px 0;">The AI service is temporarily unavailable. Here's a sample question paper template.</p>
          </div>
          
          <h2 style="text-align:center;">ABC Public School</h2>
          <h3 style="text-align:center;">Question Paper (Demo/Sample)</h3>
          <p style="text-align:center;">Time: 3 Hours | Max Marks: ${totalMarks}</p>
          <hr/>

          <div>
            ${dummyPaper}
          </div>

          <br/><br/>
          <button onclick="window.print()">🖨 Print / Save PDF</button>
        </div>
      `;
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h1>📄 AI Question Paper Generator</h1>

      <form onSubmit={handleSubmit}>
        {/* File Upload */}
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            📁 Upload Document:
          </label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
          />
          {file && <p style={{ color: "green", fontSize: "14px" }}>✅ {file.name} selected</p>}
        </div>

        <h3>Question Configuration</h3>

        {/* Dynamic Fields */}
        {Object.keys(formData).map((type) => (
          <div key={type} style={{ marginBottom: "15px", padding: "10px", backgroundColor: "#f5f5f5", borderRadius: "4px" }}>
            <h4 style={{ marginTop: "0", textTransform: "capitalize" }}>{type.replace(/([A-Z])/g, " $1").trim()}</h4>

            <div style={{ marginBottom: "8px" }}>
              <label style={{ display: "block", marginBottom: "3px" }}>Count:</label>
              <input
                type="number"
                min="0"
                onChange={(e) => handleChange(e, type, "count")}
                style={{ padding: "5px", width: "100%", borderRadius: "4px", border: "1px solid #ccc" }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "3px" }}>Marks:</label>
              <input
                type="number"
                min="0"
                onChange={(e) => handleChange(e, type, "marks")}
                style={{ padding: "5px", width: "100%", borderRadius: "4px", border: "1px solid #ccc" }}
              />
            </div>
          </div>
        ))}

        <div style={{ marginTop: "20px", padding: "10px", backgroundColor: "#e3f2fd", borderRadius: "4px" }}>
          <p style={{ margin: "0" }}>
            <strong>Total Marks: {calculateTotalMarks()}</strong>
          </p>
        </div>

        <br />
        <button 
          type="submit" 
          style={{
            padding: "12px 20px",
            fontSize: "16px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            width: "100%",
            fontWeight: "bold"
          }}
        >
          🚀 Generate Paper
        </button>
      </form>
    </div>
  );
}

export default App;
