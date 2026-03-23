import type { Driver, PaginatedResponse } from '@/types';
import { mockDrivers } from '@/mock';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
};
