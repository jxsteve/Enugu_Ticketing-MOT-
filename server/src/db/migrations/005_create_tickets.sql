CREATE TABLE IF NOT EXISTS tickets (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number       VARCHAR(30) NOT NULL UNIQUE,
  driver_id           UUID NOT NULL REFERENCES drivers(id),
  plate_number        VARCHAR(20) NOT NULL,
  offence_code        VARCHAR(10) NOT NULL REFERENCES offences(code),
  offence_description VARCHAR(500) NOT NULL,
  fine_amount         NUMERIC(12, 2) NOT NULL,
  status              VARCHAR(20) NOT NULL DEFAULT 'Unpaid' CHECK (status IN ('Unpaid', 'Partial Payment', 'Paid', 'Cancelled', 'Waived')),
  payment_reference   VARCHAR(50),
  issued_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  due_date            TIMESTAMPTZ NOT NULL,
  location            VARCHAR(255) NOT NULL,
  agent_id            UUID NOT NULL REFERENCES users(id),
  agent_name          VARCHAR(255) NOT NULL,
  paid_at             TIMESTAMPTZ,
  receipt_number      VARCHAR(50)
);

CREATE INDEX idx_tickets_ticket_number ON tickets (ticket_number);
CREATE INDEX idx_tickets_driver_id ON tickets (driver_id);
CREATE INDEX idx_tickets_status ON tickets (status);
CREATE INDEX idx_tickets_agent_id ON tickets (agent_id);
CREATE INDEX idx_tickets_issued_at ON tickets (issued_at);
CREATE INDEX idx_tickets_due_date ON tickets (due_date);
