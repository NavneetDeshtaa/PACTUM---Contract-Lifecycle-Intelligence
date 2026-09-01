# PACTUM - Contract Lifecycle Intelligence Platform

**PACTUM** (Process Automation for Contract Term Understanding & Management) is a cutting-edge platform designed to manage contract lifecycle management through intelligent document processing, risk analytics, and workflow automation.

### What Problem Does It Solve?

Organizations spend millions managing contracts manually. PACTUM eliminates this burden by:
- **Automating contract analysis** using advanced NLP and embeddings
- **Identifying risks** through intelligent pattern recognition
- **Accelerating approvals** via workflow automation
- **Ensuring compliance** through continuous monitoring
- **Enabling intelligent drafting** with AI-powered templates

---

##  Key Features

### Document Intelligence
-  **Multi-format PDF Processing** - Handles scanned PDFs, digital documents, and embedded images
-  **Intelligent Chunking** - Semantic-aware document splitting with configurable overlap
-  **Embedding Generation** - High-dimensional vector representations using Sentence Transformers
-  **Field Extraction** - Automatic extraction of critical contract terms and conditions

### AI-Powered Search & Retrieval
-  **Semantic Search** - RAG-based search across contract corpus
-  **Fast Similarity Matching** - Vector-based search with caching
-  **Intelligent Caching** - SHA-256 based deduplication for efficiency
-  **Context-aware Results** - Retrieves most relevant contract clauses

### Risk Analytics & Compliance
-  **Automated Risk Assessment** - LangGraph-based risk detection pipeline
-  **Risk Scoring** - Multi-dimensional risk evaluation framework
-  **Analytics Dashboard** - Real-time contract metrics and visualizations
-  **Policy Rule Engine** - Customizable compliance rules and policy validation

### Contract Workflow Automation
-  **Approval Workflows** - Multi-stage approval management with role-based access
-  **Template Management** - Reusable contract templates with AI assistance
-  **Version Control** - Track all changes and maintain audit trail
-  **Status Tracking** - Real-time contract lifecycle monitoring

### Intelligent Drafting & Generation
-  **AI Draft Generation** - LLM-powered contract drafting using Groq API (configurable)
-  **Smart Templates** - Context-aware template suggestions
-  **Interactive Editing** - Real-time AI assistance while drafting
-  **Clause Library** - Searchable repository of contract clauses

### Background Job Processing
-  **Celery Workers** - Asynchronous task processing (Python)
-  **Celery Beat** - Scheduled job execution (renewal checks, analytics updates)
-  **Job Queuing** - Redis-backed job queue system
-  **Polling Support** - Real-time status updates for long-running tasks

### Model Context Protocol (MCP)
-  **MCP Server Integration** - Expose platform tools to MCP-compatible clients
-  **Third-party Integration** - Seamless integration with AI assistants
-  **Tool Exposure** - Contract analysis and processing via standard MCP interface

### High Level Architecture 

<img width="1536" height="1024" alt="image" src="https://github.com/user-attachments/assets/7bece4b1-8a86-409d-b0f4-945a016913c9" />

##  Installation & Setup (developer quickstart)

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

##  Configuration

Keep secrets out of source control. Example variables:

API (.env)
```
PORT=8000
DATABASE_URL=postgresql://pactum:pactum@postgres:5432/pactum
REDIS_URL=redis://redis:6379/0
JWT_SECRET=replace-with-secure-value
VECTOR_INDEX_URL=https://vector.example.com
```



---

## 📜 License

MIT — see LICENSE file.
