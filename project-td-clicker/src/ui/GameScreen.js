// src/ui/GameScreen.js
import { Screen } from "./Screen.js";
import { Map } from "../entities/Map.js";
import { BallonManager } from "../managers/BallonManager.js";
import { PlacementTileManager } from "../managers/PlacementTileManager.js";
import { TowerManager } from "../managers/TowerManager.js";

export class GameScreen extends Screen {
  #map;
  #ballonManager;
  #placementTileManager;
  #TowerManager;

  // On initialise la souris avec des valeurs par défaut pour éviter le "undefined"
  #rawMouse = { x: 0, y: 0 };
  #score = 0;

  constructor(canvas, ctx) {
    super(canvas, ctx);

    // 1. Initialisation du décor et des managers
    this.#map = new Map("./public/assets/map1.png");
    this.#ballonManager = new BallonManager("map1");
    this.#placementTileManager = new PlacementTileManager(
      canvas,
      this.#rawMouse,
    );
    this.#TowerManager = new TowerManager(this.#placementTileManager, canvas);

    // 2. Gestion des événements
    this.#initEventListeners();
  }

  #initEventListeners() {
    // Suivi de la souris sur le canvas
    this.canvas.addEventListener("mousemove", (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.#rawMouse.x = e.clientX - rect.left;
      this.#rawMouse.y = e.clientY - rect.top;
    });

    // Touche Espace pour lancer les rounds
    window.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        this.#ballonManager.startNextRound();
      }
    });
  }

  /**
   * Traduit les coordonnées réelles du curseur (pixels écran)
   * en coordonnées virtuelles (monde 480x320).
   */
  getVirtualMousePos() {
    const { width, height } = this.canvas;

    // On calcule le scale et l'offset (les bandes noires)
    const scale = Math.min(width / Map.WIDTH, height / Map.HEIGHT);
    const offsetX = (width - Map.WIDTH * scale) / 2;
    const offsetY = (height - Map.HEIGHT * scale) / 2;

    return {
      x: (this.#rawMouse.x - offsetX) / scale,
      y: (this.#rawMouse.y - offsetY) / scale,
    };
  }

  update(dt) {
    // 1. On récupère la position "traduite" de la souris
    const virtualMouse = this.getVirtualMousePos();

    // 2. On met à jour le manager de placement avec la souris virtuelle
    if (this.#placementTileManager) {
      this.#placementTileManager.update(virtualMouse);
    }

    // 3. On met à jour les ballons avec le delta time
    if (this.#ballonManager) {
      this.#ballonManager.update(dt);
    }

    this.#TowerManager.update();
  }

  draw() {
    const { width, height } = this.canvas;
    const ctx = this.ctx;

    // Nettoyage de l'écran
    ctx.clearRect(0, 0, width, height);

    // --- DÉBUT DE LA TRANSFORMATION RESPONSIVE ---
    const scale = Math.min(width / Map.WIDTH, height / Map.HEIGHT);

    ctx.save();
    // Centrage et mise à l'échelle
    ctx.translate(width / 2, height / 2);
    ctx.scale(scale, scale);
    ctx.translate(-Map.WIDTH / 2, -Map.HEIGHT / 2);

    // 1. Dessin de la map (fond)
    this.#map.draw(ctx);

    // 2. Dessin des cases de placement (grille blanche)
    if (this.#placementTileManager) {
      this.#placementTileManager.draw(ctx);
    }

    // 3. Dessin des ballons par-dessus
    if (this.#ballonManager) {
      this.#ballonManager.draw(ctx);
    }

    ctx.restore();
    // --- FIN DE LA TRANSFORMATION ---

    // 4. Interface utilisateur (HUD) - Toujours dessiné par-dessus en fixe
    this.#drawUI();
  }

  #drawUI() {
    this.ctx.fillStyle = "white";
    this.ctx.font = "bold 16px Arial";

    // Affichage du round
    const roundTxt = `Round: ${this.#ballonManager.currentRoundNumber}`;
    this.ctx.fillText(roundTxt, 20, 30);

    // Message si on peut lancer la vague
    if (this.#ballonManager.canStartNext) {
      this.ctx.fillStyle = "#FFD700"; // Or
      this.ctx.fillText("Prêt ! Appuyez sur ESPACE", 20, 55);
    }
  }
}
