# PACTUM - Contract Lifecycle Intelligence Platform

> **An enterprise-grade AI-powered contract lifecycle management system with intelligent document processing, risk analytics, and workflow automation.**

![TypeScript](https://img.shields.io/badge/TypeScript-70.4%25-3178C6?style=flat-square)
![Python](https://img.shields.io/badge/Python-28.4%25-3776AB?style=flat-square)
![Status](https://img.shields.io/badge/Status-Active%20Development-brightgreen?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Advanced Architecture Details](#advanced-architecture-details)
- [Installation & Setup](#installation--setup)
- [API Endpoints](#api-endpoints)
- [Configuration](#configuration)
- [Development Guide](#development-guide)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Maintainers & Changes by Assistant](#maintainers--changes-by-assistant)

---

## 🎯 Overview

**PACTUM** (Process Automation for Contract Term Understanding & Management) is a cutting-edge platform designed to revolutionize contract lifecycle management through intelligent document processing, risk analytics, and workflow automation.

### What Problem Does It Solve?

Organizations spend millions managing contracts manually. PACTUM eliminates this burden by:
- **Automating contract analysis** using advanced NLP and embeddings
- **Identifying risks** through intelligent pattern recognition
- **Accelerating approvals** via workflow automation
- **Ensuring compliance** through continuous monitoring
- **Enabling intelligent drafting** with AI-powered templates

---

## ✨ Key Features

### Document Intelligence
- 📄 **Multi-format PDF Processing** - Handles scanned PDFs, digital documents, and embedded images
- 🔍 **Intelligent Chunking** - Semantic-aware document splitting with configurable overlap
- 🧠 **Embedding Generation** - High-dimensional vector representations using Sentence Transformers
- 📊 **Field Extraction** - Automatic extraction of critical contract terms and conditions

### AI-Powered Search & Retrieval
- 🔎 **Semantic Search** - RAG-based search across contract corpus
- ⚡ **Fast Similarity Matching** - Vector-based search with caching
- 💾 **Intelligent Caching** - SHA-256 based deduplication for efficiency
- 📈 **Context-aware Results** - Retrieves most relevant contract clauses

### Risk Analytics & Compliance
- ⚠️ **Automated Risk Assessment** - LangGraph-based risk detection pipeline
- 📊 **Risk Scoring** - Multi-dimensional risk evaluation framework
- 📈 **Analytics Dashboard** - Real-time contract metrics and visualizations
- 🎯 **Policy Rule Engine** - Customizable compliance rules and policy validation

### Contract Workflow Automation
- ✅ **Approval Workflows** - Multi-stage approval management with role-based access
- 📋 **Template Management** - Reusable contract templates with AI assistance
- 🔄 **Version Control** - Track all changes and maintain audit trail
- 🎯 **Status Tracking** - Real-time contract lifecycle monitoring

### Intelligent Drafting & Generation
- 🤖 **AI Draft Generation** - LLM-powered contract drafting using Groq API (configurable)
- 📝 **Smart Templates** - Context-aware template suggestions
- ✏️ **Interactive Editing** - Real-time AI assistance while drafting
- 📌 **Clause Library** - Searchable repository of contract clauses

### Background Job Processing
- ⏰ **Celery Workers** - Asynchronous task processing (Python)
- 📅 **Celery Beat** - Scheduled job execution (renewal checks, analytics updates)
- 🔄 **Job Queuing** - Redis-backed job queue system
- 📊 **Polling Support** - Real-time status updates for long-running tasks

### Model Context Protocol (MCP)
- 🔗 **MCP Server Integration** - Expose platform tools to MCP-compatible clients
- 🤝 **Third-party Integration** - Seamless integration with AI assistants
- 🛠️ **Tool Exposure** - Contract analysis and processing via standard MCP interface

---

## 🏗️ System Architecture

### High-Level Architecture Diagram

Below are concise, clear architecture and flow diagrams illustrating components, responsibilities, and data flows. Images are committed to /docs/assets so they render on GitHub. If your viewer does not render SVG inline, each image links to its source SVG.

#### Component Diagram

Caption: High-level components and data flows (User → Frontend → API → Storage/Queue → Worker → Index/DB). See the SVG in docs/assets for a scalable vector version.

ASCII fallback:
- User -> Web UI
- Web UI -> API Server (TypeScript)
- API -> stores raw contract to Object Storage, creates DB record, enqueues job
- Queue -> Worker (Python) picks job -> downloads file -> runs OCR/Parsing/Extraction -> updates DB & Vector Index -> Notifier triggers
- API & Search API serve results to UI

#### Contract Ingestion Sequence

Caption: Sequence for upload, presigned upload, DB record creation, job enqueue, worker analysis, and notification.

ASCII fallback:
- Upload -> Presigned URL -> Store -> DB record -> enqueue
- Worker consumes -> OCR & NLP -> embeddings -> updates DB & Index -> notify UI

#### ML Processing Pipeline

Caption: OCR → Chunking → Embedding → Index & DB storage. Metadata and chunk provenance are stored alongside vectors.

Notes:
- SVGs are in docs/assets and are the source of truth for diagram updates. If you need PNGs for external systems, tell me and I will export them too.

---

## 🔧 Technology Stack

This repository's codebase is primarily TypeScript (frontend, API, orchestration) with Python powering ML/NLP workers. Suggested stack (map to folders in repo):

- Frontend: React / Next.js (TypeScript), Vite for local dev
- API: Node.js + TypeScript (Fastify / NestJS / Express)
- Worker: Python 3.9+ (Celery, FastAPI for model endpoints)
- Database: PostgreSQL
- Queue: Redis Streams or RabbitMQ
- Caching: Redis
- Object Storage: S3 / MinIO
- Vector Index: Pinecone / Milvus / Elasticsearch with vector plugin
- Observability: Prometheus + Grafana, Sentry for errors
- Containerization: Docker & Docker Compose

---

## 🗂️ Project Structure (canonical / recommended)

- /frontend — TypeScript SPA (React/Next)
- /api — TypeScript API server (routes, controllers, services)
- /worker — Python ML pipelines, Celery tasks
- /models — model artifacts and pointers (large files ignored via .gitignore)
- /infra — docker-compose, helm charts, infra docs
- /scripts — helper scripts (migrations, seeders)
- /tests — unit & integration tests

(If the repo layout differs, keep this section aligned with the actual folder names.)

---

## ⚙️ Advanced Architecture Details

- Data model: contracts (id, owner_id, status, metadata, storage_path, sha256), chunks (contract_id, chunk_id, text, embedding_id), vectors in index, extracted_fields table for structured outputs.
- Idempotency: store raw-file SHA256 and deduplicate analysis if hash exists.
- Retries: worker tasks should be idempotent and retried via Celery retry policies. Use exponential backoff and dead-lettering for failing jobs.
- Security: signed presigned URLs for uploads, RBAC on API, encrypted storage and DB, secrets in secret manager.
- Observability: instrument API and workers with tracing (OpenTelemetry), metrics (custom and default), and centralized logs.

---

## 🚀 Installation & Setup (developer quickstart)

1. Clone repository:
```bash
git clone https://github.com/NavneetDeshtaa/PACTUM---Contract-Lifecycle-Intelligence.git
cd PACTUM---Contract-Lifecycle-Intelligence
```

2. API / Frontend (TypeScript)
```bash
cd api
cp .env.example .env
npm install
npm run dev
# or for frontend
cd ../frontend
npm install
npm run dev
```

3. Worker (Python)
```bash
cd worker
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# run worker locally
celery -A pactum_worker worker --loglevel=info
```

4. Run with Docker Compose (infra/docker-compose.yml recommended)

---

## 🔐 Configuration

Keep secrets out of source control. Example variables:

API (.env)
```
PORT=8000
DATABASE_URL=postgresql://pactum:pactum@postgres:5432/pactum
REDIS_URL=redis://redis:6379/0
S3_ENDPOINT=https://s3.amazonaws.com
S3_BUCKET=pactum-raw
JWT_SECRET=replace-with-secure-value
VECTOR_INDEX_URL=https://vector.example.com
```

## 🤝 Contributing

- Fork → feature branch → PR
- Fill PR template: describe change, link issue, add tests
- Run the local test suite and lint before opening a PR
- Use descriptive commits and squash/fixup before merge

---

## 📜 License

MIT — see LICENSE file.
