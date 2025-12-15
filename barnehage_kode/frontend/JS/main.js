// main.js
// Samler init-logikk og kaller riktige moduler per side.

import { initStatusButtons } from "./status.js";
import { initSaveNotes, initParentMessage } from "./interactions.js";
import {
  initParentDashboard,
  initStaffDepartments,
  initStaffChildren,
  initChildDetails,
} from "./dataLoaders.js";

document.addEventListener("DOMContentLoaded", () => {
  initStatusButtons();
  initSaveNotes();
  initParentMessage();
  initParentDashboard();
  initStaffDepartments();
  initStaffChildren();
  initChildDetails();
});
