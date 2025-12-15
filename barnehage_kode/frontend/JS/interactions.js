// interactions.js
// Håndtering av meldinger og notater som brukeren kan sende inn.

import { apiPost } from "./api.js";

// Lar forelder sende en melding til barnehagen via API.
export function initParentMessage() {
  const sendBtn = document.getElementById("send-parent-msg");
  const msgField = document.getElementById("parent-msg-field");
  if (!sendBtn || !msgField) return;

  sendBtn.addEventListener("click", async () => {
    const text = msgField.value.trim();
    if (!text) {
      alert("Skriv inn en melding først.");
      return;
    }
    const childId = localStorage.getItem("selectedChildId");
    const parentId = localStorage.getItem("currentParentId");
    const userId = localStorage.getItem("currentUserId");
    if (!childId || !parentId || !userId) {
      alert("Mangler forelder/barn/bruker-id. Logg inn og prøv igjen.");
      return;
    }
    try {
      await apiPost(
        "/api/comment",
        { child_id: childId, comment: text },
        { "X-Role": "parent", "X-Parent-Id": parentId, "X-User-Id": userId }
      );
      alert("Melding sendt.");
      msgField.value = "";
    } catch (err) {
      console.error(err);
      alert("Kunne ikke sende melding.");
    }
  });
}

// Lar ansatte lagre et notat på et barn via API.
export function initSaveNotes() {
  const saveBtn = document.getElementById("save-notes-btn");
  const notesField = document.getElementById("notes-field");
  if (!saveBtn || !notesField) return;

  saveBtn.addEventListener("click", async () => {
    const text = notesField.value.trim();
    if (!text) {
      alert("Skriv inn et notat først.");
      return;
    }
    const childId = localStorage.getItem("selectedChildId");
    const depId = localStorage.getItem("selectedDepartmentId");
    const userId = localStorage.getItem("currentUserId");
    if (!childId || !depId || !userId) {
      alert("Mangler nødvendig ID. Velg avdeling/barn og logg inn.");
      return;
    }
    try {
      await apiPost(
        "/api/comment",
        { child_id: childId, comment: text },
        { "X-Role": "staff", "X-Department": depId, "X-User-Id": userId }
      );
      alert("Notat lagret.");
      notesField.value = "";
    } catch (err) {
      console.error(err);
      alert("Kunne ikke lagre notat.");
    }
  });
}
