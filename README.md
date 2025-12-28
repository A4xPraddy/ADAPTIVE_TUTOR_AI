# ADAPTIVE TUTOR AI | Agentic Learning Ecosystem
### *Autonomous Multi-Agent Orchestrator for Personalized Rapid Mastery*

![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![Python](https://img.shields.io/badge/Python-3.10%2B-green)
![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Tailwind-61dafb)
![Inference](https://img.shields.io/badge/Inference-Groq%20LPU-orange)
![Orchestration](https://img.shields.io/badge/Orchestration-CrewAI-red)

**Adaptive Tutor AI** is a high-performance, full-stack agentic platform designed to automate personalized learning journeys. Moving beyond simple chatbots, this system orchestrates a "Faculty of AI Agents" to design intensive daily curricula, generate real-time technical visualizations, and provide high-fidelity technical instruction with sub-5-second latency.

---

## 🧠 System Architecture & Workflow

The platform operates on a **Sequential Agentic Workflow**, ensuring that every lesson and quiz is contextually aware of the student's specific learning path.

### 1. The Orchestration Layer (CrewAI)
The system employs specialized AI agents, each with a distinct "Brain" and "Persona":
*   **The Curriculum Architect:** Analyzes the subject and duration to build a strict JSON-based daily roadmap.
*   **The Senior Instructor:** Converts raw topics into deep-dive markdown lessons, mental models, and code playgrounds.
*   **The Technical Tutor:** An asynchronous doubt-solver that uses previous session memory to provide contextual support.

### 2. The Inference Engine (Groq LPU)
To achieve elite performance, the system utilizes **Groq’s LPU (Language Processing Unit)** infrastructure running **Llama 3.3 70B**. 
*   **Benefit:** Reduces response time for 2,000+ token curriculum generation from ~30 seconds (Standard Cloud) to **< 4 seconds**.

### 3. Visual Logic Engine (Mermaid.js)
The system dynamically generates **Mermaid.js syntax** within lesson briefs. The frontend interprets this to render live flowcharts, allowing students to visualize the logic of the code they are learning.

---

## 🌟 Key Features

*   **Mission Control Dashboard:** A futuristic, dark-mode UI with high-animation transitions powered by Framer Motion.
*   **Daily Phase Timeline:** Breaks down complex subjects into "Daily Phases" rather than vague weeks.
*   **Neural-Link Briefs:** Each task includes a "Learning Card" featuring:
    *   **Mental Models:** Real-world analogies for abstract concepts.
    *   **Code Playgrounds:** Ready-to-use snippets with modern syntax.
    *   **Visual Logic:** Auto-generated diagrams via Mermaid.js.
*   **Context-Aware Quizzing:** Quizzes are strictly generated based on the *Learning Objectives* saved in the session state—eliminating "hallucinated" or irrelevant questions.

---

## 🛠️ Technical Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, Tailwind CSS v4, Framer Motion, Lucide Icons |
| **Backend** | FastAPI (Asynchronous Python) |
| **AI Framework** | CrewAI (Agentic Orchestration) |
| **LLM Models** | Llama 3.3 70B via Groq API |
| **Data Logic** | Pydantic (Strict Data Validation), LiteLLM |
| **Visualization** | Mermaid.js |

---

## 🚀 Installation & Setup

### Prerequisites
* Python 3.10 or 3.11
* Node.js (v18+)
* Groq API Key (Free at [console.groq.com](https://console.groq.com))

### 1. Backend Setup
```bash
# Clone the repository
git clone https://github.com/A4xPraddy/ADAPTIVE_TUTOR_AI.git
cd ADAPTIVE_TUTOR_AI

# Install dependencies
pip install -r requirements.txt

# Configure Environment
# Create a .env file and add:
GROQ_API_KEY=your_gsk_key_here
```
### 2. Frontend Setup
```bash
cd frontend
npm install
```
### 3. Running the Project
#### Terminal 1 (Backend):
```bash
.\.venv\Scripts\python.exe -m uvicorn coordinator.main:app --reload
```
### Terminal 2 (Frontend):
```bash
npm run dev
```

## 🏗️ Project Structure
```bash
ADAPTIVE-TUTOR-AI/
├── agents/                  # AI ORCHESTRATION LAYER (CrewAI)
│   ├── adk_agent.py         # Advanced Mentor logic (Teacher & Doubt Solver)
│   ├── crewai_agent.py      # Curriculum logic (Study Plan & Quiz generation)
│   ├── mcp_tools.py         # Model Context Protocol tools for web search
│   ├── shared_tools.py      # Global AI utilities and monitoring
│   └── callbacks.py         # Event handlers for agentic traces
├── coordinator/             # API GATEWAY (FastAPI)
│   └── main.py              # Central Router & Endpoint definitions
├── state/                   # PERSISTENCE LAYER
│   ├── context_store.py     # Logic for saving/loading user progress
│   ├── models.py            # Pydantic Schemas for data validation
│   └── latest_plan.json     # Cached study plan state
├── data/                    # STATIC ASSETS
│   └── study_guidelines.json # Domain-specific training rules
├── frontend/                # USER INTERFACE (React + Vite)
│   ├── src/
│   │   ├── api/             # Frontend-Backend communication logic
│   │   ├── components/      # UI Atoms (Navbar, ModernBrief, ModuleCard)
│   │   ├── pages/           # UI Organisms (CreatePlan, ViewPlan, Dashboard)
│   │   ├── index.css        # Tailwind V4 Global Styles
│   │   └── App.jsx          # Animated Route Controller
│   ├── tailwind.config.js   # Style configurations
│   └── postcss.config.js    # CSS processing logic
├── .env                     # Secrets (API Keys) - [PROTECTED]
├── requirements.txt         # Backend dependencies
└── README.md                # Technical documentation
```

## 📈 Engineering Challenges Solved
* Latency Optimization: Successfully migrated the backend from Gemini (high latency/low rate limits) to Groq LPUs, achieving a 10x speed increase for agentic chains.
* Agentic Constraints: Implemented strict prompt engineering to eliminate "Hashtag" formatting clutter (#) in favor of professional bold-header Markdown styles.
* Data Serialization: Resolved Pydantic validation errors by engineering custom string-forcing logic for AI-generated metadata.
* UI Synchronization: Developed a global CSS injection strategy to eliminate "White-Flash" rendering issues in React during asynchronous data loading.

---

## 🔮 Future Roadmap

- [ ] **Multi-Modal Support:** Integration of Whisper AI for voice-to-lesson interaction.
- [ ] **Vector Memory (RAG):** Adding ChromaDB support to allow students to upload their own textbooks as context.
- [ ] **Adaptive Difficulty:** Logic to automatically simplify the study plan if quiz scores fall below 60%.

---

**Developed with ❤️ by Prasad | AI Engineer Portfolio Project**
