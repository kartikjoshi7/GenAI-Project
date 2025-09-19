# 🧠 LexiAI: AI-Powered Document Analysis

**LexiAI** is a full-stack web application designed to simplify complex documents. It leverages the power of the Mistral 7B language model, running locally via Ollama, to provide users with instant text simplification, summarization, and risk analysis for their documents.

**[Report a Bug](https://github.com/your-username/LexiAI/issues)** &nbsp;&nbsp;•&nbsp;&nbsp; **[Request a Feature](https://github.com/your-username/LexiAI/issues)**

---

### ✨ Key Features

-   ✅ **Versatile Document Handling:** Upload files (`.pdf`, `.doc`, `.docx`, `.txt`) or paste text directly.
-   ✅ **AI-Powered Simplification:** Rewrites complex jargon and convoluted sentences into clear, easy-to-understand language.
-   ✅ **Automatic Summarization:** Generates concise summaries of long documents, saving you time.
-   ✅ **Intelligent Risk Analysis:** Scans text to identify potential risks, ambiguities, or critical clauses.
-   ✅ **Local & Private:** All AI processing is done locally via Ollama, ensuring your documents remain private.

### 🚀 Tech Stack

| Category            | Technology                                           |
| ------------------- | ---------------------------------------------------- |
| **Frontend** | `React` `Vite` `TailwindCSS` `Framer Motion`         |
| **Backend** | `Node.js` `Express`                                  |
| **AI Integration** | `Ollama` `Mistral 7B`                                |
| **Document Parsing**| `pdf-parse` `mammoth`                                |

### 📂 Project Structure

```lexi-ai/
├── backend/            # Express.js server (API, AI logic, file parsing)
│   ├── src/
│   ├── .env.example    # Environment variable template
│   └── package.json
├── frontend/           # React.js client (UI)
│   ├── src/
│   └── package.json
├── .gitignore          # Git ignore configuration
└── README.md           # You are here!
```

---

## 🛠️ Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development.

### 📋 Prerequisites

Ensure you have the following software installed on your system before you begin:

-   [**Node.js**](https://nodejs.org/) (v18.x or later is recommended)
-   [**Git**](https://git-scm.com/) for version control
-   [**Ollama**](https://ollama.com/) to run the local language model

### ⚙️ Installation & Setup

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/kartikjoshi7/LexiAI.git
    cd LexiAI
    ```

2.  **Set up Ollama & Mistral Model**
    -   First, [download and install Ollama](https://ollama.com/).
    -   After installation, run the following command in your terminal to pull the Mistral model. This may take some time.
        ```bash
        ollama pull mistral:7b
        ```
    -   **Important:** Make sure the Ollama application is running in the background before starting the backend server.

3.  **Configure and Run the Backend**
    -   Navigate to the backend directory:
        ```bash
        cd backend
        ```
    -   Install the required npm packages:
        ```bash
        npm install
        ```
    -   Create a local environment file by copying the example file. This file will hold your environment variables.
        ```bash
        cp .env.example .env
        ```
    -   Start the backend server:
        ```bash
        npm run dev
        ```
    -   The server should now be running on **`http://localhost:5000`**.

4.  **Configure and Run the Frontend**
    -   Open a **new terminal window** and navigate back to the project's root directory. Then, move into the frontend directory:
        ```bash
        cd frontend
        ```
    -   Install the required npm packages:
        ```bash
        npm install
        ```
    -   Start the frontend development server:
        ```bash
        npm run dev
        ```
    -   The application should now be running on **`http://localhost:3000`**.

### 💡 Usage

With both the backend and frontend servers running, open your browser and navigate to `http://localhost:3000`. You can now upload a document or paste text to begin analyzing!

---

### 🌟 Future Enhancements

-   [ ] **Cloud Integration:** Offer an option to use a Google Cloud-hosted backend for more powerful processing.
-   [ ] **UI/UX Overhaul:** Implement a more modern and interactive user interface.
-   [ ] **Export Results:** Add functionality to export the simplified text, summary, and analysis as a PDF or Word document.
-   [ ] **Analytics Dashboard:** Create a dashboard for users to view their usage history and analysis trends.
-   [ ] **Mobile Responsiveness:** Ensure a seamless experience on mobile and tablet devices.
