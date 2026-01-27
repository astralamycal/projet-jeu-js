import { Game } from "./src/core/Game.js";

// Attendre que le DOM soit prêt pour éviter les erreurs d'accès [cite: 55]
window.addEventListener("DOMContentLoaded", () => {
  try {
    new Game("gameCanvas");
  } catch (e) {
    console.error("Échec critique du lancement :", e.message);
  }
});
