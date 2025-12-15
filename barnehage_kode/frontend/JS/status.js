// status.js
// Klikk-håndtering for statusknapper (checkin/checkout m.m.).

import { apiPost } from "./api.js";
import { initParentDashboard, initStaffChildren, initChildDetails } from "./dataLoaders.js";

// Setter aria-pressed riktig og sørger for at kun én knapp er aktiv per gruppe.
export function initStatusButtons() {
  const buttons = document.querySelectorAll("[data-status-group]");
  if (!buttons.length) return;

  buttons.forEach((btn) => {
    btn.setAttribute(
      "aria-pressed",
      btn.classList.contains("status-active") ? "true" : "false"
    );

    btn.addEventListener("click", async () => {
      const group = btn.getAttribute("data-status-group");
      const value = btn.getAttribute("data-status-value");

      buttons.forEach((b) => {
        if (b.getAttribute("data-status-group") === group) {
          b.classList.remove("status-active");
          b.setAttribute("aria-pressed", "false");
        }
      });

      btn.classList.add("status-active");
      btn.setAttribute("aria-pressed", "true");

      try {
        const childId = localStorage.getItem("selectedChildId");
        const depId = localStorage.getItem("selectedDepartmentId");
        const userId = localStorage.getItem("currentUserId");
        const parentId = localStorage.getItem("currentParentId");

        if (value === "present" || value === "picked-up") {
          if (!childId || !depId || !userId) {
            alert("Mangler nødvendig ID. Velg avdeling/barn og logg inn.");
            return;
          }
          const endpoint = value === "present" ? "/api/checkin" : "/api/checkout";
          await apiPost(endpoint, { child_id: childId }, { "X-Role": "staff", "X-Department": depId, "X-User-Id": userId });
          initStaffChildren();
          initChildDetails();
        } else if (value === "coming-later") {
          const statusEl = document.getElementById("detail-status");
          if (statusEl) statusEl.textContent = "Kommer senere";
        } else if (value === "kryss-inn") {
          if (!childId || !parentId || !userId) {
            alert("Mangler forelder/barn/bruker-id. Logg inn og prøv igjen.");
            return;
          }
          await apiPost("/api/checkin", { child_id: childId }, { "X-Role": "parent", "X-Parent-Id": parentId, "X-User-Id": userId });
          initParentDashboard();
        }
      } catch (err) {
        console.error(err);
        alert("Kunne ikke oppdatere status. Prøv igjen.");
      }

      if (btn.dataset.navigateTo) {
        window.location.href = btn.dataset.navigateTo;
      }
    });
  });
}
