export type VehicleType = 'Car' | 'Bus' | 'Truck' | 'Motorcycle' | 'Tricycle' | 'Other';
export type BiometricStatus = 'Enrolled' | 'Not Enrolled' | 'Pending' | 'Failed';
export type BiodataStatus = 'Complete' | 'Incomplete' | 'Pending Review';
export type ComplianceStatus = 'Compliant' | 'Non-Compliant' | 'Pending Review' | 'Blacklisted';

export interface Driver {
  id: string;
  full_name: string;
  phone_number: string;
  plate_number: string;
  vehicle_type: VehicleType;
  driver_photo: string;
  biometric_status: BiometricStatus;
  biodata_status: BiodataStatus;
  compliance_status: ComplianceStatus;
  enrollment_date: string | null;
  enrollment_center: string;
  qr_code: string;
  created_at: string;
  updated_at: string;
}
