/* scripts.js
   Enkel, felles JavaScript-logikk for alle sidene.
   Her er bare demo-funksjonalitet (ingen ekte backend).
*/

// Nøkkelnavn som brukes i LocalStorage for å lagre språkvalget
const LANGUAGE_STORAGE_KEY = "appLanguage";


// Translations inneholder alle tekstene i appen på norsk og engelsk.
const translations = {
  no: {
    "landing.title": "Barnehage Kryssliste – Hvem er du?",
    "landing.heading": "Barnehage Kryssliste",
    "landing.subheading": "Hvem er du?",
    "landing.staffTitle": "Ansatt",
    "landing.staffSubtitle": "Se alle avdelinger og barn",
    "landing.parentTitle": "Forelder",
    "landing.parentSubtitle": "Se ditt barn",

    "parentLogin.title": "Innlogging for forelder",
    "parentLogin.heading": "Innlogging for forelder",
    "parentLogin.subheading": "Logg inn for å fortsette",
    "parentLogin.emailLabel": "E-post",
    "parentLogin.emailPlaceholder": "din@barnehage.no",
    "parentLogin.passwordLabel": "Passord",
    "parentLogin.passwordPlaceholder": "********",
    "parentLogin.submit": "Logg inn",

    "staffLogin.title": "Innlogging for ansatt",
    "staffLogin.heading": "Innlogging for ansatt",
    "staffLogin.subheading": "Logg inn for å fortsette",
    "staffLogin.emailLabel": "E-post",
    "staffLogin.emailPlaceholder": "din@barnehage.no",
    "staffLogin.passwordLabel": "Passord",
    "staffLogin.passwordPlaceholder": "********",
    "staffLogin.submit": "Logg inn",

    "parentDashboard.title": "Mitt barn",
    "parentDashboard.subtitle": "Registrer inn- og utkryssing",
    "parentDashboard.status.notArrived": "Ikke kommet",
    "parentDashboard.checkIn": "Kryss inn",
    "parentDashboard.messageTitle": "Send beskjed til barnehagen",
    "parentDashboard.messagePlaceholder":
      "F.eks. 'Emma har vondt i halsen i dag'...",
    "parentDashboard.sendMessage": "Send melding",
    "parentDashboard.nav.child": "Mitt barn",

    "statusConfirm.pageTitle": "Status registrert",
    "statusConfirm.heading": "Status registrert",
    "statusConfirm.registeredTitle": "Registrert!",
    "statusConfirm.text": "Statusen er oppdatert",
    "statusConfirm.parentBack": "Tilbake",
    "statusConfirm.staffBack": "Tilbake til liste",

    "staffDepartments.title": "Avdelinger",
    "staffDepartments.subtitle": "Velg en avdeling",
    "staffDepartments.blueberryStatus": "2 av 5 tilstede",
    "staffDepartments.strawberryStatus": "2 av 3 tilstede",
    "staffDepartments.sunStatus": "2 av 4 tilstede",

    "staffChildren.pageTitle": "Blåbær – barn",
    "staffChildren.back": "Tilbake",
    "staffChildren.backLabel": "Tilbake til avdelinger",
    "staffChildren.title": "Blåbær",
    "staffChildren.subtitle": "2 av 5 tilstede",
    "staffChildren.childStatus.checkedOut": "Hentet",
    "staffChildren.childStatus.notArrived": "Ikke kommet",
    "staffChildren.childStatus.present": "Tilstede",
    "staffChildren.childTime.emma": "Levert: 08:15 • Hentet: 15:13",
    "staffChildren.childTime.noah": "Levert: –",
    "staffChildren.childTime.olivia": "Levert: 07:45",
    "staffChildren.details": "Detaljer →",

    "staffChildDetails.pageTitle": "Detaljer – Emma Hansen",
    "staffChildDetails.back": "Tilbake",
    "staffChildDetails.backLabel": "Tilbake til barneliste",
    "staffChildDetails.title": "Detaljer",
    "staffChildDetails.subtitle": "Blåbær • 2 av 5 tilstede",
    "staffChildDetails.childName": "Emma Hansen",
    "staffChildDetails.childInfoHeading": "Barneinformasjon",
    "staffChildDetails.birthdate": "🎂 Fødselsdato",
    "staffChildDetails.allergies": "⚠️ Allergier",
    "staffChildDetails.delivered": "⏰ Levert",
    "staffChildDetails.pickedUp": "🏁 Hentet",
    "staffChildDetails.contactHeading": "Kontaktinformasjon",
    "staffChildDetails.parent1": "Forelder 1: Anne Hansen",
    "staffChildDetails.parent2": "Forelder 2: Per Hansen",
    "staffChildDetails.statusHeading": "Status",
    "staffChildDetails.status.present": "Tilstede",
    "staffChildDetails.status.later": "Kommer senere",
    "staffChildDetails.status.pickedUp": "Hentet",
    "staffChildDetails.notesHeading": "Notater fra personalet",
    "staffChildDetails.save": "Lagre",
    "staffChildDetails.notesPlaceholder": "Legg til notater her...",
    "staffChildDetails.departmentNav": "Avdelinger",

    "common.logout": "Logg ut",
    "common.settings": "Innstillinger",
    "common.back": "Tilbake",
    "common.settingsTitle": "Innstillinger",
    "common.languageLabel": "Språk",

    "settings.intro": "Velg språk for appen.",
    "settings.norwegian": "Norsk",
    "settings.english": "English",
    "settings.back": "Tilbake til forrige side",

    "alerts.notesEmpty": "Skriv inn et notat før du lagrer (demo).",
    "alerts.notesSaved": "Notat lagret (demo – ikke lagret i database ennå).",
    "alerts.messageEmpty": "Skriv inn en melding før du sender (demo).",
    "alerts.messageSent": "Melding sendt til barnehagen (demo).",

    "language.name.no": "Norsk",
    "language.name.en": "English",
  },
  en: {
    "landing.title": "Daycare Check-in – Who are you?",
    "landing.heading": "Daycare Check-in",
    "landing.subheading": "Who are you?",
    "landing.staffTitle": "Staff",
    "landing.staffSubtitle": "See all departments and children",
    "landing.parentTitle": "Parent",
    "landing.parentSubtitle": "See your child",

    "parentLogin.title": "Parent login",
    "parentLogin.heading": "Parent login",
    "parentLogin.subheading": "Sign in to continue",
    "parentLogin.emailLabel": "Email",
    "parentLogin.emailPlaceholder": "you@daycare.no",
    "parentLogin.passwordLabel": "Password",
    "parentLogin.passwordPlaceholder": "********",
    "parentLogin.submit": "Log in",

    "staffLogin.title": "Staff login",
    "staffLogin.heading": "Staff login",
    "staffLogin.subheading": "Sign in to continue",
    "staffLogin.emailLabel": "Email",
    "staffLogin.emailPlaceholder": "you@daycare.no",
    "staffLogin.passwordLabel": "Password",
    "staffLogin.passwordPlaceholder": "********",
    "staffLogin.submit": "Log in",

    "parentDashboard.title": "My child",
    "parentDashboard.subtitle": "Register check-in and check-out",
    "parentDashboard.status.notArrived": "Not arrived",
    "parentDashboard.checkIn": "Check in",
    "parentDashboard.messageTitle": "Send a message to the kindergarten",
    "parentDashboard.messagePlaceholder":
      "E.g. 'Emma has a sore throat today'...",
    "parentDashboard.sendMessage": "Send message",
    "parentDashboard.nav.child": "My child",

    "statusConfirm.pageTitle": "Status recorded",
    "statusConfirm.heading": "Status recorded",
    "statusConfirm.registeredTitle": "Recorded!",
    "statusConfirm.text": "Status has been updated",
    "statusConfirm.parentBack": "Back",
    "statusConfirm.staffBack": "Back to list",

    "staffDepartments.title": "Departments",
    "staffDepartments.subtitle": "Choose a department",
    "staffDepartments.blueberryStatus": "2 of 5 present",
    "staffDepartments.strawberryStatus": "2 of 3 present",
    "staffDepartments.sunStatus": "2 of 4 present",

    "staffChildren.pageTitle": "Blueberry – children",
    "staffChildren.back": "Back",
    "staffChildren.backLabel": "Back to departments",
    "staffChildren.title": "Blueberry",
    "staffChildren.subtitle": "2 of 5 present",
    "staffChildren.childStatus.checkedOut": "Checked out",
    "staffChildren.childStatus.notArrived": "Not arrived",
    "staffChildren.childStatus.present": "Present",
    "staffChildren.childTime.emma": "Delivered: 08:15 • Picked up: 15:13",
    "staffChildren.childTime.noah": "Delivered: –",
    "staffChildren.childTime.olivia": "Delivered: 07:45",
    "staffChildren.details": "Details →",

    "staffChildDetails.pageTitle": "Details – Emma Hansen",
    "staffChildDetails.back": "Back",
    "staffChildDetails.backLabel": "Back to child list",
    "staffChildDetails.title": "Details",
    "staffChildDetails.subtitle": "Blueberry • 2 of 5 present",
    "staffChildDetails.childName": "Emma Hansen",
    "staffChildDetails.childInfoHeading": "Child information",
    "staffChildDetails.birthdate": "🎂 Birthdate",
    "staffChildDetails.allergies": "⚠️ Allergies",
    "staffChildDetails.delivered": "⏰ Delivered",
    "staffChildDetails.pickedUp": "🏁 Picked up",
    "staffChildDetails.contactHeading": "Contact information",
    "staffChildDetails.parent1": "Parent 1: Anne Hansen",
    "staffChildDetails.parent2": "Parent 2: Per Hansen",
    "staffChildDetails.statusHeading": "Status",
    "staffChildDetails.status.present": "Present",
    "staffChildDetails.status.later": "Coming later",
    "staffChildDetails.status.pickedUp": "Picked up",
    "staffChildDetails.notesHeading": "Staff notes",
    "staffChildDetails.save": "Save",
    "staffChildDetails.notesPlaceholder": "Add notes here...",
    "staffChildDetails.departmentNav": "Departments",

    "common.logout": "Log out",
    "common.settings": "Settings",
    "common.back": "Back",
    "common.settingsTitle": "Settings",
    "common.languageLabel": "Language",

    "settings.intro": "Choose the app language.",
    "settings.norwegian": "Norwegian",
    "settings.english": "English",
    "settings.back": "Back to previous page",

    "alerts.notesEmpty": "Write a note before saving (demo).",
    "alerts.notesSaved": "Note saved (demo – not stored in database yet).",
    "alerts.messageEmpty": "Type a message before sending (demo).",
    "alerts.messageSent": "Message sent to the kindergarten (demo).",

    "language.name.no": "Norsk",
    "language.name.en": "English",
  },
};

// Lagrer hvilket språk som er valgt
let currentLanguage = loadLanguageFromStorage();


// Funksjon som leser språket valgt fra localStorage, hvis det ikke finnes blir norsk brukt som standard
function loadLanguageFromStorage() {
  const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (stored && translations[stored]) {
    return stored;
  }
  return "no";
}


/* Endrer språket i appen og oppdaterer currentLanguage*/
function setLanguage(lang) {
  if (!translations[lang]) return;
  currentLanguage = lang;
  localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  applyTranslations(lang);
}

/* Hjeloefunksjon som slår opp en oversettelse basert på aktivt språk, 
om teksten ikke finnes på det språket, vil norsk bli brukt i stedet.
*/ 
function t(key) {
  const activeLang = translations[currentLanguage] ? currentLanguage : "no";
  return (
    translations[activeLang][key] ||
    translations.no[key] ||
    key
  );
}

/* Oversetter siden basert på valgt språk */
function applyTranslations(lang = currentLanguage) {

  const activeLang = translations[lang] ? lang : "no";
  document.documentElement.lang = activeLang === "no" ? "no" : "en";

  const elements = document.querySelectorAll("[data-i18n]");
  elements.forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const translation = translations[activeLang][key];
    if (!translation) return;
    const attr = el.getAttribute("data-i18n-attr");
    if (attr) {
      el.setAttribute(attr, translation);
    } else {
      el.textContent = translation;
    }
  });

  updateLanguageUI();
}


/* Oppdaterer språkknappene sånn at riktig knapp vises som valgt*/
function updateLanguageUI() {
  document
    .querySelectorAll("[data-language-option]")
    .forEach((btn) =>
      btn.classList.toggle(
        "language-active",
        btn.getAttribute("data-language-option") === currentLanguage
      )
    );


  /* Oppdaterer tekst som viser hvilket språk som er valgt */
  const activeValue = document.getElementById("language-active-value");
  if (activeValue) {
    activeValue.textContent =
      translations[currentLanguage][`language.name.${currentLanguage}`] ||
      currentLanguage;
  }

}

/* Gjør språkknappene trykkbare, og når knappen trykkes så byttes språket*/
function initLanguageControls() {
  const languageButtons = document.querySelectorAll("[data-language-option]");
  if (!languageButtons.length) return;

  languageButtons.forEach((btn) =>
    btn.addEventListener("click", () => {
      const lang = btn.getAttribute("data-language-option");
      setLanguage(lang);
    })
  );

  updateLanguageUI();
}

/*Sørger for at kun en av knappene kan være aktiv, som f.eks. til "Tilstede", "Kommer senere", "Hentet" 
*/
function initStatusButtons() {
  const buttons = document.querySelectorAll("[data-status-group]");
  if (!buttons.length) return;

  buttons.forEach((btn) => {
    btn.setAttribute(
      "aria-pressed",
      btn.classList.contains("status-active") ? "true" : "false"
    );

    btn.addEventListener("click", () => {
      const group = btn.getAttribute("data-status-group");
      const value = btn.getAttribute("data-status-value");

      // Fjern aktiv klasse fra alle i samme gruppe
      buttons.forEach((b) => {
        if (b.getAttribute("data-status-group") === group) {
          b.classList.remove("status-active");
          b.setAttribute("aria-pressed", "false");
        }
      });

      // Sett aktiv på den vi klikket
      btn.classList.add("status-active");
      btn.setAttribute("aria-pressed", "true");

      // Forberedt for backend: her kunne vi sendt value til API
      console.log("Status valgt:", group, value);

      // Hvis knappen skal lede til bekreftelsesside:
      if (btn.dataset.navigateTo) {
        window.location.href = btn.dataset.navigateTo;
      }
    });
  });
}

/* Aktiverer en lagre-knapp for notater på ansattsiden,
 denne funksjonen viser bare en alert av det som ble skrevet*/
function initSaveNotes() {
  const saveBtn = document.getElementById("save-notes-btn");
  const notesField = document.getElementById("notes-field");

  if (!saveBtn || !notesField) return;

  saveBtn.addEventListener("click", () => {
    const text = notesField.value.trim();
    if (!text) {
      alert(t("alerts.notesEmpty"));
      return;
    }
    alert(t("alerts.notesSaved"));
  });
}

/*
Aktiverer knappen for foreldremelding. Viser også en alert og tømmer feltet.
*/
function initParentMessage() {
  const sendBtn = document.getElementById("send-parent-msg");
  const msgField = document.getElementById("parent-msg-field");

  if (!sendBtn || !msgField) return;

  sendBtn.addEventListener("click", () => {
    const text = msgField.value.trim();
    if (!text) {
      alert(t("alerts.messageEmpty"));
      return;
    }
    alert(t("alerts.messageSent"));
    msgField.value = "";
  });
}

// --- Backend-tilkobling (MySQL API) ---
const API_BASE = "http://localhost:8000";

async function apiGet(path, headers = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API-feil (${res.status}): ${text}`);
  }
  return res.json();
}

function formatTime(isoString) {
  if (!isoString) return "";
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString("no-NO", { hour: "2-digit", minute: "2-digit" });
  } catch {
    return isoString;
  }
}

function initStaffDepartments() {
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

function initStaffChildren() {
  const listEl = document.getElementById("children-list");
  if (!listEl) return;

  const depId = localStorage.getItem("selectedDepartmentId") || "10";
  const depName = localStorage.getItem("selectedDepartmentName") || "Avdeling";

  const titleEl = document.getElementById("department-title");
  const subtitleEl = document.getElementById("department-subtitle");
  if (titleEl) titleEl.textContent = depName;

  listEl.innerHTML = '<div class="text-muted">Laster barn...</div>';

  apiGet("/api/barn", { "X-Role": "staff", "X-Department": depId })
    .then((children) => {
      if (!children.length) {
        listEl.innerHTML = '<div class="text-muted">Ingen barn i denne avdelingen.</div>';
        if (subtitleEl) subtitleEl.textContent = "0 tilstede";
        return;
      }

      const present = children.filter((c) => c.last_checkin && !c.last_checkout).length;
      if (subtitleEl) subtitleEl.textContent = `${present} av ${children.length} tilstede`;

      listEl.innerHTML = "";
      children.forEach((child) => {
        const card = document.createElement("article");
        card.className = "child-card";

        const initials = child.name ? child.name.charAt(0).toUpperCase() : "?";
        const presentFlag = child.last_checkin && !child.last_checkout;
        const statusBadge = presentFlag
          ? `<div class="badge"><span class="badge-dot"></span><span>Tilstede</span></div>`
          : `<div class="child-status-pill">Ikke kommet</div>`;

        const timeText = child.last_checkin ? `🕒 Levert: ${formatTime(child.last_checkin)}` : "🕒 Levert: –";

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
            ⭕ Detaljer
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

function initChildDetails() {
  const detailName = document.getElementById("detail-name");
  if (!detailName) return;

  const params = new URLSearchParams(window.location.search);
  const childId = params.get("child") || localStorage.getItem("selectedChildId") || "300";
  const depId = params.get("dep") || localStorage.getItem("selectedDepartmentId") || "10";

  apiGet(`/api/child/${childId}`, { "X-Role": "staff", "X-Department": depId })
    .then((child) => {
      detailName.textContent = child.name || "Ukjent barn";

      const presentFlag = child.last_checkin && !child.last_checkout;
      const statusEl = document.getElementById("detail-status");
      if (statusEl) statusEl.textContent = presentFlag ? "Tilstede" : "Ikke kommet/ut";

      const timeEl = document.getElementById("detail-time");
      if (timeEl) timeEl.textContent = child.last_checkin ? formatTime(child.last_checkin) : "–";

      const birthEl = document.getElementById("detail-birth");
      if (birthEl) birthEl.textContent = child.fodselsdato || "-";
    })
    .catch((err) => {
      console.error(err);
      detailName.textContent = "Fant ikke barn";
    });
}

/*
Når nettsiden blir lastet inn, vil alle funksjonene startes
*/
document.addEventListener("DOMContentLoaded", () => {
  applyTranslations(currentLanguage);
  initLanguageControls();
  initStatusButtons();
  initSaveNotes();
  initParentMessage();
   initStaffDepartments();
   initStaffChildren();
   initChildDetails();
});
