// api.js
// Enkle API-hjelpere samlet på ett sted, slik at resten av koden kan fokusere på UI.

export const API_BASE = "http://localhost:8000";

// Gjør et GET-kall mot backend og kaster med detaljert feil hvis noe går galt.
export async function apiGet(path, headers = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...headers },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API-feil (${res.status}): ${text}`);
  }
  return res.json();
}

// Gjør et POST-kall mot backend med JSON-body og felles feilhåndtering.
export async function apiPost(path, body = {}, headers = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API-feil (${res.status}): ${text}`);
  }
  return res.json();
}

// Viser klokkeslett i HH:MM for norske brukere, eller "-" hvis feltet er tomt.
export function formatTime(isoString) {
  if (!isoString) return "-";
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString("no-NO", { hour: "2-digit", minute: "2-digit" });
  } catch {
    return isoString;
  }
}
