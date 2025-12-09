/* scripts.js
   Enkel, felles JavaScript-logikk for alle sidene.
   Her er bare demo-funksjonalitet (ingen ekte backend).
*/

/**
 * Gjør en gruppe knapper til "status-knapper" der kun én kan være aktiv.
 * Bruk:
 *  - legg data-status-group på knappene (samme verdi for gruppen)
 *  - legg data-status-value for selve statusen
 */
function initStatusButtons() {
  const buttons = document.querySelectorAll("[data-status-group]");
  if (!buttons.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const group = btn.getAttribute("data-status-group");
      const value = btn.getAttribute("data-status-value");

      // Fjern aktiv klasse fra alle i samme gruppe
      buttons.forEach((b) => {
        if (b.getAttribute("data-status-group") === group) {
          b.classList.remove("status-active");
        }
      });

      // Sett aktiv på den vi klikket
      btn.classList.add("status-active");

      // Forberedt for backend: her kunne vi sendt value til API
      console.log("Status valgt:", group, value);

      // Hvis knappen skal lede til bekreftelsesside:
      if (btn.dataset.navigateTo) {
        window.location.href = btn.dataset.navigateTo;
      }
    });
  });
}

/**
 * Init enkel "lagre"-knapp for notater (viser bare en alert nå).
 */
function initSaveNotes() {
  const saveBtn = document.getElementById("save-notes-btn");
  const notesField = document.getElementById("notes-field");

  if (!saveBtn || !notesField) return;

  saveBtn.addEventListener("click", () => {
    const text = notesField.value.trim();
    if (!text) {
      alert("Skriv inn et notat før du lagrer (demo).");
      return;
    }
    alert("Notat lagret (demo – ikke lagret i database ennå).");
    // Her kan dere senere sende notatet til Python-backend
  });
}

/**
 * Init knapp for å sende melding fra forelder til barnehage.
 */
function initParentMessage() {
  const sendBtn = document.getElementById("send-parent-msg");
  const msgField = document.getElementById("parent-msg-field");

  if (!sendBtn || !msgField) return;

  sendBtn.addEventListener("click", () => {
    const text = msgField.value.trim();
    if (!text) {
      alert("Skriv inn en melding før du sender (demo).");
      return;
    }
    alert("Melding sendt til barnehagen (demo).");
    msgField.value = "";
  });
}

/**
 * Kall init-funksjoner når DOM er lastet.
 */
document.addEventListener("DOMContentLoaded", () => {
  initStatusButtons();
  initSaveNotes();
  initParentMessage();
});
