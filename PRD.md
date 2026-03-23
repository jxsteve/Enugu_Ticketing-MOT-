# PRODUCT REQUIREMENTS DOCUMENT

## Driver Biometric Compliance & Fine Enforcement System

**Version:** 1.0  
**Date:** March 2026  
**Prepared for:** Ministry of Transportation, Enugu State  
**Classification:** Internal

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Product Vision](#3-product-vision)
4. [Goals and Objectives](#4-goals-and-objectives)
5. [User Roles and Permissions](#5-user-roles-and-permissions)
6. [Functional Requirements](#6-functional-requirements)
7. [Non-Functional Requirements](#7-non-functional-requirements)
8. [System Architecture](#8-system-architecture)
9. [Fraud Prevention Controls](#9-fraud-prevention-controls)
10. [Implementation Phases](#10-implementation-phases)
11. [Success Metrics](#11-success-metrics)
12. [Risks and Mitigations](#12-risks-and-mitigations)

---

## 1. Executive Summary

The Ministry of Transportation is implementing a **Driver Biometric Compliance & Fine Enforcement System** to address the widespread non-compliance with biometric registration requirements among drivers in Enugu State.

The current enforcement model relies on manual, paper-based processes where field agents collect fines informally. This approach suffers from:
- Massive revenue leakage through unrecorded collections
- Zero accountability for enforcement actions
- Inconsistent fine amounts determined by individual agents
- No visibility for ministry leadership into actual compliance rates

This system transforms the enforcement model by:
- Maintaining a central driver registry with real-time compliance status
- Enabling roadside agents to verify compliance and issue standardized digital tickets
- Routing all fine payments through traceable official digital channels
- Providing ministry leadership with a live command dashboard for monitoring

**Key Principle**: Agents are positioned as **verification and ticket-issuance officers only** - they can detect non-compliance and issue tickets, but cannot manipulate money records or set arbitrary fine amounts.

---

## 2. Problem Statement

### Current State
- Significant percentage of drivers have not completed biometric enrollment
- Roadside enforcement uses handwritten tickets with arbitrary amounts
- Agents collect cash directly with no audit trail
- Drivers have no verifiable proof of payment
- Repeat offenders cannot be identified reliably
- Ministry has no real-time visibility into enforcement operations

### Root Cause
The system was designed as a **routine payment tracking system** rather than a **compliance enforcement system**. This fundamental misdirection allowed:
- Cash-based collection with no accountability
- Agent discretion over fine amounts
- Manual record-keeping vulnerable to manipulation
- No automated reconciliation between tickets and payments

### The Shift Required
Move from tracking payments to **actively enforcing compliance**:
1. Identify drivers who have NOT completed biometrics
2. Catch them during road enforcement
3. Issue official digital fines
4. Force payment through approved channels
5. Track payments in real-time
6. Make cheating very difficult through automated controls

---

## 3. Product Vision

**Build the most cheat-resistant biometric compliance enforcement system** where:
- Every fine is traceable to a specific agent, location, and time
- Every payment is verifiable through official digital channels
- Every agent action is auditable with full accountability
- Ministry leadership has complete real-time visibility

The system operates on a single question during roadside checks: **"Has this driver completed biometrics at the Ministry or not?"**

---

## 4. Goals and Objectives

### Business Goals
| Goal | Target |
|------|--------|
| Increase biometric compliance rate | From ~40% to 85% within 12 months |
| Reduce revenue leakage | By at least 70% |
| Standardize fine amounts | 100% of tickets use fixed offence rates |
| Create complete audit trail | 100% of actions logged |

### Product Objectives
- Driver lookup in under 10 seconds
- Automated fine amount assignment (no agent discretion)
- Payment status auto-updates within 60 seconds
- SMS notifications for ticket issuance and payment
- Real-time dashboard with anomaly detection

---

## 5. User Roles and Permissions

### Role Matrix

| Permission | Admin | Supervisor | Agent | Finance |
|------------|:----:|:----------:|:-----:|:-------:|
| Manage system settings | ✓ | — | — | — |
| Create/edit driver records | ✓ | — | — | — |
| Search drivers | ✓ | ✓ | ✓ | — |
| Issue violation tickets | — | — | ✓ | — |
| View all tickets | ✓ | ✓ | Own only | ✓ |
| Cancel/waive tickets | ✓ | ✓ | — | — |
| View dashboard | ✓ | ✓ | Limited | ✓ |
| Generate reports | ✓ | ✓ | — | ✓ |
| View audit logs | ✓ | — | — | — |
| Reconcile payments | — | — | — | ✓ |

### Role Descriptions

**System Administrator**
- Full system access
- Manage users, roles, system settings
- Configure offence table
- Access audit logs

**Ministry Supervisor**
- Approve ticket cancellations and waivers
- Monitor agent activity
- Generate reports
- Cannot issue tickets directly

**Field Agent**
- Search driver records
- Verify compliance status
- Issue violation tickets only
- Cannot edit, cancel, or mark tickets as paid

**Finance Officer**
- Monitor payment reconciliation
- Generate financial reports
- Cannot edit enforcement records

---

## 6. Functional Requirements

### 6.1 Driver Compliance Database

#### Data Fields
| Field | Type | Required | Description |
|-------|------|:--------:|--------------|
| driver_id | UUID | Yes | System-generated unique identifier |
| full_name | String(150) | Yes | Driver's full legal name |
| phone_number | String(15) | Yes | Primary contact for SMS |
| plate_number | String(12) | Yes | Vehicle registration (primary lookup) |
| vehicle_type | Enum | Yes | Car/Bus/Truck/Motorcycle/Tricycle/Other |
| driver_photo | URL | Yes | Passport photograph |
| biometric_status | Enum | Yes | Enrolled/Not Enrolled/Pending/Failed |
| biodata_status | Enum | Yes | Complete/Incomplete/Pending Review |
| compliance_status | Enum | Yes | Compliant/Non-Compliant/Pending/Blacklisted |
| enrollment_date | DateTime | No | Date biometric completed |
| enrollment_center | String | No | Location of enrollment |
| qr_code | String | No | Encoded identifier for QR scanning |

#### Compliance Status Logic

| Status | Condition | Enforcement Action |
|--------|-----------|---------------------|
| **Compliant** | biometric_status = Enrolled AND biodata_status = Complete | No action - driver cleared |
| **Non-Compliant** | biometric_status = Not Enrolled OR biodata_status = Incomplete | Agent issues violation ticket |
| **Pending Review** | biometric_status = Pending OR biodata_status = Pending | Flag for supervisor - no fine |
| **Blacklisted** | 3+ unpaid tickets OR manual flag | Elevated fine + possible impoundment |

#### Functional Requirements
- FR-DR-001: CRUD operations on driver records
- FR-DR-002: Bulk import via CSV with validation
- FR-DR-003: Auto-compute compliance_status from biometric + biodata
- FR-DR-004: Search by plate_number, driver_id, phone_number, full_name (<2s)
- FR-DR-005: Complete change history with user tracking
- FR-DR-006: Soft delete only (no hard delete)
- FR-DR-007: Unique constraints on plate_number, phone_number
- FR-DR-008: Auto-blacklist after 3 unpaid tickets past deadline

---

### 6.2 Roadside Enforcement System

#### Agent Workflow
1. **Search** - Enter plate number, driver ID, or phone number
2. **Verify** - System displays driver photo + compliance status
3. **Decision** - If compliant: clear; If non-compliant: issue ticket
4. **Issue** - Select offence → Amount auto-fills → Confirm
5. **Record** - Ticket created with unique reference + SMS sent

#### Ticket Data Structure
| Field | Description |
|-------|-------------|
| ticket_number | Format: TKT-YYYYMMDD-XXXXX |
| driver_id | Reference to driver record |
| plate_number | From driver record |
| offence_code | From offence table |
| offence_description | Human-readable offence name |
| fine_amount | Auto-populated from offence table |
| status | Unpaid/Partial Payment/Paid/Cancelled/Waived |
| payment_reference | Unique code for driver payment |
| issued_at | Timestamp of issuance |
| due_date | Enforcement deadline |
| location | Enforcement location + optional GPS |
| agent_id | ID of issuing agent |
| payment_status | Tracks payment state |

#### Offence Table (Fixed Rates)

| Code | Description | Amount (₦) | Notes |
|------|-------------|-----------|-------|
| BIO-001 | Failure to complete biometric enrollment | 10,000 | Standard first offence |
| BIO-002 | Expired biometric compliance (>12mo) | 5,000 | 30-day grace period |
| BIO-003 | Repeat non-compliance (2nd offence) | 20,000 | Auto-escalated by system |
| BIO-004 | Repeat non-compliance (3rd+) | 50,000 | Blacklisted driver |
| BIO-005 | Fraudulent compliance documents | 100,000 | Refer to law enforcement |

#### Functional Requirements
- FR-EA-001: 2FA authentication (SMS OTP)
- FR-EA-002: Device-bound sessions (no concurrent login)
- FR-EA-003: Session timeout (8h active / 30min idle)
- FR-EA-004: Device/IP/location logged at login
- FR-EA-005: Search by plate/ID/phone with results in <2s
- FR-EA-006: Compliance status prominently color-coded
- FR-EA-007: Green = Compliant (no ticket option)
- FR-EA-008: Red = Non-Compliant (ticket workflow shown)
- FR-EA-009: Unknown driver → create provisional record (flagged)
- FR-EA-010: Offence selection auto-fills amount (read-only)
- FR-EA-011: Unique ticket number generated
- FR-EA-012: All ticket fields captured automatically
- FR-EA-013: SMS sent immediately on ticket creation
- FR-EA-014: Offline ticket creation with sync-on-reconnect
- FR-EA-015: No post-issuance edit/delete by agents

---

### 6.3 Fine Payment System

#### Payment Channels
| Channel | Provider | Method |
|---------|----------|--------|
| Bank Transfer | Paystack/Flutterwave | Transfer to official account with ticket reference |
| USSD | Paystack USSD | Dial code → enter reference → pay |
| Card/Online | Paystack/Flutterwave | Public payment portal |
| POS | System-linked POS | At designated locations only |

#### Payment Flow
1. Ticket issued → Payment reference sent via SMS
2. Driver pays through any official channel
3. Payment gateway sends webhook confirmation
4. System validates → updates ticket status → generates receipt
5. SMS receipt sent to driver

#### Functional Requirements
- FR-FM-001: Unique payment reference per ticket
- FR-FM-002: Auto-update status on webhook (no manual)
- FR-FM-003: SMS receipt on payment confirmation
- FR-FM-004: Supervisor cancellation requires documented reason
- FR-FM-005: Complete audit trail for all ticket changes
- FR-FM-006: Terminal states (Paid/Cancelled/Waived) locked
- FR-FM-007: Unpaid >30 days triggers escalation alert
- FR-FM-008: PDF receipt generation

#### Ticket Lifecycle

| Status | Allowed Transitions | Trigger |
|--------|---------------------|---------|
| Unpaid | → Paid | Payment webhook |
| Unpaid | → Partial Payment | Partial payment webhook |
| Unpaid | → Cancelled | Supervisor approval |
| Unpaid | → Waived | Supervisor approval |
| Partial Payment | → Paid | Subsequent payment |
| Paid | (terminal) | — |
| Cancelled | (terminal) | — |
| Waived | (terminal) | — |

---

### 6.4 Command Dashboard

#### Widgets

| Widget | Data | Audience |
|--------|------|----------|
| Compliance Overview | Total/Compliant/Non-Compliant/Blacklisted counts | All |
| Today's Enforcement | Tickets issued, amount issued, amount collected | Supervisor+ |
| Agent Activity | Per-agent tickets, times, last active | Supervisor+ |
| Revenue by Zone | Bar chart by location | Admin/Finance |
| Unpaid Fines Aging | 0-30 / 31-60 / 61-90 / 90+ days | Supervisor+ |
| Repeat Defaulters | Drivers with 2+ unpaid tickets | Supervisor+ |
| Suspicious Activity | Anomaly flags (high cancellations, low activity) | Admin |
| Payment Reconciliation | Tickets vs payments comparison | Finance |

#### Reports Available
- Daily Enforcement Summary
- Weekly/Monthly Revenue
- Agent Performance
- Compliance Trends
- Reconciliation Report

---

### 6.5 Notifications (SMS)

| Event | Message Template |
|-------|------------------|
| Ticket Issued | Your vehicle [PLATE] has been fined. Ticket: [NO]. Amount: ₦[AMOUNT]. Pay via [URL] or ref: [PAY_REF]. |
| Payment Confirmed | Payment received for Ticket [NO]. Amount: ₦[AMOUNT]. Receipt: [RECEIPT_NO]. Thank you. |
| Partial Payment | Partial payment ₦[PAID] received. Balance: ₦[BALANCE]. Pay before [DATE]. |
| Escalation Warning | URGENT: Fine for Ticket [NO] (₦[AMOUNT]) overdue. Pay now to avoid penalties. Ref: [PAY_REF] |
| Ticket Cancelled | Ticket [NO] cancelled by supervisor. No payment required. |

---

## 7. Non-Functional Requirements

### Performance
- Driver lookup: <2 seconds
- Dashboard refresh: <60 seconds
- Ticket creation: <5 seconds (including SMS)
- Concurrent agents: 500+

### Availability
- Uptime: 99.5% monthly
- Backup: Every 6 hours, 30-day retention
- Recovery time: <4 hours
- Data loss: <5 minutes

### Security
- TLS 1.2+ for transit
- AES-256 for data at rest
- bcrypt hashing (factor 12+)
- Rate limiting (5 attempts/15min)
- JWT authentication
- OWASP Top 10 compliance

### Scalability
- 2M driver records
- 5M ticket records
- Horizontal scaling via load balancing

### Usability
- Agent interface usable after 2-hour training
- One-handed mobile operation
- Maximum 3 taps to compliance check/ticket
- English interface (localization future)

---

## 8. System Architecture

### Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend (Dashboard) | React + TypeScript |
| Frontend (Agent PWA) | React PWA |
| API | Node.js/Express |
| Database | PostgreSQL |
| Cache | Redis |
| Payment | Paystack/Flutterwave |
| SMS | Termii/Africa's Talking |
| Storage | AWS S3 |

### Architecture Principles
- **Web-first**: Responsive web app, not native
- **API-first**: All frontend via REST API
- **Event-driven**: Webhook-based payment updates
- **Comprehensive logging**: Append-only audit log

---

## 9. Fraud Prevention Controls

This is the most critical section. Controls are mandatory and non-negotiable.

| # | Control | Implementation | Prevents |
|---|---------|----------------|----------|
| 1 | No handwritten tickets | All tickets created in app only | Ghost tickets, backdated entries |
| 2 | No agent-defined amounts | Fixed offence table, read-only | Agents inflating/reducing fines |
| 3 | Mandatory authentication | 2FA, device-bound, session logging | Shared accounts, deniability |
| 4 | Digital payments only | No cash, payment gateway only | Cash skimming, under-reporting |
| 5 | Auto payment update | Webhook triggers status change | Manual "paid" marking |
| 6 | Supervisor-only overrides | Cancel/waive requires reason | Agent deletion, reduction |
| 7 | Immutable audit log | Append-only, no modification | Evidence tampering |
| 8 | GPS capture | Optional location on ticket | Fake enforcement locations |
| 9 | Daily reconciliation | Automated tickets vs payments | Revenue leakage detection |
| 10 | Repeat offender flagging | Auto-flag multiple violations | Pattern fraud |

### Key Design Rule
> **The system must never depend on trust in roadside agents.**  
> Agents can detect and issue tickets. Agents cannot manipulate money records.

---

## 10. Implementation Phases

### Phase 1: Foundation (Months 1-4)
- Driver Registry with compliance status
- Enforcement Interface (basic)
- Fine Management (manual reconciliation)
- Dashboard (basic metrics)
- SMS Notifications

### Phase 2: Payments (Months 5-7)
- Payment Gateway Integration
- Auto-Receipt Generation
- Supervisor Approval Workflows
- Public Ticket Lookup Portal

### Phase 3: Intelligence (Months 8-10)
- QR Code/Sticker Support
- GPS Capture
- Anomaly Detection
- Advanced Analytics

---

## 11. Success Metrics

| Metric | Baseline | 6 Months | 12 Months |
|--------|----------|----------|-----------|
| Compliance Rate | ~40% | 65% | 85% |
| Revenue Leakage | ~60% | 20% | 10% |
| Digital Payment Rate | 0% | 80% | 95% |
| Audit Coverage | 0% | 100% | 100% |
| Avg Compliance Check | 5-10 min | <10s | <5s |

---

## 12. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Agent resistance (loss of informal income) | High | High | Strong mandate, training, performance incentives |
| Poor network in rural areas | High | Medium | Offline PWA with sync |
| Driver non-payment | Medium | High | SMS reminders, blacklisting, impoundment |
| Payment gateway downtime | Low | Medium | Dual providers, bank transfer fallback |
| Data privacy breach | Low | Critical | Encryption, NDPR compliance, RBAC |
| Agent-supervisor collusion | Medium | High | All waivers logged, anomaly detection |

---

## Appendix: Glossary

| Term | Definition |
|------|------------|
| Biometric Enrollment | Capturing fingerprints/photo at Ministry center |
| Biodata | Driver's personal information submitted for registration |
| Compliance Status | Computed field: Compliant/Non-Compliant/Pending/Blacklisted |
| Violation Ticket | Digital enforcement record for non-compliance |
| Payment Reference | Unique code for driver to pay fine |
| Offence Table | Fixed list of offences and amounts |
| Blacklisted | Driver with 3+ unpaid tickets |
| PWA | Progressive Web App (installable, offline-capable) |
| JWT | JSON Web Token for authentication |
| Webhook | HTTP callback from payment gateway |

---

*End of PRD*