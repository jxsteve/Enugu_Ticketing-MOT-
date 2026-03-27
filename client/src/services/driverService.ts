import type { Driver, VehicleType, PaginatedResponse } from '@/types';
import { mockDrivers } from '@/mock';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface CreateDriverPayload {
  full_name: string;
  phone_number: string;
  plate_number: string;
  vehicle_type: VehicleType;
}

export const driverService = {
  async getDrivers(
    page: number = 1,
    pageSize: number = 10,
    search?: string,
  ): Promise<PaginatedResponse<Driver>> {
    await delay(300);

    let filtered = [...mockDrivers];

    if (search) {
      const query = search.toLowerCase();
      filtered = filtered.filter(
        (d) =>
          d.full_name.toLowerCase().includes(query) ||
          d.plate_number.toLowerCase().includes(query) ||
          d.phone_number.includes(query),
      );
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const data = filtered.slice(start, start + pageSize);

    return {
      data,
      total,
      page,
      page_size: pageSize,
      total_pages: totalPages,
    };
  },

  async getDriver(id: string): Promise<Driver> {
    await delay(250);

    const driver = mockDrivers.find((d) => d.id === id);
    if (!driver) {
      throw new Error(`Driver with ID ${id} not found`);
    }
    return { ...driver };
  },

  async searchDrivers(query: string): Promise<Driver[]> {
    await delay(200);

    if (!query.trim()) return [];

    const q = query.toLowerCase();
    return mockDrivers.filter(
      (d) =>
        d.full_name.toLowerCase().includes(q) ||
        d.plate_number.toLowerCase().includes(q) ||
        d.phone_number.includes(q),
    );
  },

  async checkDuplicate(plateNumber: string, phoneNumber: string): Promise<Driver | null> {
    await delay(150);

    const plate = plateNumber.toLowerCase();
    const phone = phoneNumber;
    return mockDrivers.find(
      (d) => d.plate_number.toLowerCase() === plate || d.phone_number === phone,
    ) || null;
  },

  async createDriver(payload: CreateDriverPayload): Promise<Driver> {
    await delay(400);

    const now = new Date().toISOString();
    const id = `drv-${String(mockDrivers.length + 1).padStart(3, '0')}`;
    const newDriver: Driver = {
      id,
      full_name: payload.full_name,
      phone_number: payload.phone_number,
      plate_number: payload.plate_number.toUpperCase(),
      vehicle_type: payload.vehicle_type,
      driver_photo: '',
      biometric_status: 'Not Enrolled',
      biodata_status: 'Incomplete',
      compliance_status: 'Non-Compliant',
      enrollment_date: null,
      enrollment_center: '',
      qr_code: '',
      created_at: now,
      updated_at: now,
    };

    mockDrivers.push(newDriver);
    return { ...newDriver };
  },
};
