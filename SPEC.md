# Analiza tu juicio — Technical Specification (SPEC.md)

# 1. Project Overview

Analiza tu juicio is an Legal Document Analysis platform that allows users to upload legal documents and receive automated legal insights.

The platform analyzes legal cases using System and provides:

* Case summary
* Viability score
* Success probability
* Risk analysis
* Procedural alerts
* Recommended actions

The System  is designed for non-technical users and prioritizes simplicity and clarity.

---

# 2. Repository Architecture

The project MUST use a two-application structure:

```txt id="jyyu8u"
/server
/client
```

---

# 3. /server Application

The `/server` application contains the backend System .

## Backend Stack

* NestJS
* TypeScript
* PostgreSQL
* Prisma ORM
* REST API
* System integrations
* OCR processing

---

## /server Responsibilities

The backend MUST handle:

* Authentication
* Authorization
* Case management
* Document uploads
* OCR processing
* System analysis
* Payments
* Alerts
* Business rules
* Storage abstraction
* System provider abstraction

---

## Suggested /server Structure

```txt id="mkp0mt"
/server
 ├── src
 │    ├── modules
 │    │    ├── users
 │    │    ├── cases
 │    │    ├── documents
 │    │    ├── analyses
 │    │    ├── payments
 │    │    └── alerts
 │    │
 │    ├── ai
 │    │    ├── providers
 │    │    ├── prompts
 │    │    └── services
 │    │
 │    ├── common
 │    ├── config
 │    ├── jobs
 │    └── utils
 │
 ├── prisma
 ├── test
 └── package.json
```

---

# 4. /client Application

The `/client` application contains the frontend UI.

## Frontend Stack

* Next.js
* React
* TypeScript
* TailwindCSS
* Redux Toolkit

---

## /client Responsibilities

The frontend MUST handle:

* Authentication UI
* Dashboard UI
* Case management screens
* Document uploads
* Results visualization
* Payment flow
* Redux state management
* User experience

---

## Suggested /client Structure

```txt id="u5sw9n"
/client
 ├── app
 │    ├── dashboard
 │    ├── cases
 │    ├── upload
 │    └── results
 │
 ├── components
 ├── store
 │    ├── slices
 │    ├── reducers
 │    └── hooks
 │
 ├── services
 ├── hooks
 ├── utils
 ├── styles
 └── package.json
```

---

# 5. Frontend ↔ Backend Communication

The frontend MUST communicate ONLY with the backend API.

```txt id="eoqx7n"
/client
   ↓
/server API
   ↓
Database / System / Storage
```

---

# 6. Forbidden Architecture

The frontend MUST NOT:

* Access Supabase directly
* Access database directly
* Call System providers directly
* Contain business logic
* Process legal analysis

All business logic MUST live in `/server`.

---

# 7. MVP Goals

* Launch quickly
* Validate market demand
* Keep infrastructure cheap
* Provide valuable legal insights
* Generate revenue through paid analysis

---

# 8. Product Scope

## Included in MVP

### Case Management

* Create case
* Upload documents
* View results

### System Analysis

* Summary
* Score
* Risk detection
* Recommendations

### Monetization

* Paywall
* Paid unlock

### Dashboard

* Case list
* Results history

---

## NOT Included

* Mobile app
* Marketplace
* Automatic court integrations
* Multi-tenant support

---

# 9. Tech Stack

## Frontend

* Next.js
* React
* TailwindCSS
* Redux Toolkit

## Backend

* NestJS
* REST APIs

## Database

* PostgreSQL

## Infrastructure

* Vercel
* Railway
* Supabase

## AI

* Claude API

## Payments

* MercadoPago

---

# 10. Frontend State Management

Redux Toolkit is mandatory.

All entities MUST use:

* createSlice
* createAsyncThunk

---

## Required State Shape

```ts id="n9e3l6"
{
  loading: boolean;
  updating: boolean;
  updateSuccess: boolean;
  errorMessage: string | null;

  entities: any[];
  entity: any | null;

  totalItems: number;

  page: number;
  size: number;
}
```

---

## Redux Naming Conventions

| Action     | Convention     |
| ---------- | -------------- |
| Fetch list | getEntities    |
| Fetch one  | getEntity      |
| Create     | createEntity   |
| Update     | updateEntity   |
| Delete     | deleteEntity   |
| Search     | searchEntities |

---

# 11. Backend Architecture Rules

## Controllers

Responsible ONLY for:

* HTTP handling
* validation
* response formatting

---

## Services

Responsible for:

* business logic
* orchestration
* System processing

---

## Repositories

Responsible for:

* database access only

---

# 12. Database Design

## Core Tables

### users

Stores:

* authentication
* profile data

### cases

Stores:

* legal cases

### documents

Stores:

* uploaded files
* extracted text

### document_chunks

Stores:

* segmented text chunks

### analyses

Stores:

* System analysis results

### alerts

Stores:

* critical warnings

### payments

Stores:

* payment history

---

# 13. Document Processing Pipeline

## Upload Flow

1. User uploads file
2. Backend validates file
3. File stored
4. OCR extracts text
5. Text cleaned
6. Chunk generation
7. System analysis
8. Result stored

---

# 14. Chunking Rules

Large documents MUST:

* be split into chunks
* preserve ordering
* support summarization

---

# 15. System Responsibilities

The System MUST:

* identify lawsuit type
* summarize the case
* calculate viability score
* detect procedural risks
* generate recommendations

---

# 16. System Constraints

The System MUST:

* never invent legal facts
* explicitly indicate missing information
* use non-technical language
* avoid legal jargon

---

# 17. Mandatory System Output

Every analysis MUST include:

## Case Summary

## Viability Score

1–10

## Success Probability

Percentage

## Risk Level

* Low
* Medium
* High

## Legal Traffic Light

* 🟢 Strengths
* 🟡 Risks
* 🔴 Critical Problems

## ALERTA IMPORTANTE

Required if severe issue detected.

---

# 18. Business Rules

* No analysis without valid content
* Generate score always
* Store analysis history
* Prioritize key legal documents
* Use chunking for large files

---

# 19. Monetization Rules

## Free

* Limited preview

## Paid

* Full analysis
* Recommendations
* Alerts
* Detailed strategy

---

# 20. UX Principles

The platform MUST feel:

* simple
* fast
* approachable

Target UX:

* similar to WhatsApp simplicity

---

# 21. Security Requirements

* Validate uploads
* Sanitize inputs
* Protect files
* Secure API routes
* Validate JWT tokens

---

# 22. Performance Goals

| Metric           | Target   |
| ---------------- | -------- |
| Initial analysis | < 2 min  |
| Upload speed     | < 10 sec |
| API response     | < 1 sec  |

---

# 23. Infrastructure Philosophy

Prioritize:

* low cost
* simplicity
* fast deployment

Avoid:

* Kubernetes
* microservices
* overengineering

---

# 24. Deployment Strategy

## /client

Deploy on:

* Vercel

## /server

Deploy on:

* Railway
* Render
* AWS later if needed

---

# 25. Migration Strategy

The System  MUST remain provider-agnostic.

All integrations MUST use:

* abstraction layers
* service wrappers

Examples:

* StorageService
* AIProviderService

---

# 26. Coding Standards

Required:

* TypeScript strict mode
* DTO validation
* SOLID principles
* error handling
* modular design

Forbidden:

* any types
* duplicated logic
* hardcoded URLs
* provider coupling

---

# 27. Future Features

## Phase 2

* Video consultations
* Marketplace
* Premium strategy reports

## Phase 3

* Automatic lawsuit tracking
* System legal writing assistant
* Multi-firm support

---

# 28. Success Metrics

Track:

* paid analyses
* conversion rate
* CPA
* average processing time

---

# 29. Development Philosophy

Build:

* fast
* clean
* scalable enough

DO NOT:

* overengineer
* optimize too early
* build unvalidated features

---

# 30. Claude Code Instructions

Whenever generating code:

* Backend code MUST go inside `/server`
* Frontend code MUST go inside `/client`

Claude MUST:

* respect architecture boundaries
* avoid provider coupling
* generate modular code
* prioritize maintainability

Never:

* mix frontend/backend logic
* place business logic in UI
* call providers directly from frontend

---
