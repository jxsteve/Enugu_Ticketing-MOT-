CREATE TABLE IF NOT EXISTS offences (
  code             VARCHAR(10) PRIMARY KEY,
  description      VARCHAR(500) NOT NULL,
  amount           NUMERIC(12, 2) NOT NULL,
  escalation_level INTEGER NOT NULL DEFAULT 1,
  is_active        BOOLEAN NOT NULL DEFAULT true
);

-- Seed biometric offences
INSERT INTO offences (code, description, amount, escalation_level) VALUES
  ('BIO-001', 'Failure to enroll biometric data', 5000.00, 1),
  ('BIO-002', 'Incomplete biodata submission', 3000.00, 1),
  ('BIO-003', 'Operating with expired biometric registration', 7500.00, 2),
  ('BIO-004', 'Tampering with biometric QR code', 15000.00, 3),
  ('BIO-005', 'Repeat non-compliance after prior ticket', 10000.00, 2)
ON CONFLICT (code) DO NOTHING;
