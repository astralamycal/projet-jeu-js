import { Engine } from "./Engine.js";
import { StartingScreen } from "../ui/StartingScreen.js";
import { GameScreen } from "../ui/GameScreen.js";

/**
 * Classe principale orchestrant le cycle de vie du jeu.
 * Gère la transition entre les écrans et la réactivité du canvas.
 */
export class Game {
  #canvas;
  #ctx;
  #engine;
  #currentScreen;

  constructor(canvasId) {
    try {
      // get contexte graphique
      this.#canvas = document.getElementById(canvasId);
      if (!this.#canvas) {
        throw new Error(`Élément canvas avec l'id '${canvasId}' introuvable.`);
      }
      this.#ctx = this.#canvas.getContext("2d");

      // Lancement de la configuration initiale
      this.#init();
    } catch (error) {
      // Gestion des erreurs critiques au démarrage
      console.error("[Game Init Error]:", error.message);
    }
  }

  /**
   * Configure les écrans, les événements et le moteur.
   */
  #init() {
    // list of images for main menu
    const menuImages = [
      "./public/assets/main-menu/Summer2.png",
      "./public/assets/main-menu/Summer3.png",
      "./public/assets/main-menu/Summer4.png",
      "./public/assets/main-menu/Summer5.png",
      "./public/assets/main-menu/Summer6.png",
      "./public/assets/main-menu/Summer7.png",
      "./public/assets/main-menu/Summer8.png",
    ];

    // 1. Création du premier écran (Menu d'accueil)
    this.#currentScreen = new StartingScreen(
      this.#canvas,
      this.#ctx,
      menuImages,
    );

    // 2. Configuration du moteur (Engine)
    // On délègue l'update et le draw à l'écran actif
    this.#engine = new Engine(
      (dt) => this.#currentScreen.update(dt),
      () => this.#currentScreen.draw(),
    );

    // 3. Gestion du Responsive Design
    window.addEventListener("resize", () => this.#handleResize());
    this.#handleResize(); // Appel initial pour ajuster la taille

    // 4. Écoute de l'événement personnalisé pour changer d'écran
    document.addEventListener("start-game", () => this.#switchToGame());

    // 5. Lancement de la boucle de jeu via l'Engine
    this.#engine.start();
  }

  #handleResize() {
    this.#canvas.width = window.innerWidth;
    this.#canvas.height = window.innerHeight;

    // On force un rendu immédiat pour éviter un écran noir durant le resize
    if (this.#currentScreen) {
      this.#currentScreen.draw();
    }
  }

  #switchToGame() {
    try {
      console.log("Changement d'écran : Vers la partie...");

      // Nettoyage des éléments DOM de l'écran précédent (Menu)
      if (
        this.#currentScreen &&
        typeof this.#currentScreen.onDestroy === "function"
      ) {
        this.#currentScreen.onDestroy();
      }

      // Instanciation du nouvel écran (Multi-écrans)
      this.#currentScreen = new GameScreen(this.#canvas, this.#ctx);

      // L'Engine continue de tourner et appellera automatiquement
      // les méthodes du nouvel objet GameScreen.
    } catch (error) {
      console.error("[Transition Error]:", error.message);
    }
  }
}
