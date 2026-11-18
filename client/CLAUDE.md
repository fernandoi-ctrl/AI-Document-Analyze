# Analiza tu juicio Frontend — Claude Instructions

## Application Overview

This folder contains the frontend application for Analiza tu juicio.

Framework:

* Next.js

Language:

* TypeScript

State Management:

* Redux Toolkit

Styling:

* TailwindCSS

---

# Frontend Responsibilities

The frontend handles:

* UI rendering
* User interactions
* Forms
* Dashboard
* Results visualization
* State management
* Payment flow

---

# Forbidden Responsibilities

The frontend MUST NOT:

* implement business logic
* access database directly
* call System providers directly
* process OCR
* calculate legal analysis

All business logic belongs to `/server`.

---

# Redux Rules

Redux Toolkit is mandatory.

Use:

* createSlice
* createAsyncThunk

---

# Required Slice State

Each entity slice MUST contain:

```ts id="pq7cz4"
{
  loading,
  updating,
  updateSuccess,
  errorMessage,
  entities,
  entity,
  totalItems,
  page,
  size
}
```

---

# Naming Conventions

| Action     | Convention   |
| ---------- | ------------ |
| Fetch list | getEntities  |
| Fetch one  | getEntity    |
| Create     | createEntity |
| Update     | updateEntity |
| Delete     | deleteEntity |

---

# UI Principles

The UI MUST feel:

* simple
* modern
* fast
* non-technical

Target UX:

* WhatsApp-level simplicity

---

# Component Rules

Components MUST:

* be reusable
* remain small
* avoid duplicated logic

Avoid:

* giant components
* inline API logic

---

# API Rules

All API calls MUST go through:

* services layer

Never:

* call APIs directly inside components

---

# Styling Rules

Use:

* TailwindCSS
* clean spacing
* responsive design

Avoid:

* excessive styling complexity

---

# Claude Instructions

Whenever generating frontend code:

* use TypeScript
* use Redux Toolkit
* use modular components
* separate UI from API logic

Never:

* add backend logic
* tightly couple components
* bypass Redux patterns

---
