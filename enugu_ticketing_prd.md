# Product Requirements Document (PRD)
## Enugu State Driver Biometric Compliance & Enforcement Ticketing System

## 1. Document Control
**Product Name:** Enugu State Driver Biometric Compliance & Enforcement Ticketing System  
**Prepared For:** Enugu State Ministry of Transportation  
**Document Type:** Product Requirements Document (PRD)  
**Version:** 1.0  
**Status:** Draft  

---

## 2. Executive Summary
The Enugu State Driver Biometric Compliance & Enforcement Ticketing System is a digital platform for identifying commercial drivers who have not completed their biometric registration and biodata enrollment, issuing fines to defaulters on the road, collecting those fines through approved digital channels, and providing real-time visibility to ministry leadership.

The platform is designed to reduce revenue leakage, prevent roadside cash fraud, improve enforcement accountability, and create a single source of truth for driver compliance and fine management.

The system will support four major operational needs:
1. Maintain a central registry of drivers and biometric compliance status.
2. Enable roadside agents to verify drivers and issue digital tickets to defaulters.
3. Link each ticket to an official payment reference and track payment status automatically.
4. Provide management dashboards, audit trails, and fraud controls.

---

## 3. Problem Statement
The ministry is trying to push drivers to complete biometrics and biodata registration. Currently, enforcement is vulnerable to the following issues:
- Difficulty identifying non-compliant drivers in the field.
- Roadside cash handling and informal settlements.
- Weak visibility into who has been fined and who has paid.
- Limited auditability of agent actions.
- Manual processes that are slow, inconsistent, and easy to manipulate.

A digital system is required to ensure that defaulters are identified, fines are issued consistently, payments are tracked centrally, and cheating is minimized.

---

## 4. Product Vision
To build a secure, transparent, and enforceable digital compliance ticketing system that helps Enugu State increase biometric enrollment, reduce fraud in fine collection, and provide real-time operational visibility to government stakeholders.

---

## 5. Goals and Objectives
### 5.1 Business Goals
- Increase driver biometric registration compliance.
- Reduce revenue leakage from roadside enforcement.
- Eliminate or drastically reduce manual cash-based fine collection.
- Improve visibility into enforcement activity and fine payments.
- Create a traceable and auditable enforcement process.

### 5.2 Product Goals
- Provide instant lookup of a driver’s biometric compliance status.
- Allow authorized agents to issue digital tickets on the road.
- Ensure every ticket has a unique reference for payment.
- Automatically reconcile fine payments against issued tickets.
- Provide dashboards and reports for management oversight.

### 5.3 Success Metrics
- Percentage of drivers enrolled biometrically.
- Number of tickets issued per day/week/month.
- Percentage of tickets paid within 24/48/72 hours.
- Reduction in discrepancies between tickets issued and funds received.
- Reduction in canceled/waived tickets outside approved process.
- Number of enforcement actions with valid GPS and agent audit logs.

---

## 6. Non-Goals
The first release will not aim to:
- Replace the ministry’s full biometric capture infrastructure if that already exists elsewhere.
- Serve as a general transport licensing platform for every vehicle category.
- Automate legal prosecution workflows beyond ticket issuance and payment tracking.
- Support uncontrolled roadside cash collection.

---

## 7. Users and Roles
### 7.1 Primary Users
**Field Agent / Enforcement Officer**
- Verifies compliance status.
- Issues tickets to non-compliant drivers.
- Views ticket status for drivers already fined.

**Supervisor**
- Monitors field activity.
- Reviews exception requests.
- Approves ticket cancellations, waivers, or corrections.

**Finance / Accounts Officer**
- Monitors payment reconciliation.
- Reviews receipts and settlement reports.
- Tracks unpaid and overdue fines.

**Registry / Ministry Enrollment Officer**
- Maintains driver biodata and biometric registration records.
- Updates driver profile status after enrollment.

**Admin / System Administrator**
- Manages users, roles, offence rules, locations, and system configuration.

**Executive / Ministry Leadership**
- Monitors dashboards, revenue, compliance rates, and agent activity.

### 7.2 External User
**Driver**
- May receive SMS notices.
- Pays fines through approved digital channels.
- May verify fine details via portal or helpdesk.

---

## 8. Product Scope
### 8.1 In Scope
- Central driver registry with compliance status.
- Enforcement mobile app for roadside use.
- Ticket generation and management.
- Payment reference generation and payment status tracking.
- Admin dashboard and reporting.
- Audit logs and fraud controls.
- SMS notifications for ticket issuance and payment confirmation.

### 8.2 Out of Scope for Phase 1
- Full biometric capture device integration if not available yet.
- Offline court or legal appeal automation.
- Multi-state federation-wide transport compliance.

---

## 9. Core Product Requirements
### 9.1 Driver Registry Module
The system shall maintain a central database of commercial drivers and vehicle records.

**Required data fields:**
- Driver ID
- Full name
- Phone number
- Plate number
- Vehicle type
- Vehicle owner/company (optional)
- Driver photo
- Biodata completion status
- Biometric enrollment status
- Compliance status
- Date of enrollment
- Last updated timestamp

**Compliance statuses:**
- Compliant
- Non-compliant
- Pending review
- Suspended / Blacklisted

### 9.2 Enforcement Ticketing Module
The system shall allow field agents to search for a driver and issue a digital ticket when the driver is non-compliant.

**Search keys:**
- Plate number
- Driver ID
- Phone number
- QR code / sticker (future or optional)

**Ticket fields:**
- Ticket ID
- Driver ID
- Plate number
- Offence code
- Offence description
- Fine amount
- Date/time issued
- GPS coordinates / enforcement location
- Issuing agent ID
- Payment reference
- Ticket status
- Due date
- Notes (restricted)
- Attachment/photo evidence (optional)

**Ticket statuses:**
- Draft (optional, internal only)
- Issued
- Unpaid
- Paid
- Overdue
- Canceled
- Waived
- Disputed

### 9.3 Offence Rules Module
The system shall maintain a controlled offence and fine schedule.

**Examples:**
- Failure to complete biometric registration
- Failure to complete biodata registration
- Repeat biometric non-compliance

**Rule requirements:**
- Amount must be system-defined, not agent-entered.
- Offences can be active/inactive.
- Effective start and end dates must be supported.
- Only admin-level users can change offence rules.

### 9.4 Payment Tracking Module
The system shall generate a unique payment reference for each ticket and reconcile payment automatically.

**Supported payment options:**
- Bank transfer
- USSD
- Card / POS linked to official system
- Online payment portal

**Payment data fields:**
- Payment ID
- Ticket ID
- Payment reference
- Gateway reference
- Amount paid
- Payment channel
- Payment timestamp
- Payment status
- Receipt number
- Reconciliation status

### 9.5 Notification Module
The system shall notify drivers and relevant officers via SMS.

**Minimum notifications:**
- Ticket issued
- Payment confirmed
- Ticket overdue reminder

### 9.6 Reporting & Dashboard Module
The system shall provide dashboards and reports for operational and executive monitoring.

**Key dashboard metrics:**
- Total registered drivers
- Total compliant vs non-compliant drivers
- Tickets issued today / week / month
- Tickets paid vs unpaid
- Total amount due vs collected
- Tickets by agent
- Tickets by location
- Overdue tickets
- Suspicious activity indicators

### 9.7 Audit & Fraud Control Module
The system shall record immutable audit trails for sensitive actions.

**Audit events include:**
- Driver record creation/update
- Ticket issuance
- Ticket cancellation/waiver
- Payment reconciliation changes
- Role changes
- Login/logout events

---

## 10. Functional Requirements
### 10.1 Agent Workflow
1. Agent logs into mobile app.
2. Agent searches for driver using plate number, driver ID, phone number, or QR code.
3. System returns driver profile and compliance status.
4. If compliant, no ticket is issued.
5. If non-compliant, agent selects offence type.
6. System auto-populates fine amount and creates ticket.
7. System generates payment reference and stores ticket.
8. Driver receives SMS with ticket details and payment instructions.

### 10.2 Payment Workflow
1. Driver initiates payment through official channel.
2. Payment provider validates and processes payment.
3. Payment gateway sends callback/webhook to backend.
4. Backend matches payment reference to ticket.
5. Ticket status changes to Paid.
6. Receipt number is generated.
7. Driver and dashboard are updated.

### 10.3 Supervisor Workflow
1. Supervisor logs into admin dashboard.
2. Reviews ticket exceptions or dispute requests.
3. Approves or rejects ticket waiver/cancellation/correction.
4. System logs all approval decisions.

### 10.4 Registry Workflow
1. Enrollment officer registers or updates driver biodata.
2. Biometric enrollment status is updated.
3. Compliance status is recalculated automatically.

---

## 11. Non-Functional Requirements
### 11.1 Performance
- Search response time should be under 3 seconds under normal network conditions.
- Ticket issuance should complete within 5 seconds after form submission.
- Dashboard data refresh interval should be near real time, preferably under 60 seconds.

### 11.2 Availability
- Target availability: 99.5% or higher.
- Core services must support failover and daily backups.

### 11.3 Security
- Enforce authenticated access for all users.
- Use role-based access control (RBAC).
- Encrypt data in transit via HTTPS/TLS.
- Encrypt sensitive data at rest where applicable.
- Store password hashes securely.
- Log all sensitive actions.
- Prevent agent-side manipulation of amount and payment status.

### 11.4 Reliability
- Payment reconciliation must be idempotent.
- Ticket creation must avoid duplication.
- Audit logs must be append-only.

### 11.5 Scalability
- Support state-wide rollout across multiple enforcement zones.
- Support thousands of driver records and large daily ticket volume.

### 11.6 Usability
- Mobile app must be optimized for Android devices used in the field.
- Forms must be simple and quick to use under roadside conditions.
- Large buttons and low-friction workflows should be used.

### 11.7 Connectivity
- The solution should support poor network conditions.
- Optional offline capture and queued sync should be considered for later phases.

---

## 12. Technical Requirements
### 12.1 Core Applications
1. **Agent Mobile App (Android)**
   - Driver search
   - Compliance verification
   - Ticket issuance
   - Ticket history
   - Basic offline queueing (optional in later phase)

2. **Admin Web Portal**
   - Dashboard
   - User management
   - Driver registry management
   - Offence rules management
   - Ticket management
   - Reports and exports
   - Supervisor approvals

3. **Payment / Verification Portal**
   - Ticket lookup
   - Payment page or payment instructions
   - Receipt verification

### 12.2 Backend Services
- Authentication and authorization service
- Driver registry service
- Ticketing service
- Payment integration service
- Notification service
- Reporting and analytics service
- Audit logging service

### 12.3 Recommended Technology Stack
**Frontend / Dashboard**
- React.js or Next.js
- Tailwind CSS or equivalent admin UI framework

**Mobile App**
- Flutter or React Native for cross-platform speed
- Native Android if rugged device optimization is preferred

**Backend API**
- Node.js (NestJS/Express) or Python (Django/FastAPI)
- REST API for external/system integration

**Database**
- PostgreSQL preferred
- MySQL acceptable alternative

**Cache / Queue**
- Redis for background jobs, OTP/session caching, and rate limiting

**Messaging / Notifications**
- SMS gateway integration
- Background worker for notifications and retries

**Payments**
- Integration with local Nigerian payment gateway or bank transfer reconciliation service

**Infrastructure**
- Cloud hosting or government-approved hosting environment
- Object storage for photos and attachments
- Centralized logging and monitoring

### 12.4 External Integrations
- Payment gateway API
- SMS provider API
- Existing biometric registry API or periodic data import
- Optional government identity or enforcement systems later

---

## 13. System Architecture
### 13.1 High-Level Architecture
The platform will follow a modular client-server architecture:

**Clients**
- Agent mobile app
- Admin web dashboard
- Payment/verification portal

**Application Layer / Backend APIs**
- API Gateway / Backend API
- Auth Service
- Driver Registry Service
- Ticket Management Service
- Payment Reconciliation Service
- Notification Service
- Reporting Service
- Audit Service

**Data Layer**
- Relational database (PostgreSQL)
- Object/file storage for images and attachments
- Cache/message queue (Redis)

**External Services**
- SMS provider
- Payment gateway / banking rails
- Biometric enrollment data source

### 13.2 Architecture Diagram (Textual)
```text
[Agent Mobile App] -----|
[Admin Web Portal] -----|----> [API Gateway / Backend]
[Payment Portal] -------|
                              |--> [Auth Service]
                              |--> [Driver Registry Service]
                              |--> [Ticketing Service]
                              |--> [Payment Service]
                              |--> [Notification Service]
                              |--> [Reporting Service]
                              |--> [Audit Log Service]
                                      |
                                      v
                               [PostgreSQL Database]
                                      |
                                      v
                              [Object Storage / File Store]

External Integrations:
[Payment Gateway] ---> [Payment Service]
[SMS Provider] -----> [Notification Service]
[Biometric System] --> [Driver Registry Service]
```

### 13.3 Deployment Architecture
**Production Environment Components**
- Load balancer / reverse proxy
- Web application server(s)
- API server(s)
- Database server (managed or self-hosted HA)
- Redis / worker node(s)
- File storage
- Monitoring stack
- Backup service

### 13.4 Security Architecture
- JWT or session-based secure authentication
- Role-based access control
- API access restrictions by role
- TLS for all external/internal communications where applicable
- Secrets managed securely via environment or secret store
- Audit logs retained for compliance review

---

## 14. Data Model (Conceptual)
### 14.1 Core Entities
**drivers**
- id
- driver_code
- full_name
- phone_number
- plate_number
- vehicle_type
- photo_url
- biodata_status
- biometric_status
- compliance_status
- enrolled_at
- created_at
- updated_at

**agents**
- id
- agent_code
- name
- phone_number
- zone_id
- role_id
- device_id (optional)
- active_status
- created_at

**tickets**
- id
- ticket_code
- driver_id
- plate_number
- offence_id
- amount_due
- status
- issued_by_agent_id
- zone_id
- latitude
- longitude
- payment_reference
- due_date
- issued_at
- paid_at
- canceled_at
- waived_at
- created_at
- updated_at

**offences**
- id
- offence_code
- title
- description
- fixed_amount
- is_active
- effective_from
- effective_to

**payments**
- id
- ticket_id
- payment_reference
- gateway_reference
- amount_paid
- channel
- status
- receipt_number
- paid_at
- reconciled_at
- raw_payload

**audit_logs**
- id
- actor_type
- actor_id
- action
- entity_type
- entity_id
- old_value
- new_value
- ip_address
- device_info
- created_at

**zones / locations**
- id
- name
- code
- description

**users / roles**
- id
- username
- password_hash
- role_id
- linked_agent_id (optional)
- active_status
- last_login_at

---

## 15. API Requirements
### 15.1 Core API Domains
**Authentication API**
- POST /auth/login
- POST /auth/logout
- POST /auth/refresh

**Driver Registry API**
- GET /drivers/search
- GET /drivers/{id}
- POST /drivers
- PUT /drivers/{id}
- POST /drivers/import

**Ticketing API**
- POST /tickets
- GET /tickets/{id}
- GET /tickets/search
- POST /tickets/{id}/cancel
- POST /tickets/{id}/waive
- GET /drivers/{id}/tickets

**Offence API**
- GET /offences
- POST /offences
- PUT /offences/{id}

**Payment API**
- POST /payments/initiate
- POST /payments/webhook
- GET /payments/{reference}
- GET /tickets/{id}/receipt

**Dashboard API**
- GET /dashboard/summary
- GET /reports/tickets
- GET /reports/payments
- GET /reports/agents

**Audit API**
- GET /audit-logs

### 15.2 API Design Principles
- Versioned endpoints: /api/v1/
- Role-aware access control
- Idempotent webhook processing
- Pagination for search/list endpoints
- Standard error handling and validation

---

## 16. Detailed Fraud Prevention Controls
The product must be designed to reduce both external fraud and internal collusion.

### 16.1 Agent Controls
- Agents cannot define fine amounts manually.
- Agents cannot mark tickets as paid.
- Agents cannot delete tickets.
- Agents cannot cancel or waive tickets without supervisor approval.
- Every ticket must record issuing agent ID, device, time, and location.

### 16.2 Payment Controls
- Each ticket must have a unique payment reference.
- Only payment confirmation from approved channels may update payment status.
- Manual payment override should be restricted to finance supervisors and fully audited.
- Duplicate payment callbacks must not create duplicate receipts.

### 16.3 Data Controls
- Changes to offence amounts require admin approval and audit logs.
- Compliance status changes should be tracked historically.
- Ticket state transitions should be constrained.

### 16.4 Operational Controls
- End-of-day reconciliation between issued tickets and payments received.
- Daily supervisor review of canceled, waived, or disputed tickets.
- Alerts for suspicious agent behavior, such as excessive cancellations.

---

## 17. Reporting Requirements
### 17.1 Standard Reports
- Daily tickets issued
- Daily amount due vs amount paid
- Tickets by location
- Tickets by agent
- Non-compliant drivers list
- Overdue fines report
- Waived/canceled tickets report
- Payment reconciliation report
- Repeat offender report

### 17.2 Advanced Analytics
- Payment conversion rate by zone
- Agent productivity vs collection outcomes
- Trend of biometric compliance over time
- High-risk locations and repeat offender hotspots

---

## 18. Notifications and Messaging
### 18.1 Ticket Issuance SMS
Must include:
- Ticket number
- Offence summary
- Amount
- Payment reference
- Payment instruction
- Support/helpdesk contact (optional)

### 18.2 Payment Confirmation SMS
Must include:
- Ticket number
- Amount paid
- Receipt number
- Date/time paid

### 18.3 Overdue Reminder SMS
Must include:
- Ticket number
- Outstanding amount
- Payment instruction
- Warning of overdue status

---

## 19. Permissions Matrix (Summary)
### Agent
- Search drivers
- View driver compliance status
- Create tickets
- View tickets issued by self or allowed zone

### Supervisor
- All agent permissions
- View team tickets
- Approve/reject cancellations, waivers, corrections
- View supervisor dashboards

### Finance Officer
- View payment records
- Review reconciliation
- View receipts and settlement reports

### Registry Officer
- Create/update driver records
- Update biometric and biodata status

### Admin
- Manage users
- Manage roles
- Manage offence schedule
- View all data
- Configure system settings

### Executive
- View dashboards and reports only

---

## 20. Assumptions
- The ministry owns or can access the authoritative biometric enrollment status data.
- Enforcement agents will be assigned official devices or approved BYOD devices.
- Official payment channels will be available for reconciliation.
- Fine schedule and enforcement policy will be formally approved.

---

## 21. Risks and Dependencies
### Risks
- Poor network connectivity in the field.
- Incomplete or inconsistent driver records.
- Resistance from agents used to manual collection.
- Delayed payment reconciliation from banking channels.
- Operational pressure to allow exceptions outside system controls.

### Dependencies
- Approved offence/fine schedule.
- Availability of biometric registry data.
- Payment gateway or banking integration.
- SMS service provider.
- Agent training and enforcement SOP.

---

## 22. MVP Definition
### MVP Features
- Driver registry with compliance status
- Agent login and authentication
- Driver search by plate number / ID / phone number
- Ticket issuance with fixed offence rules
- Unique payment reference generation
- SMS on ticket issuance
- Admin dashboard for tickets and payments
- Basic payment reconciliation
- Audit logging

### MVP Exclusions
- QR sticker issuance
- Offline-first sync
- Predictive fraud analytics
- Dispute workflow automation beyond supervisor review

---

## 23. Suggested Delivery Phases
### Phase 1: Foundation
- Driver registry
- User/role management
- Offence rules
- Agent mobile app (search + ticket issuance)
- Admin dashboard
- Audit logs
- SMS integration

### Phase 2: Payments & Controls
- Payment gateway integration
- Receipt generation
- Reconciliation tools
- Supervisor approvals
- Overdue reminders

### Phase 3: Optimization
- QR code/sticker support
- GPS enforcement intelligence
- Fraud analytics
- Offline sync
- Advanced reporting

---

## 24. Acceptance Criteria
The system will be considered successful for initial rollout when:
- Agents can search for a driver and view compliance status reliably.
- Agents can issue a digital ticket in under 5 seconds after selecting an offence.
- Tickets automatically generate payment references.
- A successful payment updates ticket status automatically.
- Leadership can view ticket and payment data on a live dashboard.
- Sensitive actions are fully auditable.
- Unauthorized users cannot change fine amounts or mark tickets paid.

---

## 25. Recommended Next Deliverables
After approval of this PRD, the next documents to produce should be:
1. System design / technical architecture specification
2. Database schema and ERD
3. API contract document
4. UI wireframes for agent app and admin dashboard
5. Implementation roadmap with milestones
6. Security and audit policy document

---

## 26. Conclusion
This product should be implemented as a digital enforcement and payment-control platform, not merely as a record-keeping tool. The system’s value comes from combining driver compliance data, structured roadside ticketing, controlled payment collection, and strong auditability. If designed correctly, it will improve biometric enforcement, reduce leakages, and provide Enugu State with real-time visibility into compliance and fine revenue.

