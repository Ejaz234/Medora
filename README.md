# 🩺 Medora — AI Medical Assistant

Medora is a full-stack **AI Medical Assistant** built using **Retrieval-Augmented Generation (RAG)**. It retrieves relevant information from a medical knowledge base using semantic search and generates grounded answers using an LLM.

## ✨ Features

- 🤖 AI-powered medical question answering
- 🔍 Semantic search with Pinecone
- 🧠 Conversational RAG with question rewriting
- 📚 Source and page references
- 🔐 Clerk authentication
- 💬 Persistent conversation history
- 🗄️ Supabase PostgreSQL database
- 🛡️ Conversation ownership and API authentication
- 🚫 Retrieval threshold to reduce irrelevant answers
- 🐳 Dockerized backend
- ☁️ AWS EC2 + Amazon ECR deployment
- 🔒 Nginx + HTTPS
- ⚡ React + TypeScript frontend deployed on Vercel

## 🛠️ Tech Stack

**Frontend**
- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Clerk

**Backend**
- Python
- FastAPI
- LangChain
- HuggingFace
- Pinecone
- Groq

**Database & Deployment**
- Supabase PostgreSQL
- Docker
- Amazon ECR
- AWS EC2
- Nginx
- Let's Encrypt
- Vercel

## 🧠 RAG Pipeline

```text
Medical Documents
       ↓
PDF Extraction
       ↓
Text Chunking
       ↓
HuggingFace Embeddings
       ↓
Pinecone Vector Database
       ↓
User Question
       ↓
Question Rewriting
       ↓
Semantic Retrieval
       ↓
Relevant Context
       ↓
Groq LLM
       ↓
Answer + Sources
```

## 📊 RAG Evaluation

- 637-page medical knowledge base
- 4,201 indexed chunks
- 384-dimensional embeddings
- 30 evaluation questions
- 25/25 in-domain retrieval
- 5/5 out-of-domain rejection

## 🚀 Run Locally

### Backend

```bash
cd backend
uv venv
uv pip install -r requirements.txt
uvicorn app:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Create `.env` files with the required API keys and configuration.

## 🌐 Deployment

```text
Vercel
   ↓ HTTPS
Nginx
   ↓
AWS EC2
   ↓
Docker
   ↓
FastAPI
   ↓
Pinecone + Groq + Supabase
```

## ⚠️ Disclaimer

Medora is an educational medical information tool and is **not a replacement for a qualified healthcare professional**. It should not be used for diagnosis or emergency medical decisions.

