import { Screen } from "./Screen.js";
import { Ballon } from "../entities/mobs/Ballon.js";
import { Container } from "../components/Container.js";

/**
 * Écran de jeu principal.
 * Gère l'affichage de la map et la coordination des entités (Composite).
 */
export class GameScreen extends Screen {
  #mapImage = new Image();
  #isLoaded = false;
  #entityManager = new Container(); // Le Composite qui contient tes ballons
  #mapName = "map1"; // Nom correspondant à ta clé dans mapPaths.json

  constructor(canvas, ctx) {
    super(canvas, ctx); // Héritage de Screen
    this.#init();
  }

  /**
   * Initialisation asynchrone des ressources.
   */
  async #init() {
    try {
      // Chargement de l'image de fond (Map)
      this.#mapImage.src = "./public/assets/map1.png";

      this.#mapImage.onload = () => {
        this.#isLoaded = true;
        // On fait apparaître un premier ballon une fois que tout est prêt
        this.#spawnWave();
      };

      this.#mapImage.onerror = () => {
        throw new Error("Impossible de charger l'image de la map.");
      };
    } catch (error) {
      console.error(`[GameScreen Error]: ${error.message}`);
    }
  }

  /**
   * Exemple de création d'une entité (Ballon - Niveau 3 d'héritage)
   */
  #spawnWave() {
    try {
      // Paramètres : mapName, hp, speed, color, reward
      const redBallon = new Ballon(this.#mapName, 10, 2, "red", 5);

      // On l'ajoute au container (Composite)
      this.#entityManager.add(redBallon);
    } catch (e) {
      console.error("Erreur lors du spawn du ballon :", e.message);
    }
  }
  update(dt) {
    if (!this.#isLoaded) return;

    // Le GameScreen délègue la mise à jour au Container (Composite)
    this.#entityManager.update(dt);
  }

  /**
   * Rendu graphique.
   */
  draw() {
    if (!this.#isLoaded) return;

    const { width, height } = this.canvas;

    // 1. Nettoyage du canvas
    this.ctx.clearRect(0, 0, width, height);

    // 2. Dessin de la map (Adaptation responsive)
    this.ctx.drawImage(this.#mapImage, 0, 0, width, height);

    // 3. Dessin des entités via le Composite
    this.#entityManager.draw(this.ctx);
  }
}
