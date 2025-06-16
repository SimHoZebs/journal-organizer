# Synthesis Journal Design Document

---

## 1. Core Philosophy & Vision

**Vision:**
> To create a journaling system that acts as a second brain, automatically synthesizing unstructured life events, thoughts, and media into a structured, interlinked, and searchable personal knowledge base and task management system.

**Core Principle:**
> The user's only task is to capture. The system's task is to clarify, organize, and connect this information asynchronously, transforming a stream of consciousness into an actionable and reflective repository.

**Guiding Methodologies:**
- Logic inspired by Getting Things Done (GTD) for processing
- PARA for organization
- All information is handled with purpose

---

## 2. User Experience & Interaction Design

This section details the primary user-facing components and workflows, focusing on solving specific challenges of a human-AI journaling system.

### 2.1 The Main Interface: An Obsidian-like "Second Brain"
- **Problem:** How to navigate a vast and complex knowledge base without overwhelming the user?
- **Solution:** Use a familiar three-panel interface (Sidebar, Editor, Contextual Panel) as in Obsidian/VS Code.

### 2.2 Inbox Management: Making the AI's Work Transparent
- **Problem:** If AI processes the inbox automatically, how does a user know what happened?
- **Solution:**
  - Inbox is a permanent, chronological log
  - Processed items visually change state ("Processed ✨" icon)
  - Tooltip provides a full audit trail of AI actions with links to results

### 2.3 Handling Ambiguity: The Clarification Loop
- **Problem:** What if the user's input is vague?
- **Solution:**
  - AI never invents information
  - Ambiguity triggers a prompt in the Review Queue
  - Draft item is created; user is prompted for missing details before finalizing

### 2.4 Editing & Data Integrity: The Single Source of Truth
- **Problem:** Where do users update tasks or notes?
- **Solution:**
  - Once created, a file is the single source of truth
  - All edits happen directly in the file

### 2.5 Person Profiles: Capturing the Story of Relationships
- **Problem:** Need to understand the narrative of relationships, not just a log of interactions
- **Solution:**
  - System automatically generates and maintains rich profiles for each person
  - On every new interaction, AI updates a dynamic "Evolution Summary" at the top of the profile
  - Provides at-a-glance understanding of relationship trajectory

---

## 3. The Automated Synthesis Pipeline (High-Level)
- Background process involving:
  1. Clarification (GTD)
  2. Extraction
  3. Resolution
  4. Synthesis & Organization (PARA)
  5. Document Creation/Update

---

## 4. Document & Schema Examples (Task, Person, etc.)
- Defines portable, front-matter-driven structure of Markdown files for each entity type

---

## 5. Knowledge Base Structure (PARA-inspired)
- Projects
- Areas
- Resources
- Archives
- Tasks (folder structure)

---

## 6. Technical Architecture & Stack

- **Application Framework:** Tauri
- **Frontend:** React
- **Markdown Editor:** CodeMirror or Monaco Editor
- **Language Model (LLM):** Gemini 1.5 Flash (Function Calling & JSON Mode)
- **Structured Database:** SQLite (for indexing front matter of finalized files)
- **Vector Database:** LanceDB (for semantic search of finalized content)
- **File System:** User's local disk is the source of truth for all content
- **Audio Transcription Service:** Self-hosted or dedicated server running an open-source model (e.g., OpenAI Whisper) to handle long audio files transcription

---

## 7. Detailed Synthesis Flow & CRUD Operations
- Technical breakdown of the background worker's logic
- Describes Create, Read, Update, Delete operations across file system and databases

---

## 8. Low-Level Implementation Details

This section translates the high-level user experience solutions into concrete technical implementation steps, organized by workflow.

### 8.A Task Management Workflow
How actionable items are identified, created, and managed.

#### 8.A.1 The Review Queue for Ambiguous Tasks
- **Problem:** How to handle tasks with missing critical information (e.g., deadline)?
- **Implementation:**
  - AI creates a draft `.md` file in `_review/` with `status: needs_review` in front matter
  - File system watcher notifies UI
  - On user confirmation, file's front matter is finalized and moved to permanent location (e.g., `/5_Tasks/`) and indexed

#### 8.A.2 Handling "Soft" Tasks (e.g., "Dinner with my wife")
- **Problem:** Capturing valid tasks without hard deadlines
- **Implementation:**
  - LLM uses `null` for due_date if not specified
  - UI renders these in "Someday" or "No Due Date" category

### 8.B Person Profile Workflow
How people are identified and how their profiles evolve.

#### 8.B.1 Profile Creation & Entity Resolution
- **Problem:** How to decide whether to create a new person profile or update an existing one (especially with common names)?
- **Implementation:**
  - **Extraction:** LLM identifies name as Person entity
  - **Resolution:** System queries SQLite index for name/aliases
    - **CREATE:** Zero matches ➔ new `.md` in `/2_Areas/People/`
    - **UPDATE:** One match ➔ update existing file
    - **REVIEW:** Multiple matches ➔ draft in `_review/` prompting for user choice

#### 8.B.2 Capturing Relationship Evolution
- **Problem:** Synthesize the entire relationship history into a meaningful summary
- **Implementation:**
  - **Context Gathering:** Worker reads entire `.md` for that person
  - **Evolution-Aware AI Prompt:** Full history + new mention sent to LLM to generate updated `evolution_summary`
  - **Document Update:** Worker replaces old `evolution_summary` in front matter with new one

### 8.C General Implementation Details

#### 8.C.1 The Inbox Audit Trail
- **Problem:** How to implement the "Processed ✨" icon & tooltip
- **Implementation:**
  - Synthesis Worker updates `processed_status` & `processing_log` (array of Markdown links) for each inbox item
  - Frontend uses this to render status icon and hover-tooltip

#### 8.C.2 Audio Input & Transcription Pipeline
- **Problem:** Long-form audio capture and high-quality transcription
- **Implementation:**
  - Client-side audio chunking
  - Self-hosted Whisper service for raw transcription
  - Gemini call for polishing and correction before text enters the inbox
