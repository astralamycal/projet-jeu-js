import { Screen } from "./Screen.js";
import { Map } from "../entities/Map.js";
import { BallonManager } from "../managers/BallonManager.js";
import { PlacementTileManager } from "../managers/PlacementTileManager.js";
import { TowerManager } from "../managers/TowerManager.js";
import { CookieButton } from "../ui/CookieButton.js"; // 1. Import du nouveau composant

export class GameScreen extends Screen {
  #map;
  #ballonManager;
  #placementTileManager;
  #TowerManager;
  #cookieButton; // 2. Propriété pour stocker le bouton

  #rawMouse = { x: 0, y: 0 };
  #score = 0;
  #money = 100;

  constructor(canvas, ctx) {
    super(canvas, ctx);

    this.#map = new Map("./public/assets/map1.png");
    this.#ballonManager = new BallonManager("map1");

    this.#placementTileManager = new PlacementTileManager(
      canvas,
      this.#rawMouse,
    );

    // Initialisation du TowerManager
    this.#TowerManager = new TowerManager(this.#ballonManager);

    // 3. Initialisation du CookieButton (x, y, largeur, hauteur)
    this.#cookieButton = new CookieButton(10, 250, 60, 60);

    this.#initEventListeners();
    this.#initClicker();
  }

  #initClicker() {
    this.canvas.addEventListener("click", (e) => {
      const mouse = this.getVirtualMousePos();

      // 4. Utilisation du bouton pour la détection de clic
      if (this.#isInside(mouse, this.#cookieButton)) {
        if (this.#ballonManager.isRoundActive) {
          this.#generateResource();
        }
        return;
      }

      this.#handleTowerPurchase(mouse);
    });
  }

  // 5. Mise à jour de #isInside pour utiliser .width et .height (standards GameObject)
  #isInside(pos, obj) {
    return (
      pos.x >= obj.x &&
      pos.x <= obj.x + obj.width &&
      pos.y >= obj.y &&
      pos.y <= obj.y + obj.height
    );
  }

  #generateResource() {
    this.#money += 10;
    console.log("Argent généré : ", this.#money);
  }

  #initEventListeners() {
    this.canvas.addEventListener("mousemove", (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.#rawMouse.x = e.clientX - rect.left;
      this.#rawMouse.y = e.clientY - rect.top;
    });

    window.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        this.#ballonManager.startNextRound();
      }
    });
  }

  #handleTowerPurchase(mouse) {
    const TOWER_COST = 50;
    const targetTile = this.#placementTileManager.getTileAt(mouse);

    if (
      targetTile &&
      targetTile.isEmpty !== false &&
      this.#money >= TOWER_COST
    ) {
      this.#money -= TOWER_COST;
      targetTile.isEmpty = false;
      this.#TowerManager.addTower(targetTile.x, targetTile.y);
    }
  }

  getVirtualMousePos() {
    const { width, height } = this.canvas;
    const scale = Math.min(width / Map.WIDTH, height / Map.HEIGHT);
    const offsetX = (width - Map.WIDTH * scale) / 2;
    const offsetY = (height - Map.HEIGHT * scale) / 2;

    return {
      x: (this.#rawMouse.x - offsetX) / scale,
      y: (this.#rawMouse.y - offsetY) / scale,
    };
  }

  update(dt) {
    const virtualMouse = this.getVirtualMousePos();

    if (this.#placementTileManager)
      this.#placementTileManager.update(virtualMouse);
    if (this.#ballonManager) this.#ballonManager.update(dt);
    if (this.#TowerManager) {
      const enemies = this.#ballonManager.enemies;
      this.#TowerManager.update(dt, enemies);
    }
  }

  draw() {
    const { width, height } = this.canvas;
    const ctx = this.ctx;

    ctx.clearRect(0, 0, width, height);

    const scale = Math.min(width / Map.WIDTH, height / Map.HEIGHT);
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.scale(scale, scale);
    ctx.translate(-Map.WIDTH / 2, -Map.HEIGHT / 2);

    this.#map.draw(ctx);
    if (this.#placementTileManager) this.#placementTileManager.draw(ctx);
    if (this.#TowerManager) this.#TowerManager.draw(ctx);
    if (this.#ballonManager) this.#ballonManager.draw(ctx);

    // 6. On appelle le draw du CookieButton
    this.#drawClickerButton(ctx);

    ctx.restore();

    this.#drawUI();
    this.#drawHUD();
  }

  #drawClickerButton(ctx) {
    // Le bouton gère son propre style interne !
    const isActive = this.#ballonManager.isRoundActive;
    this.#cookieButton.draw(ctx, isActive);
  }

  #drawUI() {
    this.ctx.fillStyle = "white";
    this.ctx.font = "bold 16px Arial";
    const roundTxt = `Round: ${this.#ballonManager.currentRoundNumber}`;
    this.ctx.fillText(roundTxt, 20, 30);

    if (this.#ballonManager.canStartNext) {
      this.ctx.fillStyle = "#FFD700";
      this.ctx.fillText("Prêt ! Appuyez sur ESPACE", 20, 55);
    }
  }

  #drawHUD() {
    this.ctx.fillStyle = this.#money >= 50 ? "gold" : "#c0392b";
    this.ctx.font = "bold 20px Arial";
    this.ctx.fillText(`$ ${this.#money}`, 20, 90);
  }
}
