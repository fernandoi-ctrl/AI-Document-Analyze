# Analiza tu juicio — Global Claude Instructions

## Project Overview

Analiza tu juicio is an Legal Document Analysis platform.

The repository uses a monorepo-style architecture with two applications:

```txt id="9z3j0g"
/server
/client
```

---

# Architecture Rules

## /server

Contains:

* NestJS backend
* business logic
* System integrations
* OCR processing
* database access
* authentication
* payments

---

## /client

Contains:

* Next.js frontend
* React components
* Redux Toolkit state management
* UI/UX logic

---

# Critical Rules

* NEVER place business logic inside `/client`
* NEVER access database directly from frontend
* NEVER call System providers from frontend
* ALWAYS keep backend/frontend separation

---

# Tech Stack

## Frontend

* Next.js
* React
* Redux Toolkit
* TailwindCSS

## Backend

* NestJS
* Supabase/Postgres
* Prisma

---

# Development Philosophy

Prioritize:

* maintainability
* modularity
* simplicity
* scalability

Avoid:

* overengineering
* unnecessary abstractions
* monolithic code

---

# Repository Conventions

All backend code MUST go inside `/server`.

All frontend code MUST go inside `/client`.

---

# Provider Abstractions

All external providers MUST use abstraction layers.

Examples:

* StorageService
* AIProviderService

Never tightly couple implementation logic.

---

# System Guidelines

AI-generated legal analysis MUST:

* avoid inventing facts
* indicate missing information
* use non-technical language

---

# Claude Instructions

Whenever generating code:

* respect repository boundaries
* generate modular code
* avoid duplication
* follow TypeScript strict mode

---
