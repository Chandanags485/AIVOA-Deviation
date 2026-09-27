# AIVOA Deviation Management System

An AI-powered Deviation Intake Module for a pharmaceutical Quality Management System (QMS).

The application helps quality teams capture deviation information from uploaded PDF documents or pasted text, extract structured information using AI, generate an initial severity recommendation, allow user review and editing, and save the final deviation record to PostgreSQL.

---

## Project Overview

The AIVOA Deviation Management System provides an end-to-end workflow for deviation intake:

1. Upload a deviation PDF or paste deviation text.
2. Extract relevant deviation information using AI.
3. Populate the deviation form automatically.
4. Generate an initial AI-assisted impact and severity recommendation.
5. Allow the user to review and edit the extracted information.
6. Save the reviewed deviation record to the database.

The AI recommendation is intended to assist the quality user and is not treated as the final quality decision.

---

## Architecture

```text
                    ┌─────────────────────────┐
                    │       React Frontend    │
                    │                         │
                    │  Deviation Intake Form  │
                    │  AI Copilot Panel       │
                    │  PDF / Text Input       │
                    └────────────┬────────────┘
                                 │
                                 │ REST API
                                 ▼
                    ┌─────────────────────────┐
                    │      FastAPI Backend    │
                    │                         │
                    │ Analyze Text            │
                    │ Analyze PDF             │
                    │ Save Deviation          │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │     LangGraph Workflow  │
                    │                         │
                    │  1. Extract Deviation  │
                    │  2. Assess Initial Risk│
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │       Groq LLM          │
                    │     AI Processing       │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │       PostgreSQL        │
                    │   Deviation Records     │
                    └─────────────────────────┘
```

Tech Stack
Frontend
React
Redux Toolkit
React Redux
Vite
JavaScript
CSS
Backend
Python
FastAPI
Uvicorn
SQLAlchemy
Pydantic
pypdf
AI
LangGraph
Groq
LLM-based structured extraction
JSON-based AI responses
Database
PostgreSQL
Development Tools
Git
GitHub
