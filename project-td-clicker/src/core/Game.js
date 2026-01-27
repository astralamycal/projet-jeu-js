import { StartingScreen } from "../ui/StartingScreen.js";
import { GameScreen } from "../ui/GameScreen.js";

export class Game {
  #canvas;
  #ctx;
  #currentScreen;

  constructor(canvasId) {
    this.#canvas = document.getElementById(canvasId);
    this.#ctx = this.#canvas.getContext("2d");
    this.#init();
    this.#loop();
  }

  #init() {
    const menuImages = [
      "./public/assets/main-menu/Summer2.png",
      "./public/assets/main-menu/Summer3.png",
      "./public/assets/main-menu/Summer4.png",
      "./public/assets/main-menu/Summer5.png",
      "./public/assets/main-menu/Summer6.png",
      "./public/assets/main-menu/Summer7.png",
    ];

    // Initialisation de l'écran de départ
    this.#currentScreen = new StartingScreen(
      this.#canvas,
      this.#ctx,
      menuImages,
    );

    // Responsive : Redimensionnement automatique
    window.addEventListener("resize", () => this.#handleResize());
    this.#handleResize();

    // Événement global pour le changement d'écran
    document.addEventListener("start-game", () => this.#switchToGame());
  }

  #handleResize() {
    this.#canvas.width = window.innerWidth;
    this.#canvas.height = window.innerHeight;
  }

  #switchToGame() {
    if (this.#currentScreen.onDestroy) this.#currentScreen.onDestroy();
    this.#currentScreen = new GameScreen(this.#canvas, this.#ctx);
  }

  #loop() {
    this.#currentScreen.update();
    this.#currentScreen.draw();
    requestAnimationFrame(() => this.#loop());
  }
}
