export interface Offence {
  code: string;
  description: string;
  amount: number;
  escalation_level: number;
  is_active: boolean;
}
