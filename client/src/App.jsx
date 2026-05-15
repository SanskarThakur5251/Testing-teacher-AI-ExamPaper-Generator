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

  // 🚀 SUBMIT HANDLER (FIXED VERSION)
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

      // ✅ Update same tab
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

      newWindow.document.body.innerHTML = `
        <h2 style="color:red;">❌ Error generating paper</h2>
        <p>Check backend or API quota</p>
      `;
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h1>📄 AI Question Paper Generator</h1>

      <form onSubmit={handleSubmit}>
        {/* File Upload */}
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <h3>Question Configuration</h3>

        {/* Dynamic Fields */}
        {Object.keys(formData).map((type) => (
          <div key={type}>
            <h4>{type}</h4>

            Count:
            <input
              type="number"
              min="0"
              onChange={(e) => handleChange(e, type, "count")}
            />

            Marks:
            <input
              type="number"
              min="0"
              onChange={(e) => handleChange(e, type, "marks")}
            />
          </div>
        ))}

        <br />
        <button type="submit">🚀 Generate Paper</button>
      </form>
    </div>
  );
}

export default App;