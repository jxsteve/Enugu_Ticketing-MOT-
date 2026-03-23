# PRODUCT REQUIREMENTS DOCUMENT

## Driver Biometric Compliance & Fine Enforcement System

**Web Application Platform**

---

**Prepared for:** Ministry of Transportation

**Version:** 1.0 | March 2026

**Classification:** Confidential

---

## Document Control

| Field | Details |
|-------|---------|
| Document Title | Product Requirements Document — Driver Biometric Compliance & Fine Enforcement System |
| Version | 1.0 |
| Date | March 2026 |
| Author | Product Team |
| Status | Draft |
| Approved By | [Pending] |
| Distribution | Ministry of Transportation, Project Stakeholders |

### Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | March 2026 | Product Team | Initial draft |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Product Overview](#2-product-overview)
3. [Goals and Objectives](#3-goals-and-objectives)
4. [User Personas and Roles](#4-user-personas-and-roles)
5. [System Architecture Overview](#5-system-architecture-overview)
6. [Feature Requirements](#6-feature-requirements)
7. [Fraud Prevention and Anti-Cheating Controls](#7-fraud-prevention-and-anti-cheating-controls)
8. [Non-Functional Requirements](#8-non-functional-requirements)
9. [API Specification Summary](#9-api-specification-summary)
10. [Key User Stories](#10-key-user-stories)
11. [Phased Rollout Plan](#11-phased-rollout-plan)
12. [Risks and Mitigations](#12-risks-and-mitigations)
13. [Dependencies and Assumptions](#13-dependencies-and-assumptions)
14. [Glossary](#14-glossary)
15. [Approval and Sign-Off](#15-approval-and-sign-off)

---

## 1. Executive Summary

The Ministry of Transportation requires all commercial and private vehicle drivers to complete biometric registration as part of national transportation safety and identity management. However, a significant percentage of drivers have not complied with this mandate. Current enforcement on public roads relies on manual, paper-based processes where field agents collect fines informally. This approach suffers from widespread revenue leakage, unaccountable cash collection, inconsistent fine amounts, and no reliable audit trail.

This Product Requirements Document defines the specifications for a web-based **Driver Biometric Compliance and Fine Enforcement System**. The platform will enable the Ministry to maintain a central registry of all drivers and their biometric enrollment status, empower roadside agents to verify compliance and issue standardized digital violation tickets, route all fine payments through traceable official digital channels, and provide ministry leadership with a real-time command dashboard for monitoring enforcement activity, revenue collection, and internal fraud indicators.

The system is designed with anti-fraud controls at its core. Agents are positioned as verification and ticket-issuance officers only. They cannot set arbitrary fine amounts, collect cash, or manually mark fines as paid. All payments flow through integrated payment gateways that automatically reconcile with ticket records. Every action in the system is logged, timestamped, and attributed to a specific user.

The platform will be delivered in three phases: Phase 1 covers the driver registry, enforcement ticketing, dashboard, and SMS alerts. Phase 2 adds payment gateway integration, auto-receipt generation, and supervisor approval workflows. Phase 3 introduces QR-based identification, GPS capture, and advanced fraud analytics.

---

## 2. Product Overview

### 2.1 Problem Statement

The current enforcement model for biometric compliance is fundamentally broken. Roadside agents operate with minimal oversight, issuing handwritten tickets with arbitrarily determined fine amounts. Cash is collected on the spot with no reliable mechanism for tracking how much was collected, by whom, or whether the correct amount was remitted to the Ministry. Drivers have no verifiable proof of payment, and repeat offenders are difficult to identify because records exist only on paper, if they exist at all.

This creates four critical problems: massive revenue leakage as agents under-report or pocket collections, zero accountability because there is no audit trail linking agents to specific enforcement actions, inconsistent enforcement where drivers may be fined different amounts for the same offence depending on the agent, and no visibility for ministry leadership into the actual state of biometric compliance across the driver population.

### 2.2 Proposed Solution

A centralized web application that digitizes the entire compliance verification and fine enforcement workflow. The system transforms roadside agents from uncontrolled cash collectors into accountable verification officers operating within a tightly controlled digital environment. Agents can detect non-compliance and issue tickets, but they cannot freely manipulate money records. All financial transactions flow through official digital channels and update the system automatically.

### 2.3 Product Vision

To build the most cheat-resistant biometric compliance enforcement system where every fine is traceable, every payment is verifiable, and every agent action is auditable — giving the Ministry complete real-time visibility into enforcement operations and revenue collection.

### 2.4 Scope

This PRD covers the complete web application platform including the driver registry module, the agent-facing enforcement interface (responsive web app optimized for mobile), the fine management engine, payment gateway integration, SMS notification service, and the administrative command dashboard. Native mobile applications, biometric capture hardware integration at enrollment centers, and third-party government database integrations are outside the scope of this document but noted as future considerations.

---

## 3. Goals and Objectives

### 3.1 Business Goals

1. Increase biometric compliance rates among registered drivers from the current estimated 40% to 85% within 12 months of system deployment.
2. Reduce revenue leakage from roadside enforcement by at least 70% by eliminating cash-based fine collection.
3. Provide ministry leadership with real-time operational intelligence on enforcement activity, payment collection, and agent performance.
4. Create a tamper-resistant audit trail for every enforcement action, fine issuance, payment, and administrative override.
5. Standardize fine amounts across all enforcement locations by implementing a fixed offence table that agents cannot modify.

### 3.2 Product Objectives

1. Enable agents to verify a driver's biometric compliance status in under 10 seconds using plate number, driver ID, or phone number lookup.
2. Automate fine amount assignment based on offence type, eliminating agent discretion over monetary values.
3. Process fine payments entirely through digital channels with automatic ticket status updates within 60 seconds of payment confirmation.
4. Deliver SMS notifications to drivers for both ticket issuance and payment confirmation.
5. Surface suspicious patterns (unusual agent activity, repeat defaulters, high cancellation rates) through automated dashboard alerts.

### 3.3 Success Metrics

| Metric | Baseline | Target (6 months) | Target (12 months) |
|--------|----------|-------------------|---------------------|
| Biometric compliance rate | ~40% | 65% | 85% |
| Revenue leakage rate | ~60% estimated | 20% | 10% |
| Average compliance check time | 5–10 min (manual) | < 10 seconds | < 5 seconds |
| Digital payment rate for fines | 0% | 80% | 95% |
| Agent activity audit coverage | 0% | 100% | 100% |
| Ticket-to-payment reconciliation rate | Unknown | 90% | 98% |
| Dashboard data freshness | N/A (no dashboard) | Real-time (< 2 min delay) | Real-time (< 30 sec delay) |

---

## 4. User Personas and Roles

### 4.1 Role Definitions

The system implements strict role-based access control. Each role has precisely defined permissions, and the separation of duties is a core anti-fraud mechanism.

| Role | Description | Key Permissions |
|------|-------------|-----------------|
| System Administrator | IT staff responsible for system configuration, user management, and technical operations. | Full system access. Manage users, roles, system settings, offence table configuration, and audit logs. |
| Ministry Supervisor | Senior enforcement officers who oversee field agents and approve exceptions. | View all records. Approve ticket cancellations, fine waivers, and amount adjustments. Monitor agent activity. Cannot issue tickets directly. |
| Field Agent | Roadside enforcement officers who verify driver compliance and issue tickets. | Search driver records. View compliance status. Issue violation tickets. Cannot edit or cancel tickets, modify fine amounts, or mark tickets as paid. |
| Finance Officer | Accounts staff responsible for payment reconciliation and revenue reporting. | View payment records, generate financial reports, run reconciliation. Cannot edit enforcement records or issue tickets. |
| Driver (External) | Vehicle operators who are subject to biometric compliance requirements. | No system login. Receives SMS notifications. Pays fines via external payment channels. Can verify ticket status via public lookup portal. |

### 4.2 Persona Details

#### 4.2.1 Agent Emeka — Field Agent

Emeka is a 34-year-old enforcement officer stationed on the Benin-Ore expressway. He carries an Android smartphone and works 6-hour shifts. He previously used handwritten receipt books and collected cash fines. He needs a system that is fast (drivers become impatient), works on slow mobile networks, and is simple enough that he does not need extensive training. His primary frustration with the old system was being accused of pocketing money when he had no way to prove otherwise.

#### 4.2.2 Supervisor Amina — Ministry Supervisor

Amina is a 42-year-old senior officer at the Ministry. She oversees 30 field agents across 5 enforcement zones. She needs to monitor agent productivity, approve exception cases (such as waiving fines for elderly drivers with medical exemptions), and produce weekly enforcement reports for the Commissioner. She works from a desktop computer at the Ministry office and occasionally checks the dashboard from her phone.

#### 4.2.3 Director Okafor — Ministry Leadership

Director Okafor is the head of the enforcement division. He reports directly to the Commissioner and needs high-level operational intelligence: how many drivers are compliant, how much revenue is being collected, which zones are underperforming, and whether there are signs of internal fraud. He does not interact with individual records but needs the dashboard to tell a clear story at a glance.

#### 4.2.4 Accountant Funke — Finance Officer

Funke manages the daily reconciliation of fine payments against ticket records. She needs to quickly identify discrepancies: tickets marked as paid that have no matching bank transaction, payment amounts that do not match ticket amounts, and agents whose collection patterns deviate from the norm. She works from a desktop and produces daily reconciliation reports.

---

## 5. System Architecture Overview

### 5.1 High-Level Architecture

The system follows a modern three-tier web architecture with a clear separation between the presentation layer, business logic layer, and data layer. All components communicate through a RESTful API gateway secured with JWT-based authentication.

| Layer | Technology | Description |
|-------|-----------|-------------|
| Frontend (Dashboard) | React.js with TypeScript | Responsive web application for supervisors, administrators, and finance officers. Optimized for desktop with mobile-responsive layouts. |
| Frontend (Agent App) | React.js (PWA) | Progressive Web App optimized for mobile browsers. Supports offline ticket drafting with sync-on-reconnect capability. |
| API Gateway | Node.js / Express or Django REST Framework | Central API layer handling authentication, authorization, business logic, and data validation. |
| Database | PostgreSQL | Primary relational database for driver records, tickets, payments, user accounts, and audit logs. |
| Cache Layer | Redis | Session management, rate limiting, and caching of frequently accessed driver records. |
| Payment Integration | Paystack / Flutterwave API | Payment processing via card, bank transfer, and USSD. Webhook-based payment confirmation. |
| SMS Service | Termii / Africa's Talking API | Transactional SMS for ticket issuance notifications and payment receipts. |
| File Storage | AWS S3 or equivalent | Driver photos, document scans, and generated receipt PDFs. |
| Hosting | AWS / Azure / Local Cloud | Cloud-hosted with consideration for government data residency requirements. |

### 5.2 Key Architectural Decisions

- **Web-first approach:** The system is built as a responsive web application rather than native mobile apps, reducing development cost and ensuring all users (agents, supervisors, admins) access the same codebase. The agent interface is delivered as a Progressive Web App (PWA) that can be installed on Android devices and supports basic offline functionality.
- **API-first design:** All frontend interfaces communicate with the backend exclusively through a documented REST API. This enables future native mobile app development, third-party integrations, and programmatic access without rebuilding the backend.
- **Event-driven payment processing:** Payment confirmations arrive via webhook callbacks from payment gateway providers. The system does not poll for payment status. This ensures near-instant ticket status updates and reduces the risk of missed payments.
- **Comprehensive audit logging:** Every state change in the system (ticket creation, status update, payment recording, user login, role change) is written to an append-only audit log. Audit records cannot be modified or deleted by any user role, including system administrators.

---

## 6. Feature Requirements

### 6.1 Module 1: Driver Registry

The Driver Registry is the single source of truth for all driver records and their biometric compliance status. It is the foundation upon which all enforcement activity is based.

#### 6.1.1 Driver Record Data Model

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| driver_id | UUID | Yes | System-generated unique identifier for each driver record. |
| full_name | String (150) | Yes | Driver's full legal name as registered. |
| phone_number | String (15) | Yes | Primary phone number. Used for SMS notifications and as a lookup key. |
| email | String (100) | No | Optional email address. |
| plate_number | String (12) | Yes | Vehicle registration plate number. Primary lookup key for roadside enforcement. |
| vehicle_type | Enum | Yes | Category: Car, Bus, Truck, Motorcycle, Tricycle, Other. |
| driver_photo | URL/Path | Yes | Passport photograph captured during enrollment. |
| biometric_status | Enum | Yes | Enrolled, Not Enrolled, Pending, Failed. |
| biodata_status | Enum | Yes | Complete, Incomplete, Pending Review. |
| compliance_status | Enum | Yes | Compliant, Non-Compliant, Pending Review, Blacklisted. |
| enrollment_date | DateTime | No | Date biometric enrollment was completed. Null if not enrolled. |
| enrollment_center | String (100) | No | Location where enrollment was completed. |
| qr_code | String | No | Encoded QR identifier for physical card or windshield sticker (Phase 3). |
| created_at | DateTime | Yes | Record creation timestamp. |
| updated_at | DateTime | Yes | Last modification timestamp. |
| notes | Text | No | Administrative notes. Editable only by Supervisor or Admin roles. |

#### 6.1.2 Compliance Status Logic

The compliance_status field is the most critical field in the entire system. It is the single value that determines whether a driver is stopped and fined during roadside enforcement.

| Status | Condition | Enforcement Action |
|--------|-----------|-------------------|
| Compliant | biometric_status = Enrolled AND biodata_status = Complete | No action. Driver is cleared. |
| Non-Compliant | biometric_status = Not Enrolled OR biodata_status = Incomplete | Agent issues violation ticket. |
| Pending Review | biometric_status = Pending OR biodata_status = Pending Review | Agent notes status. No fine issued. Flagged for supervisor review. |
| Blacklisted | 3 or more unpaid violation tickets OR manually flagged by Supervisor | Agent issues ticket with elevated fine. Vehicle may be flagged for impoundment (policy-dependent). |

#### 6.1.3 Functional Requirements

- **FR-DR-001:** The system shall allow authorized administrators to create, read, update, and deactivate driver records.
- **FR-DR-002:** The system shall support bulk import of driver records via CSV upload with validation and error reporting.
- **FR-DR-003:** The system shall automatically compute compliance_status based on biometric_status and biodata_status fields using the logic table above.
- **FR-DR-004:** The system shall support searching driver records by plate_number, driver_id, phone_number, and full_name with results returned in under 2 seconds.
- **FR-DR-005:** The system shall maintain a complete change history for every driver record, recording which user made what change and when.
- **FR-DR-006:** The system shall prevent deletion of driver records. Deactivation shall be the only mechanism for removing drivers from active queries.
- **FR-DR-007:** The system shall enforce unique constraints on plate_number and phone_number to prevent duplicate registrations.
- **FR-DR-008:** The system shall automatically transition a driver's compliance_status to Blacklisted when 3 or more tickets remain unpaid past their enforcement deadline.

---

### 6.2 Module 2: Roadside Enforcement Interface

The enforcement interface is the primary tool used by field agents during roadside operations. It must be fast, reliable on poor network connections, and designed to minimize the possibility of agent manipulation.

#### 6.2.1 Agent Authentication

- **FR-EA-001:** Agents shall authenticate using a unique agent ID and password, with mandatory two-factor authentication via SMS OTP.
- **FR-EA-002:** Each agent session shall be bound to a single device at a time. Concurrent sessions on multiple devices shall be rejected.
- **FR-EA-003:** Agent sessions shall expire after 8 hours of continuous use or 30 minutes of inactivity, requiring re-authentication.
- **FR-EA-004:** The system shall record the device identifier, IP address, and approximate location at the time of each login.

#### 6.2.2 Driver Lookup

- **FR-EA-005:** The agent shall be able to search for a driver using plate_number (primary), driver_id, or phone_number.
- **FR-EA-006:** Search results shall display: driver's full name, photo, vehicle type, plate number, compliance status (prominently highlighted with color coding), and count of outstanding unpaid tickets.
- **FR-EA-007:** If the driver is Compliant, the interface shall display a clear green confirmation and no ticket issuance option shall be available.
- **FR-EA-008:** If the driver is Non-Compliant or Blacklisted, the interface shall display a red alert and present the ticket issuance workflow.
- **FR-EA-009:** If the driver record is not found in the system, the agent shall be able to create a provisional record with plate number, vehicle type, and a photo, which is flagged for administrative review.

#### 6.2.3 Ticket Issuance

- **FR-EA-010:** When issuing a ticket, the agent shall select the offence type from a predefined list. The system shall automatically populate the fine amount from the offence table. The agent shall not be able to modify the fine amount.
- **FR-EA-011:** The system shall generate a unique ticket number in the format TKT-YYYYMMDD-XXXXX (e.g., TKT-20260323-00142).
- **FR-EA-012:** Each ticket shall automatically capture and record: ticket number, driver ID, plate number, offence type, fine amount, date and time of issuance, enforcement location (manual entry with optional GPS coordinates), agent ID, and payment status (defaulting to Unpaid).
- **FR-EA-013:** Upon ticket creation, the system shall immediately send an SMS to the driver's registered phone number containing: ticket number, offence description, fine amount, payment reference, and payment instructions.
- **FR-EA-014:** The system shall support offline ticket creation when network connectivity is unavailable. Tickets created offline shall be queued locally and synced automatically when connectivity is restored. Offline tickets shall be clearly marked in the system until sync is confirmed.
- **FR-EA-015:** Agents shall not be able to edit, cancel, or delete any ticket after issuance. Only Supervisor-role users may perform these actions.

#### 6.2.4 Offence Table

The offence table is a system-managed reference that defines the list of valid offences and their corresponding fine amounts. Only System Administrators can modify this table, and all changes are logged.

| Offence Code | Description | Fine Amount (₦) | Escalation |
|-------------|-------------|-----------------|------------|
| BIO-001 | Failure to complete biometric enrollment | 10,000 | Standard first offence |
| BIO-002 | Expired biometric compliance (enrollment > 12 months without renewal) | 5,000 | Grace period: 30 days from expiry |
| BIO-003 | Repeat non-compliance (2nd offence within 6 months) | 20,000 | Auto-escalated by system |
| BIO-004 | Repeat non-compliance (3rd+ offence; Blacklisted driver) | 50,000 | Vehicle impoundment referral generated |
| BIO-005 | Operating with fraudulent or tampered compliance documents | 100,000 | Immediate blacklist; referred to law enforcement |

---

### 6.3 Module 3: Fine Management Engine

The Fine Management Engine is the central ledger for all violation tickets. It tracks the full lifecycle of every fine from issuance through payment or resolution.

#### 6.3.1 Ticket Lifecycle

Every ticket moves through a defined state machine. The allowed transitions and the roles authorized to trigger them are as follows:

| Current Status | Allowed Transitions | Trigger | Authorized Role |
|---------------|-------------------|---------|-----------------|
| Unpaid | Paid | Payment gateway webhook confirms full payment | System (automatic) |
| Unpaid | Partial Payment | Payment gateway confirms amount less than fine total | System (automatic) |
| Unpaid | Cancelled | Supervisor approves cancellation request with documented reason | Supervisor |
| Unpaid | Waived | Supervisor approves waiver with documented justification | Supervisor |
| Partial Payment | Paid | Subsequent payment(s) bring total to fine amount | System (automatic) |
| Paid | No further transitions | Terminal state. Record is locked. | N/A |
| Cancelled | No further transitions | Terminal state. Cancellation reason is permanently recorded. | N/A |
| Waived | No further transitions | Terminal state. Waiver justification is permanently recorded. | N/A |

#### 6.3.2 Functional Requirements

- **FR-FM-001:** The system shall generate a unique payment reference for each ticket that the driver uses when making payment through any approved channel.
- **FR-FM-002:** Ticket status shall update automatically upon receiving payment confirmation from the integrated payment gateway. No manual status change to Paid shall be permitted for agents.
- **FR-FM-003:** When a ticket status changes to Paid, the system shall immediately send an SMS receipt to the driver containing: ticket number, amount paid, date/time of payment, and official receipt number.
- **FR-FM-004:** Supervisors who cancel or waive a ticket shall be required to enter a documented reason. The system shall record the supervisor's ID, the timestamp, and the full justification text.
- **FR-FM-005:** The system shall maintain a complete audit log for every ticket, recording all status changes, the user who triggered each change, and the timestamp.
- **FR-FM-006:** Once a ticket reaches a terminal state (Paid, Cancelled, or Waived), the record shall be permanently locked against any further modification by any user role.
- **FR-FM-007:** The system shall automatically flag tickets that remain Unpaid for more than 30 days and generate escalation alerts to the assigned supervisor.
- **FR-FM-008:** The system shall support generating a printable/downloadable PDF receipt for any paid ticket.

---

### 6.4 Module 4: Payment Integration

All fine payments must flow through officially integrated digital channels. The system shall not support or acknowledge cash payments under any circumstances. This is the single most important design decision for preventing revenue leakage.

#### 6.4.1 Supported Payment Channels

| Channel | Provider | How It Works |
|---------|----------|-------------|
| Bank Transfer | Direct bank API or Paystack/Flutterwave | Driver transfers to a dedicated official account using the ticket payment reference as narration. System reconciles via bank statement API or payment gateway webhook. |
| USSD | Paystack USSD or telecom integration | Driver dials USSD code, enters payment reference, and completes payment. Confirmation is sent via webhook. |
| Card Payment (Online) | Paystack / Flutterwave | Driver visits the public payment portal, enters ticket reference, and pays by debit card. Standard redirect or inline checkout. |
| POS Terminal | System-linked POS | Approved POS terminals at designated locations only. Each terminal is registered in the system and linked to an official merchant account. Personal POS devices are not permitted. |

#### 6.4.2 Payment Processing Requirements

- **FR-PI-001:** Every ticket shall generate a unique payment reference that is communicated to the driver via SMS and displayed on the public lookup portal.
- **FR-PI-002:** The system shall receive payment confirmations exclusively via automated webhook callbacks from integrated payment providers. Manual payment entry shall not be supported for any user role below Supervisor.
- **FR-PI-003:** Upon receiving a payment webhook, the system shall validate the payment reference, verify the amount matches the ticket fine (or record as partial), update the ticket status, generate an official receipt number, send an SMS receipt to the driver, and log the complete transaction in the payment ledger.
- **FR-PI-004:** All payment records shall be immutable. Once a payment is recorded, it cannot be modified or deleted by any user.
- **FR-PI-005:** The system shall support partial payments. If a driver pays less than the full fine amount, the ticket status changes to Partial Payment and the remaining balance is tracked.
- **FR-PI-006:** The system shall run an automated daily reconciliation that compares payment gateway transaction records against internal ticket payment records and flags discrepancies for Finance Officer review.

---

### 6.5 Module 5: Command Dashboard and Reporting

The command dashboard is the central monitoring interface for Ministry leadership, supervisors, and finance officers. It provides real-time visibility into every aspect of the enforcement operation.

#### 6.5.1 Dashboard Widgets

| Widget | Data Displayed | User Role |
|--------|---------------|-----------|
| Compliance Overview | Total drivers registered, compliant count, non-compliant count, blacklisted count. Displayed as summary cards with trend arrows. | All dashboard users |
| Today's Enforcement | Tickets issued today, total fines issued today (amount), total fines collected today, unpaid fine amount outstanding. | Supervisor, Admin, Finance |
| Agent Activity | Per-agent breakdown: tickets issued, collection rate, active hours, last activity timestamp. Sortable and filterable. | Supervisor, Admin |
| Revenue by Zone | Fine revenue broken down by enforcement location/zone. Displayed as bar chart with daily/weekly/monthly toggle. | Admin, Finance |
| Unpaid Fines Aging | Count and total value of unpaid fines grouped by age: 0–30 days, 31–60 days, 61–90 days, 90+ days. | Supervisor, Admin, Finance |
| Repeat Defaulters | Drivers with 2+ unpaid tickets. Sorted by total outstanding amount. Direct link to driver record. | Supervisor, Admin |
| Suspicious Activity Alerts | System-generated flags: agents with abnormally high cancellation requests, agents with unusually low ticket counts, payment anomalies. | Admin |
| Payment Reconciliation | Daily comparison of tickets vs. payments. Highlights mismatches and unmatched transactions. | Finance |

#### 6.5.2 Reporting

The system shall support generating the following reports in PDF and Excel formats. Reports can be filtered by date range, enforcement zone, agent, and offence type.

- **Daily Enforcement Summary:** Tickets issued, payments received, unpaid fines, agent activity breakdown.
- **Weekly/Monthly Revenue Report:** Total fine revenue collected, comparison with previous period, breakdown by payment channel.
- **Agent Performance Report:** Per-agent metrics including tickets issued, average processing time, cancellation rate, and anomaly flags.
- **Compliance Trend Report:** Change in compliance rates over time, new enrollments, repeat offender trends.
- **Reconciliation Report:** Detailed comparison of payment gateway records vs. internal ticket records for a given period.

---

### 6.6 Module 6: Notifications and SMS

SMS is the primary notification channel because the majority of drivers do not use email or smartphones capable of running apps. Every critical event in the enforcement lifecycle triggers an SMS to the affected driver.

| Event | SMS Template | Recipient |
|-------|-------------|-----------|
| Ticket Issued | Your vehicle [PLATE] has been fined for non-compliance with biometric registration. Ticket: [TICKET_NO]. Amount: ₦[AMOUNT]. Pay via [PAYMENT_URL] or use reference [PAY_REF]. | Driver |
| Payment Confirmed | Payment received for Ticket [TICKET_NO]. Amount: ₦[AMOUNT]. Receipt: [RECEIPT_NO]. Thank you. | Driver |
| Partial Payment | Partial payment of ₦[AMOUNT_PAID] received for Ticket [TICKET_NO]. Remaining balance: ₦[BALANCE]. Pay before [DEADLINE]. | Driver |
| Escalation Warning | URGENT: Your fine for Ticket [TICKET_NO] (₦[AMOUNT]) is overdue. Pay immediately to avoid penalties. Reference: [PAY_REF]. | Driver |
| Ticket Cancelled | Ticket [TICKET_NO] has been cancelled by an authorized supervisor. No payment is required. | Driver |

---

## 7. Fraud Prevention and Anti-Cheating Controls

Fraud prevention is not a feature — it is a design principle that informs every module, every workflow, and every permission boundary in the system. The following controls are mandatory and non-negotiable.

| Control | Implementation | What It Prevents |
|---------|---------------|-----------------|
| No handwritten tickets | All tickets must be created digitally within the enforcement app. The system does not accept retroactive ticket entry. | Ghost tickets, backdated tickets, fabricated enforcement. |
| No agent-defined fine amounts | Fine amounts are auto-populated from the offence table based on offence type. The amount field is read-only for agents. | Agents inflating fines and pocketing the difference, or reducing fines in exchange for bribes. |
| Mandatory agent authentication | Every action is tied to a logged-in agent with 2FA. Session bound to single device. | Shared accounts, unauthorized access, deniability. |
| Digital-only payments | No cash collection permitted. All payments routed through integrated payment gateways. | Cash skimming, under-reporting, pocket collection. |
| Automatic payment confirmation | Ticket status updates via payment gateway webhooks, not manual agent input. | Agents marking tickets as paid without actual payment, or pocketing cash and marking as paid. |
| Supervisor-only overrides | Only Supervisor role can cancel, waive, or modify tickets. Every override requires documented justification. | Agents deleting evidence, reducing fines for bribes, covering tracks. |
| Immutable audit log | Append-only log of every action. Cannot be modified or deleted by any role including admin. | Evidence tampering, log manipulation, retroactive cover-ups. |
| GPS capture (Phase 3) | Optional GPS coordinates recorded at time of ticket issuance. | Fake enforcement locations, agents issuing tickets from home. |
| Anomaly detection | Dashboard flags: agents with unusually high/low activity, high cancellation rates, tickets issued outside working hours. | Systematic fraud patterns, collusion between agents. |
| Daily reconciliation | Automated comparison of tickets issued vs. payments received vs. bank settlements. | Revenue leakage, payment recording errors, systematic theft. |

---

## 8. Non-Functional Requirements

### 8.1 Performance

- **NFR-001:** Driver lookup queries shall return results in under 2 seconds under normal load conditions.
- **NFR-002:** The dashboard shall refresh data at intervals no greater than 60 seconds.
- **NFR-003:** The system shall support at least 500 concurrent agent sessions without degradation.
- **NFR-004:** Ticket creation shall complete (including SMS dispatch) in under 5 seconds on a 3G connection.

### 8.2 Availability and Reliability

- **NFR-005:** The system shall maintain 99.5% uptime measured on a monthly basis.
- **NFR-006:** The system shall implement automated database backups every 6 hours with 30-day retention.
- **NFR-007:** In the event of a complete server failure, the system shall be recoverable to the last backup within 4 hours (Recovery Time Objective).
- **NFR-008:** No more than 5 minutes of data may be lost during an unplanned outage (Recovery Point Objective).

### 8.3 Security

- **NFR-009:** All data in transit shall be encrypted using TLS 1.2 or higher.
- **NFR-010:** All data at rest (database, file storage) shall be encrypted using AES-256.
- **NFR-011:** Passwords shall be hashed using bcrypt with a minimum cost factor of 12.
- **NFR-012:** The system shall implement rate limiting on authentication endpoints (maximum 5 failed attempts per 15 minutes per account).
- **NFR-013:** All API endpoints shall require valid JWT tokens with role-based claims.
- **NFR-014:** The system shall pass OWASP Top 10 vulnerability testing before production deployment.

### 8.4 Scalability

- **NFR-015:** The database shall be designed to handle up to 2 million driver records and 5 million ticket records without query performance degradation.
- **NFR-016:** The system architecture shall support horizontal scaling of the API layer through load balancing.

### 8.5 Usability

- **NFR-017:** The agent enforcement interface shall be usable by officers with minimal smartphone experience after a 2-hour training session.
- **NFR-018:** The agent interface shall be designed for one-handed operation on a mobile device.
- **NFR-019:** Critical actions (compliance check, ticket issuance) shall require no more than 3 taps from the home screen.
- **NFR-020:** The system shall support English language interface at launch, with provision for localization into local languages in future releases.

### 8.6 Compliance

- **NFR-021:** The system shall comply with the Nigeria Data Protection Regulation (NDPR) for handling personal data and biometric information.
- **NFR-022:** All biometric data references shall be stored as pointers to the Ministry's biometric database, not as raw biometric templates within this system.
- **NFR-023:** The system shall implement data retention policies as directed by Ministry legal counsel.

---

## 9. API Specification Summary

The following table summarizes the core API endpoints. A detailed OpenAPI (Swagger) specification will be produced as a separate technical document during the design phase.

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| /api/auth/login | POST | Authenticate user and return JWT token. | No |
| /api/auth/verify-otp | POST | Verify 2FA OTP for agent login. | No |
| /api/drivers | GET | List/search drivers with pagination and filters. | Yes (Agent+) |
| /api/drivers/{id} | GET | Retrieve full driver record. | Yes (Agent+) |
| /api/drivers | POST | Create new driver record. | Yes (Admin) |
| /api/drivers/{id} | PATCH | Update driver record fields. | Yes (Admin) |
| /api/drivers/import | POST | Bulk import drivers from CSV. | Yes (Admin) |
| /api/tickets | POST | Create new violation ticket. | Yes (Agent) |
| /api/tickets | GET | List/search tickets with filters. | Yes (Agent+) |
| /api/tickets/{id} | GET | Retrieve full ticket record with history. | Yes (Agent+) |
| /api/tickets/{id}/cancel | POST | Cancel a ticket (requires reason). | Yes (Supervisor) |
| /api/tickets/{id}/waive | POST | Waive a ticket (requires justification). | Yes (Supervisor) |
| /api/payments/webhook | POST | Receive payment confirmation from gateway. | Webhook signature |
| /api/payments/{ticket_id} | GET | Get payment details for a ticket. | Yes (Agent+) |
| /api/offences | GET | List all offence types and amounts. | Yes (Agent+) |
| /api/offences | POST/PATCH | Create or update offence definitions. | Yes (Admin) |
| /api/dashboard/summary | GET | Dashboard summary statistics. | Yes (Supervisor+) |
| /api/dashboard/agents | GET | Agent activity metrics. | Yes (Supervisor+) |
| /api/reports/{type} | GET | Generate report (PDF/Excel). | Yes (Supervisor+) |
| /api/audit-log | GET | Query audit log entries. | Yes (Admin) |
| /api/public/ticket/{reference} | GET | Public ticket status lookup (no auth). | No |

---

## 10. Key User Stories

The following user stories represent the core workflows that must be supported by the system. Each story includes acceptance criteria that define the conditions under which the story is considered complete.

### 10.1 Agent Stories

**US-A01:** As a field agent, I want to search for a driver by plate number so that I can quickly verify their biometric compliance status during a roadside stop.

*Acceptance Criteria:* Agent enters plate number in search field. System returns matching driver record within 2 seconds. Compliance status is displayed prominently with color coding (green for compliant, red for non-compliant, orange for pending, black for blacklisted). Driver's photo is displayed for visual verification.

**US-A02:** As a field agent, I want to issue a digital violation ticket to a non-compliant driver so that the offence is officially recorded and the driver is directed to pay through proper channels.

*Acceptance Criteria:* Agent selects offence type from dropdown. Fine amount auto-populates and cannot be edited. Agent confirms ticket creation. System generates unique ticket number and payment reference. Driver receives SMS within 30 seconds. Ticket appears in the agent's activity log and on the dashboard immediately.

**US-A03:** As a field agent, I want to issue tickets even when I have no network connectivity so that enforcement is not interrupted by poor mobile signal.

*Acceptance Criteria:* When offline, agent can create tickets that are stored locally. A clear offline indicator is shown. When connectivity is restored, tickets sync automatically. Synced tickets are flagged with original creation time and sync time. Agent receives confirmation of successful sync.

### 10.2 Supervisor Stories

**US-S01:** As a supervisor, I want to approve or reject ticket cancellation requests so that only legitimate cancellations are processed and all decisions are documented.

*Acceptance Criteria:* Supervisor sees queue of pending cancellation requests. Each request shows the ticket details, the agent who issued it, and the reason for the cancellation request. Supervisor can approve (with comments) or reject. All decisions are logged with supervisor ID and timestamp. The driver is notified via SMS of the outcome.

**US-S02:** As a supervisor, I want to see a real-time view of all my agents' activity so that I can identify agents who are underperforming or exhibiting suspicious patterns.

*Acceptance Criteria:* Dashboard displays per-agent metrics: tickets issued today, last active timestamp, current location (if GPS is available), and a flag if any anomaly is detected. Supervisor can drill down into any agent's full activity history.

### 10.3 Finance Stories

**US-F01:** As a finance officer, I want to run a daily reconciliation report that compares tickets issued against payments received so that I can identify discrepancies and potential revenue loss.

*Acceptance Criteria:* Report shows total tickets issued for selected date, total expected revenue, total actual payments received, variance amount and percentage, and a list of specific unmatched records. Report can be exported as Excel and PDF.

---

## 11. Phased Rollout Plan

The system will be delivered in three phases, each building on the capabilities of the previous phase. This approach allows the Ministry to begin realizing value quickly while managing implementation risk.

| Phase | Timeline | Modules Delivered | Key Outcomes |
|-------|----------|-------------------|--------------|
| Phase 1: Foundation | Months 1–4 | Driver Registry, Enforcement Interface, Fine Management (manual reconciliation), Command Dashboard (basic), SMS Notifications | Agents can verify compliance and issue digital tickets. Dashboard provides basic operational visibility. SMS notifies drivers of fines. Manual payment tracking against bank statements. |
| Phase 2: Payments | Months 5–7 | Payment Gateway Integration, Auto-Receipt Generation, Supervisor Approval Workflows, Public Ticket Lookup Portal | Drivers can pay fines digitally. Ticket status updates automatically. Supervisors have formal approval queues. Daily reconciliation is automated. |
| Phase 3: Intelligence | Months 8–10 | QR Code/Sticker Support, GPS Capture at Ticket Issuance, Anomaly Detection and Fraud Flags, Advanced Analytics and Trend Reporting | Faster driver identification via QR scan. Location verification for enforcement activity. Automated detection of suspicious patterns. Comprehensive reporting for strategic decision-making. |

---

## 12. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Agent resistance to digital system (loss of informal income) | High | High | Strong ministry mandate. Training that positions the system as protecting agents from false accusations. Performance incentive program. |
| Poor mobile network in rural enforcement zones | High | Medium | Offline-capable PWA for ticket issuance. Sync-on-reconnect. SMS-based fallback for driver notifications. |
| Driver non-payment of digital fines | Medium | High | Escalation workflow: SMS reminders at 7, 14, and 21 days. Blacklisting after 30 days. Vehicle impoundment referral at 90 days. |
| Payment gateway downtime | Low | Medium | Integrate with 2 payment providers for redundancy. Bank transfer remains available as fallback channel. |
| Data privacy breach | Low | Critical | Encryption at rest and in transit. NDPR compliance audit. Role-based access control. Regular penetration testing. |
| Scope creep during development | Medium | Medium | Strict adherence to phased delivery. Change request process requiring stakeholder approval and impact assessment. |
| Agent-supervisor collusion on ticket waivers | Medium | High | All waivers logged and visible to Admin. Dashboard flags supervisors with abnormally high waiver rates. Monthly waiver audit required. |

---

## 13. Dependencies and Assumptions

### 13.1 Dependencies

1. The Ministry provides a clean, structured dataset of currently registered drivers for initial database seeding.
2. The Ministry designates an official bank account or Treasury Single Account (TSA) sub-account for receiving fine payments.
3. The Ministry's existing biometric enrollment system can provide an API or data export of enrollment status for each driver, enabling synchronization with the compliance database.
4. Payment gateway provider (Paystack/Flutterwave) onboarding and merchant account approval are completed before Phase 2 begins.
5. SMS service provider account is provisioned and sender ID is registered before Phase 1 launch.
6. Agent smartphones or tablets are procured, configured, and distributed before Phase 1 pilot launch.

### 13.2 Assumptions

1. The Ministry has the legal authority to mandate biometric enrollment and enforce fines for non-compliance.
2. The majority of field agents have basic smartphone literacy sufficient to use a mobile web application after training.
3. The Ministry will provide at least one dedicated staff member to serve as Product Owner throughout the development and rollout process.
4. Internet connectivity (3G minimum) is available at the majority of enforcement locations, with the understanding that some locations may require offline capability.
5. The Ministry accepts that a phased rollout is preferable to a big-bang launch for risk management purposes.

---

## 14. Glossary

| Term | Definition |
|------|-----------|
| Biometric Enrollment | The process of capturing a driver's biometric data (fingerprints, facial photograph) at an authorized Ministry enrollment center. |
| Biodata | The driver's personal information (name, address, vehicle details) submitted as part of the registration process. |
| Compliance Status | The computed field indicating whether a driver has fulfilled all biometric and biodata requirements. |
| Violation Ticket | A digital enforcement record issued by an agent when a driver is found to be non-compliant. |
| Payment Reference | A unique code generated for each ticket that the driver uses to make payment through approved channels. |
| Offence Table | The system-managed lookup table defining valid offence types and their corresponding fine amounts. |
| Blacklisted | A driver status indicating repeated non-compliance or multiple unpaid fines, triggering elevated enforcement actions. |
| PWA | Progressive Web App. A web application that can be installed on a mobile device and provides app-like functionality including offline support. |
| TSA | Treasury Single Account. A unified government bank account structure used for collecting public revenue. |
| NDPR | Nigeria Data Protection Regulation. The national data privacy law governing the handling of personal data. |
| JWT | JSON Web Token. A standard for securely transmitting authentication and authorization claims between systems. |
| Webhook | An automated HTTP callback triggered by an event in an external system (e.g., payment confirmation from a gateway). |

---

## 15. Approval and Sign-Off

By signing below, the undersigned stakeholders confirm that they have reviewed this Product Requirements Document and approve its contents as the basis for system design and development.

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Project Sponsor | | | |
| Ministry Representative | | | |
| Product Owner | | | |
| Technical Lead | | | |
| Finance Representative | | | |

---

*Confidential — Ministry of Transportation | v1.0 — March 2026*
