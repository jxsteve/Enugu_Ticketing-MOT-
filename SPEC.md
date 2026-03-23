# Driver Biometric Compliance & Fine Enforcement System

## System Specification

This document outlines the complete specification for building the Enugu MOT biometric compliance enforcement system.

---

## 1. Architecture Overview

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: CSS Modules with custom design system
- **State Management**: React Context + useReducer
- **Routing**: React Router v6
- **Charts**: Recharts
- **Icons**: Lucide React
- **API Simulation**: Mock service layer

### Design Direction
**Aesthetic**: Industrial/Government - clean, authoritative, highly functional with subtle sophistication
**Theme**: Dark mode primary with high contrast for readability in field conditions
**Typography**: JetBrains Mono for data, DM Sans for UI text
**Colors**: Deep navy/charcoal foundation with amber/gold accents for authority

---

## 2. Modules

### Module 1: Driver Registry
- Driver list with search/filter
- Add/Edit driver forms
- Compliance status tracking (Compliant/Non-Compliant/Pending/Blacklisted)
- Bulk import capability
- Driver detail view with full history

### Module 2: Enforcement Interface (Agent App)
- Quick driver lookup by plate number, phone, driver ID
- Compliance status display (color coded)
- Ticket issuance workflow
- Offence type selection with auto-amount
- Offline ticket storage
- Ticket history view

### Module 3: Fine Management
- Ticket list with filters (status, date, agent, location)
- Ticket detail view
- Status tracking (Unpaid/Partial/Paid/Cancelled/Waived)
- Payment reference generation
- Receipt generation

### Module 4: Dashboard
- Compliance overview stats
- Today's enforcement metrics
- Agent activity table
- Revenue by zone chart
- Unpaid fines aging
- Repeat defaulters list
- Suspicious activity alerts

### Module 5: Settings
- Offence table management
- User management
- System configuration

---

## 3. Data Models

### Driver
```typescript
{
  id: string
  full_name: string
  phone_number: string
  plate_number: string
  vehicle_type: 'Car' | 'Bus' | 'Truck' | 'Motorcycle' | 'Tricycle' | 'Other'
  driver_photo: string
  biometric_status: 'Enrolled' | 'Not Enrolled' | 'Pending' | 'Failed'
  biodata_status: 'Complete' | 'Incomplete' | 'Pending Review'
  compliance_status: 'Compliant' | 'Non-Compliant' | 'Pending Review' | 'Blacklisted'
  enrollment_date: string | null
  enrollment_center: string
  qr_code: string
  created_at: string
  updated_at: string
}
```

### Ticket
```typescript
{
  id: string
  ticket_number: string
  driver_id: string
  plate_number: string
  offence_code: string
  offence_description: string
  fine_amount: number
  status: 'Unpaid' | 'Partial Payment' | 'Paid' | 'Cancelled' | 'Waived'
  payment_reference: string
  issued_at: string
  due_date: string
  location: string
  agent_id: string
  agent_name: string
  paid_at: string | null
  receipt_number: string | null
}
```

### User (Agent/Supervisor/Admin)
```typescript
{
  id: string
  name: string
  role: 'Admin' | 'Supervisor' | 'Agent' | 'Finance'
  email: string
  phone: string
  agent_id: string
  is_active: boolean
  created_at: string
}
```

### Offence
```typescript
{
  code: string
  description: string
  amount: number
  escalation_level: number
  is_active: boolean
}
```

---

## 4. Key Workflows

### Agent Ticket Issuance
1. Enter plate number in search
2. System displays driver info + compliance status
3. If Non-Compliant → Show "Issue Ticket" button
4. Select offence type → Amount auto-fills
5. Confirm → Ticket created with unique reference
6. SMS sent to driver

### Payment Flow
1. Driver receives SMS with payment reference
2. Driver pays via bank transfer/USSD/card
3. Webhook triggers payment confirmation
4. Ticket status → Paid
5. SMS receipt sent to driver

### Supervisor Actions
- View all tickets
- Cancel ticket (requires reason)
- Waive ticket (requires justification)
- Monitor agent activity

---

## 5. Fraud Prevention Features

1. **No handwritten tickets** - All digital
2. **Fixed offence amounts** - No agent discretion
3. **Agent authentication** - All actions logged
4. **Digital payments only** - No cash
5. **Auto payment update** - No manual marking
6. **Supervisor-only overrides** - With logging
7. **Immutable audit log** - Every action tracked
8. **Daily reconciliation** - Automated

---

## 6. Dashboard Metrics

| Widget | Description |
|--------|-------------|
| Compliance Overview | Total/Compliant/Non-Compliant/Blacklisted |
| Today's Enforcement | Tickets issued, amount issued, amount collected |
| Agent Activity | Per-agent ticket counts and times |
| Revenue by Zone | Bar chart by location |
| Unpaid Aging | 0-30 / 31-60 / 61-90 / 90+ days |
| Repeat Defaulters | Drivers with 2+ unpaid tickets |
| Suspicious Alerts | Anomaly flags |

---

## 7. Pages

1. **Login** - Agent/Admin authentication
2. **Dashboard** - Overview and metrics
3. **Drivers** - Driver registry list/search
4. **Driver Detail** - Single driver view
5. **Enforcement** - Agent search + ticket issuance
6. **Tickets** - Ticket list with filters
7. **Ticket Detail** - Single ticket view
8. **Reports** - Generate reports
9. **Settings** - Configuration

---

## 8. Acceptance Criteria

- [ ] Driver search returns results in <2s
- [ ] Compliance status prominently displayed with color coding
- [ ] Ticket amounts auto-populated from offence table
- [ ] No agent can edit ticket amount
- [ ] All actions logged with user ID
- [ ] Dashboard updates in real-time
- [ ] SMS notifications configured (mock)
- [ ] Payment webhook simulated
- [ ] Supervisor can cancel/waive with reason
- [ ] Audit log captures all changes