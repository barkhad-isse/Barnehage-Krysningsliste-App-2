// dataLoaders.js
// All logikk for å hente og vise data i UI-et samlet her.

import { apiGet, formatTime } from "./api.js";

// Henter barn for innlogget forelder og viser navn/status på dashbordet.
export function initParentDashboard() {
  const nameEl = document.querySelector(".parent-child-name");
  const statusText = document.querySelector(".parent-status-pill span:last-child");
  const statusDot = document.querySelector(".parent-status-pill .status-dot");
  const parentId = localStorage.getItem("currentParentId");
  if (!nameEl || !statusText || !parentId) return;

  apiGet("/api/barn", { "X-Role": "parent", "X-Parent-Id": parentId })
    .then((children) => {
      if (!children.length) {
        nameEl.textContent = "Ingen barn";
        statusText.textContent = "-";
        if (statusDot) statusDot.classList.remove("status-dot-green");
        return;
      }
      const child = children[0];
      nameEl.textContent = child.name || "Ukjent barn";
      localStorage.setItem("selectedChildId", child.id);
      if (child.avdeling_id) localStorage.setItem("selectedDepartmentId", child.avdeling_id);

      if (child.status === "checked_in") {
        statusText.textContent = "Tilstede";
        if (statusDot) statusDot.classList.add("status-dot-green");
      } else if (child.status === "checked_out") {
        statusText.textContent = "Hentet";
        if (statusDot) statusDot.classList.remove("status-dot-green");
      } else {
        statusText.textContent = "Ikke kommet";
        if (statusDot) statusDot.classList.remove("status-dot-green");
      }
    })
    .catch((err) => {
      console.error(err);
      nameEl.textContent = "Feil ved henting";
      statusText.textContent = "-";
      if (statusDot) statusDot.classList.remove("status-dot-green");
    });
}

// Henter alle avdelinger for admin/ansatt og bygger kortlisten.
export function initStaffDepartments() {
  const listEl = document.getElementById("departments-list");
  if (!listEl) return;

  listEl.innerHTML = '<div class="text-muted">Laster avdelinger...</div>';
  const colorMap = { 10: "dep-blue", 11: "dep-red", 12: "dep-yellow" };

  apiGet("/api/departments", { "X-Role": "admin" })
    .then((departments) => {
      if (!departments.length) {
        listEl.innerHTML = '<div class="text-muted">Ingen avdelinger funnet.</div>';
        return;
      }
      listEl.innerHTML = "";
      departments.forEach((dep) => {
        const card = document.createElement("a");
        card.href = "staff_children.html";
        card.className = "list-card";
        card.dataset.departmentId = dep.id;
        card.dataset.departmentName = dep.name;

        const presentText = dep.child_count === 1 ? "1 barn" : `${dep.child_count} barn`;
        const colorClass = colorMap[dep.id] || "dep-blue";

        card.innerHTML = `
          <div class="list-left">
            <div class="list-icon ${colorClass}" aria-hidden="true">🏡</div>
            <div>
              <div class="list-text-title">${dep.name}</div>
              <div class="list-text-sub">${presentText}</div>
            </div>
          </div>
          <div class="list-arrow" aria-hidden="true">→</div>
        `;

        card.addEventListener("click", () => {
          localStorage.setItem("selectedDepartmentId", dep.id);
          localStorage.setItem("selectedDepartmentName", dep.name);
        });

        listEl.appendChild(card);
      });
    })
    .catch((err) => {
      console.error(err);
      listEl.innerHTML = '<div class="text-muted">Kunne ikke laste avdelinger.</div>';
    });
}

// Henter barn i valgt avdeling og viser liste med status og tider.
export function initStaffChildren() {
  const listEl = document.getElementById("children-list");
  if (!listEl) return;

  const depId = localStorage.getItem("selectedDepartmentId");
  const depName = localStorage.getItem("selectedDepartmentName") || "Avdeling";
  const titleEl = document.getElementById("department-title");
  const subtitleEl = document.getElementById("department-subtitle");
  if (titleEl) titleEl.textContent = depName;

  if (!depId) {
    listEl.innerHTML = '<div class="text-muted">Velg en avdeling først.</div>';
    if (subtitleEl) subtitleEl.textContent = "";
    return;
  }

  listEl.innerHTML = '<div class="text-muted">Laster barn...</div>';

  apiGet("/api/barn", { "X-Role": "staff", "X-Department": depId })
    .then((children) => {
      if (!children.length) {
        listEl.innerHTML = '<div class="text-muted">Ingen barn i denne avdelingen.</div>';
        if (subtitleEl) subtitleEl.textContent = "0 tilstede";
        return;
      }

      const present = children.filter((c) => c.status === "checked_in").length;
      if (subtitleEl) subtitleEl.textContent = `${present} av ${children.length} tilstede`;

      listEl.innerHTML = "";
      children.forEach((child) => {
        const card = document.createElement("article");
        card.className = "child-card";

        const initials = child.name ? child.name.charAt(0).toUpperCase() : "?";
        let statusBadge;
        if (child.status === "checked_in") {
          statusBadge = `<div class="badge"><span class="badge-dot"></span><span>Tilstede</span></div>`;
        } else if (child.status === "checked_out") {
          statusBadge = `<div class="child-status-pill">Hentet</div>`;
        } else {
          statusBadge = `<div class="child-status-pill">Ikke kommet</div>`;
        }

        const timeText = `Levert: ${formatTime(child.last_checkin)}`;

        card.innerHTML = `
          <div class="child-header">
            <div class="child-avatar avatar-blue">${initials}</div>
            <div>
              <div class="child-name">${child.name}</div>
              ${statusBadge}
              <div class="child-time">${timeText}</div>
            </div>
          </div>
          <button class="btn btn-info btn-block detail-btn">
            Detaljer
          </button>
        `;

        const btn = card.querySelector(".detail-btn");
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          localStorage.setItem("selectedChildId", child.id);
          localStorage.setItem("selectedDepartmentId", depId);
          window.location.href = `staff_child_details.html?child=${child.id}&dep=${depId}`;
        });

        listEl.appendChild(card);
      });
    })
    .catch((err) => {
      console.error(err);
      listEl.innerHTML = '<div class="text-muted">Kunne ikke laste barn.</div>';
      if (subtitleEl) subtitleEl.textContent = "Feil ved henting";
    });
}

// Henter detaljer for valgt barn og fyller feltene på detaljsiden.
export function initChildDetails() {
  const detailName = document.getElementById("detail-name");
  if (!detailName) return;

  const params = new URLSearchParams(window.location.search);
  const childId = params.get("child") || localStorage.getItem("selectedChildId");
  const depId = params.get("dep") || localStorage.getItem("selectedDepartmentId");
  const subtitle = document.getElementById("detail-subtitle");

  if (!childId || !depId) {
    detailName.textContent = "Fant ikke barn";
    if (subtitle) subtitle.textContent = "";
    return;
  }

  apiGet(`/api/child/${childId}`, { "X-Role": "staff", "X-Department": depId })
    .then((child) => {
      detailName.textContent = child.name || "Ukjent barn";
      if (subtitle) subtitle.textContent = child.avdeling_navn || "";

      const statusEl = document.getElementById("detail-status");
      if (statusEl) {
        if (child.status === "checked_in") statusEl.textContent = "Tilstede";
        else if (child.status === "checked_out") statusEl.textContent = "Hentet";
        else statusEl.textContent = "Ikke kommet";
      }

      const timeEl = document.getElementById("detail-time");
      if (timeEl) timeEl.textContent = formatTime(child.last_checkin);

      const birthEl = document.getElementById("detail-birth");
      if (birthEl) birthEl.textContent = child.fodselsdato || "-";

      const allergyEl = document.getElementById("detail-allergies");
      if (allergyEl) allergyEl.textContent = child.allergier || "-";

      const guardians = child.guardians || [];
      const cards = document.querySelectorAll(".parent-card");
      cards.forEach((card, idx) => {
        const g = guardians[idx];
        const titleEl = card.querySelector(".parent-title");
        const phoneEl = card.querySelector(".parent-phone");
        const emailEl = card.querySelector(".parent-email");
        if (!g) {
          if (titleEl) titleEl.textContent = `Forelder ${idx + 1}`;
          if (phoneEl) phoneEl.textContent = "";
          if (emailEl) emailEl.textContent = "";
          return;
        }
        const relasjon = g.relasjon || "Forelder";
        if (titleEl) titleEl.textContent = `${relasjon}: ${g.name}`;
        if (phoneEl) phoneEl.textContent = g.telefon ? `Telefon: ${g.telefon}` : "";
        if (emailEl) emailEl.textContent = g.email ? `E-post: ${g.email}` : "";
      });
    })
    .catch((err) => {
      console.error(err);
      detailName.textContent = "Fant ikke barn";
      if (subtitle) subtitle.textContent = "";
    });
}
