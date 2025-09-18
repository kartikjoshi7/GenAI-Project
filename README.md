# 🧠📄 LexiAI  

**Document Simplification & Risk Analysis Tool**  

LexiAI is a full-stack web app that lets users upload documents (PDF, DOC, DOCX, TXT) or paste text directly.  
It simplifies content, generates summaries, and provides risk analysis using AI powered by **Mistral 7B** running locally with **Ollama**.  

---

## 🚀 Tech Stack  

- **Frontend:** React + Vite + TailwindCSS + Framer Motion  
- **Backend:** Node.js + Express  
- **AI Integration:** Ollama (Mistral 7B)  
- **Document Parsing:** pdf-parse, mammoth (DOCX), text parsing  

---

## 📂 Project Structure  

LexiAI/
├── backend/ # Express server (AI + document parsing)
├── frontend/ # React + Vite client
├── .gitignore # Ignored files & folders
└── README.md # Project documentation

yaml
Copy code

---

## ⚙️ Setup Instructions  

### 1️⃣ Clone the Repository  
```bash
git clone https://github.com/your-username/LexiAI.git
cd LexiAI
2️⃣ Install & Run Ollama (Required)
LexiAI uses Ollama with the Mistral 7B model for AI-powered text processing.

Download & install Ollama → https://ollama.ai

Ensure Ollama service is running locally.

Pull the Mistral 7B model:

bash
Copy code
ollama pull mistral:7b
Keep Ollama running in the background.

3️⃣ Backend Setup
bash
Copy code
cd backend
npm install
npm run dev
➡ Runs on http://localhost:5000

4️⃣ Frontend Setup
bash
Copy code
cd ../frontend
npm install
npm run dev
➡ Runs on http://localhost:3000

🛠 Features
✅ Upload documents (PDF, DOC, DOCX, TXT)

✅ Paste text directly

✅ AI-powered text simplification (Mistral 7B via Ollama)

✅ Summary generation

✅ Risk analysis

✅ Multi-language support

📌 Future Enhancements
☁️ Google Cloud backend integration for scalability
🎨 Improved UI/UX with more modern components
🧩 Additional functionalities & tools for advanced analysis
🌍 Export results as PDF/Word
📊 Enhanced analytics dashboard with charts & insights
📱 Mobile-friendly UI