import { Screen } from "./Screen.js";
//import { Storage } from "../utils/Storage.js";

export class GameScreen extends Screen {
  // Propriétés privées pour l'encapsulation
  #mapImage = new Image();
  #isLoaded = false;
  #entities = []; // Conteneur pour le pattern Composite
  #score = 0;

  constructor(canvas, ctx) {
    super(canvas, ctx); // Appel au constructeur de Screen
    this.#init();
  }

  /**
   * Initialisation asynchrone des assets et des données
   */
  async #init() {
    try {
      // Chargement de l'image de la map
      this.#mapImage.src = "./public/assets/map1.png";
      this.#mapImage.onload = () => {
        this.#isLoaded = true;
      };

      // Gestion d'erreur de chargement
      this.#mapImage.onerror = () => {
        throw new Error("Impossible de charger l'image de la map.");
      };

      // Récupération du score depuis le localStorage
      const savedData = Storage.load("td_save");
      if (savedData) {
        this.#score = savedData.score || 0;
      }
    } catch (error) {
      console.error(`[GameScreen Error]: ${error.message}`);
    }
  }

  /**
   * Mise à jour de la logique du jeu (Appelée par la loop de Game.js)
   */
  update() {
    if (!this.#isLoaded) return;

    // Pattern Composite : Mise à jour de toutes les entités
    this.#entities.forEach((entity) => {
      if (entity.update) {
        entity.update(this.ctx);
      }
    });

    // Exemple : on vérifie si des entités doivent être supprimées
    this.#entities = this.#entities.filter((entity) => entity.isAlive);
  }

  /**
   * Rendu graphique responsive
   */
  draw() {
    if (!this.#isLoaded) return;

    const { width, height } = this.canvas;

    // 1. Dessiner la map en s'adaptant à la taille du canvas
    this.ctx.clearRect(0, 0, width, height);
    this.ctx.drawImage(this.#mapImage, 0, 0, width, height);

    // 2. Dessiner les entités
    this.#entities.forEach((entity) => {
      if (entity.draw) {
        entity.draw(this.ctx);
      }
    });

    // 3. Dessiner l'interface (HUD)
    this.#drawHUD();
  }

  #drawHUD() {
    this.ctx.fillStyle = "white";
    this.ctx.font = "bold 20px Arial";
    this.ctx.fillText(`Score: ${this.#score}`, 20, 40);
  }

  /**
   * Sauvegarde la progression [cite: 114]
   */
  saveProgress() {
    Storage.save("td_save", { score: this.#score });
  }
}
