CREATE TABLE IF NOT EXISTS zones (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name      VARCHAR(100) NOT NULL,
  code      VARCHAR(10) NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Seed Enugu zones
INSERT INTO zones (name, code) VALUES
  ('Enugu North', 'EN'),
  ('Enugu South', 'ES'),
  ('Enugu East', 'EE'),
  ('Nsukka', 'NS'),
  ('Udi', 'UD'),
  ('Awgu', 'AW'),
  ('Nkanu East', 'NE'),
  ('Nkanu West', 'NW'),
  ('Igbo-Eze North', 'IN'),
  ('Igbo-Eze South', 'IS')
ON CONFLICT (code) DO NOTHING;
