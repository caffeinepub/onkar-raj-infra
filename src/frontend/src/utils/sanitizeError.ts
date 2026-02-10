/**
 * Sanitize error messages for safe console logging.
 * Removes sensitive information like passkeyss, tokens, and credentials.
 */
export function sanitizeError(error: any): string {
  if (!error) return 'Unknown error';
  
  let message = error.message || String(error);
  
  // Remove potential sensitive patterns
  // Remove anything that looks like a passkey or token (alphanumeric strings > 6 chars)
  message = message.replace(/\b[a-zA-Z0-9]{7,}\b/g, '[REDACTED]');
  
  // Remove URLs with query parameters
  message = message.replace(/https?:\/\/[^\s]+\?[^\s]+/g, '[URL]');
  
  // Truncate very long messages
  if (message.length > 200) {
    message = message.substring(0, 200) + '...';
  }
  
  return message;
}
