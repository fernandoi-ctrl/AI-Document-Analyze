# LexScan Backend — Claude Instructions

## Application Overview

This folder contains the backend application for LexScan.

Framework:

* NestJS

Language:

* TypeScript

Database:

* Supabase

ORM:

* Prisma

---

# Backend Responsibilities

The backend handles:

* Authentication
* Authorization
* Legal case management
* Document uploads
* OCR processing
* AI orchestration
* Payments
* Alerts
* Business rules

---

# Required Architecture

Use modular NestJS architecture.

Modules:

* users
* cases
* documents
* analyses
* alerts
* payments

---

# Layer Responsibilities

## Controllers

Responsible ONLY for:

* request handling
* validation
* response formatting

---

## Services

Responsible for:

* business logic
* orchestration
* AI processing

---

## Repositories / Prisma

Responsible ONLY for:

* database access

---

# Forbidden Patterns

* fat controllers
* duplicated business logic
* direct provider coupling
* massive service files

---

# AI Rules

AI providers MUST use abstraction.

Use:

* AIProviderService

Never:

* hardcode provider-specific logic everywhere

---

# Storage Rules

Storage MUST use abstraction layer.

Use:

* StorageService

Never:

* tightly couple to Supabase or S3

---

# Database Rules

Use:

* Prisma ORM
* DTO validation
* strict typing

Avoid:

* raw queries unless necessary

---

# Performance Rules

* Use chunking for large documents
* Minimize AI calls
* Keep API responses fast

---

# Security Rules

* Validate uploads
* Validate JWTs
* Sanitize input
* Protect sensitive data

---

# Claude Instructions

Whenever generating backend code:

* use modular architecture
* use DTOs
* use services
* separate concerns
* generate production-ready code

Never:

* place logic in controllers
* generate monolithic modules

---
