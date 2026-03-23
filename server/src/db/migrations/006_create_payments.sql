CREATE TABLE IF NOT EXISTS payments (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id         UUID NOT NULL REFERENCES tickets(id),
  payment_reference VARCHAR(50) NOT NULL,
  gateway_reference VARCHAR(100),
  amount_paid       NUMERIC(12, 2) NOT NULL,
  channel           VARCHAR(20) NOT NULL CHECK (channel IN ('Bank Transfer', 'USSD', 'Card', 'POS')),
  status            VARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Confirmed', 'Failed')),
  receipt_number    VARCHAR(50),
  paid_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reconciled_at     TIMESTAMPTZ
);

CREATE INDEX idx_payments_ticket_id ON payments (ticket_id);
CREATE INDEX idx_payments_payment_reference ON payments (payment_reference);
CREATE INDEX idx_payments_status ON payments (status);
