export function formatApiFailureMessage(error: unknown, resourceLabel = 'the requested resource'): string {
  const message = error instanceof Error ? error.message : String(error ?? '');
  const match = message.match(/API\s+(\d{3})/);
  const statusCode = match ? Number(match[1]) : null;

  if (statusCode === 401) {
    return 'Authentication failed. Re-open the mini app from Telegram and try again.';
  }
  if (statusCode === 403) {
    return `Your account is not authorized to access ${resourceLabel}.`;
  }
  if (statusCode === 404) {
    return `It looks like ${resourceLabel} no longer exists or you no longer have access to it.`;
  }
  if (statusCode !== null && statusCode >= 500 && statusCode < 600) {
    return 'The API is currently unavailable. Please retry in a moment.';
  }
  return `We could not load ${resourceLabel} from the API. Please refresh and try again.`;
}
