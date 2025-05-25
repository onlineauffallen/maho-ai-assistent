export function handleApiError(error: any): string {
  const status = error?.status || error?.response?.status;

  // Optional: Logging
  logError(error);

  switch (status) {
    case 429:
      return "Aktuell sind zu viele Anfragen offen. Bitte versuche es später erneut.";
    case 401:
      return "Du bist nicht eingeloggt oder deine Sitzung ist abgelaufen.";
    case 403:
      return "Du hast leider keine Berechtigung für diese Aktion.";
    case 404:
      return "Der gewünschte Dienst ist aktuell nicht erreichbar.";
    case 500:
      return "Ein interner Fehler ist aufgetreten. Wir kümmern uns darum.";
    default:
      return "Etwas ist schiefgelaufen. Bitte versuche es später erneut.";
  }
}

// Optionale Logging-Funktion
function logError(error: any) {
  const payload = {
    timestamp: new Date().toISOString(),
    message: error?.message || "Kein Fehlertext",
    status: error?.status || error?.response?.status || null,
    stack: error?.stack || null,
  };

  // Aktuell nur Konsole. Später z. B. Sentry, LogRocket etc.
  console.error("📦 API Error Log:", payload);

  // TODO: Fehlertracking-Anbieter hier einbinden
}
