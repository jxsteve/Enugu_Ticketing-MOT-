import type { Offence } from '@/types';
import { mockOffences } from '@/mock';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const offenceService = {
  async getOffences(): Promise<Offence[]> {
    await delay(200);
    return [...mockOffences];
  },
};
