import type { AuditLog, PaginatedResponse } from '@/types';
import { mockAuditLogs } from '@/mock';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const auditService = {
  async getAuditLogs(
    page: number = 1,
    pageSize: number = 10,
  ): Promise<PaginatedResponse<AuditLog>> {
    await delay(300);

    const sorted = [...mockAuditLogs].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

    const total = sorted.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const data = sorted.slice(start, start + pageSize);

    return {
      data,
      total,
      page,
      page_size: pageSize,
      total_pages: totalPages,
    };
  },
};
