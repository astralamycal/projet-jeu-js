import { Game } from "./core/Game.js";
import { Entity } from "./entities/Entity.js";

// Attendre que le DOM soit prêt pour éviter les erreurs d'accès
window.addEventListener("DOMContentLoaded", () => {
  try {
    new Game("gameCanvas");
  } catch (e) {
    console.error("Échec critique du lancement :", e.message);
  }
});
