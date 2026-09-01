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

---

## 🎯 Overview

**PACTUM** (Process Automation for Contract Term Understanding & Management) is a cutting-edge platform designed to revolutionize contract lifecycle management through intelligent document processing, AI-powered analytics, and automated workflow orchestration.

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
- 🤖 **AI Draft Generation** - LLM-powered contract drafting using Groq API
- 📝 **Smart Templates** - Context-aware template suggestions
- ✏️ **Interactive Editing** - Real-time AI assistance while drafting
- 📌 **Clause Library** - Searchable repository of contract clauses

### Background Job Processing
- ⏰ **Celery Workers** - Asynchronous task processing
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
