CREATE TABLE IF NOT EXISTS drivers (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name         VARCHAR(255) NOT NULL,
  phone_number      VARCHAR(20) NOT NULL,
  plate_number      VARCHAR(20) NOT NULL UNIQUE,
  vehicle_type      VARCHAR(20) NOT NULL CHECK (vehicle_type IN ('Car', 'Bus', 'Truck', 'Motorcycle', 'Tricycle', 'Other')),
  driver_photo      TEXT,
  biometric_status  VARCHAR(20) NOT NULL DEFAULT 'Not Enrolled' CHECK (biometric_status IN ('Enrolled', 'Not Enrolled', 'Pending', 'Failed')),
  biodata_status    VARCHAR(20) NOT NULL DEFAULT 'Incomplete' CHECK (biodata_status IN ('Complete', 'Incomplete', 'Pending Review')),
  compliance_status VARCHAR(20) NOT NULL DEFAULT 'Non-Compliant' CHECK (compliance_status IN ('Compliant', 'Non-Compliant', 'Pending Review', 'Blacklisted')),
  enrollment_date   TIMESTAMPTZ,
  enrollment_center VARCHAR(255),
  qr_code           TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_drivers_plate_number ON drivers (plate_number);
CREATE INDEX idx_drivers_compliance_status ON drivers (compliance_status);
CREATE INDEX idx_drivers_biometric_status ON drivers (biometric_status);
CREATE INDEX idx_drivers_phone_number ON drivers (phone_number);
