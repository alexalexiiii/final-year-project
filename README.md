# Final Year Project

Official website: https://analysit.neocities.org

## Email Attachment Analyzer - Outlook Add-in

## Overview
This project is an Outlook add-in built with React and TypeScript that integrates FLARE tooling for static malware analysis of email attachments. It enables users to analyse attachments directly within Outlook and receive structured security intelligence.

---

## Technology Stack
- Frontend: React + TypeScript (TSX)
- Office Integration: Office.js API
- UI Framework: Tailwind CSS + shadcn/ui components
- Backend: FastAPI (Uvicorn) with FLARE tool integration

---

## System Overview

### Frontend Implementation
The add-in:
- Accesses Outlook email context using Office.js
- Retrieves and lists email attachments
- Allows selection of attachments for analysis
- Sends selected files to backend analysis API
- Displays structured analysis results in the UI

---

### Backend Analysis Flow
1. Receive attachment via API request
2. Process file in isolated analysis environment
3. Execute FLARE tooling:
   - file identification utilities
   - PE structure analysis (pefile)
   - FLOSS for string extraction
   - CAPA for capability detection
   - entropy and hash computation
4. Parse CLI output into structured JSON
5. Return normalized analysis results to frontend

---
