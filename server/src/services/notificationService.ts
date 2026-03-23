interface SmsPayload {
  to: string;
  message: string;
}

export async function sendSMS(payload: SmsPayload): Promise<void> {
  // TODO: Integrate with SMS gateway (e.g., Termii, Africa's Talking)
  // For now, log to console
  console.log(`[SMS] To: ${payload.to} | Message: ${payload.message}`);
}
