import { Screen } from "./Screen.js";
import { Map } from "../entities/Map.js";
import { BallonManager } from "../managers/BallonManager.js";
import { PlacementTileManager } from "../managers/PlacementTileManager.js";
import { TowerManager } from "../managers/TowerManager.js";
import { CookieButton } from "../ui/CookieButton.js";

export class GameScreen extends Screen {
  #map;
  #ballonManager;
  #placementTileManager;
  #TowerManager;
  #cookieButton;

  #rawMouse = { x: 0, y: 0 };
  #score = 0;
  #money = 100;
  #highScore = 0;
  #isGameOver = false;

  // Configuration du bouton Retry (en coordonnées réelles canvas)
  #retryBtnArea = { x: 0, y: 0, w: 200, h: 50 };

  constructor(canvas, ctx) {
    super(canvas, ctx);
    this.#initGame(); // On utilise une méthode d'initialisation
    this.#loadHighScore();
    this.#initEventListeners();
    this.#initClicker();
  }

  // Initialise ou réinitialise les composants du jeu
  #initGame() {
    this.#score = 0;
    this.#money = 100;
    this.#isGameOver = false;

    this.#map = new Map("./public/assets/map1.png");
    this.#ballonManager = new BallonManager("map1");
    this.#placementTileManager = new PlacementTileManager(
      this.canvas,
      this.#rawMouse,
    );
    this.#TowerManager = new TowerManager(this.#ballonManager);
    this.#cookieButton = new CookieButton(10, 250, 60, 60);

    // Centrer le bouton Retry sur le canvas
    this.#retryBtnArea.x = this.canvas.width / 2 - this.#retryBtnArea.w / 2;
    this.#retryBtnArea.y = this.canvas.height / 2 + 80;
  }

  #loadHighScore() {
    const saved = localStorage.getItem("towerDefense_highScore");
    this.#highScore = saved ? parseInt(saved) : 0;
  }

  #saveHighScore() {
    if (this.#score > this.#highScore) {
      this.#highScore = Math.floor(this.#score);
      localStorage.setItem("towerDefense_highScore", this.#highScore);
    }
  }

  #initClicker() {
    this.canvas.addEventListener("click", (e) => {
      // 1. GESTION DU CLIC EN GAME OVER (Bouton Retry)
      if (this.#isGameOver) {
        if (this.#isInside(this.#rawMouse, this.#retryBtnArea)) {
          this.#initGame(); // On relance !
        }
        return;
      }

      const mouse = this.getVirtualMousePos();

      // 2. GESTION DU CLIC EN JEU
      if (this.#isInside(mouse, this.#cookieButton)) {
        if (this.#ballonManager.isRoundActive) this.#generateResource();
        return;
      }
      this.#handleTowerPurchase(mouse);
    });
  }

  #isInside(pos, obj) {
    // On récupère la largeur (soit .w, soit .width)
    const w = obj.w ?? obj.width;
    // On récupère la hauteur (soit .h, soit .height)
    const h = obj.h ?? obj.height;

    return (
      pos.x >= obj.x &&
      pos.x <= obj.x + w &&
      pos.y >= obj.y &&
      pos.y <= obj.y + h
    );
  }

  #generateResource() {
    this.#money += 10;
  }

  #initEventListeners() {
    this.canvas.addEventListener("mousemove", (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.#rawMouse.x = e.clientX - rect.left;
      this.#rawMouse.y = e.clientY - rect.top;
    });
    window.addEventListener("keydown", (e) => {
      if (this.#isGameOver) return;
      if (e.code === "Space") this.#ballonManager.startNextRound();
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
    if (this.#isGameOver) return;

    if (this.#ballonManager.isRoundActive) {
      this.#score += dt * 10;
    }

    if (this.#placementTileManager)
      this.#placementTileManager.update(this.getVirtualMousePos());

    if (this.#ballonManager) {
      const escaped = this.#ballonManager.update(dt);
      if (escaped > 0) {
        this.#isGameOver = true;
        this.#saveHighScore();
      }
    }

    if (this.#TowerManager) {
      this.#TowerManager.update(dt, this.#ballonManager.enemies);
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
    this.#cookieButton.draw(ctx, this.#ballonManager.isRoundActive);

    ctx.restore();
    this.#drawHUD();
  }

  #drawHUD() {
    const ctx = this.ctx;
    ctx.fillStyle = "white";
    ctx.font = "bold 16px Arial";
    ctx.fillText(`Round: ${this.#ballonManager.currentRoundNumber}`, 20, 30);

    ctx.fillStyle = "gold";
    ctx.font = "bold 20px Arial";
    ctx.fillText(`$ ${this.#money}`, 20, 90);

    ctx.fillStyle = "white";
    ctx.fillText(`SCORE: ${Math.floor(this.#score)}`, 20, 120);
    ctx.font = "14px Arial";
    ctx.fillText(`BEST: ${this.#highScore}`, 20, 140);

    if (this.#isGameOver) {
      this.#drawGameOverScreen();
    }
  }

  #drawGameOverScreen() {
    const ctx = this.ctx;
    const { width, height } = this.canvas;

    // Overlay sombre
    ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
    ctx.fillRect(0, 0, width, height);

    ctx.textAlign = "center";

    // Texte Game Over
    ctx.fillStyle = "#e74c3c";
    ctx.font = "bold 60px Arial";
    ctx.fillText("GAME OVER", width / 2, height / 2 - 20);

    // Bouton Retry
    const btn = this.#retryBtnArea;
    const isHover = this.#isInside(this.#rawMouse, btn);

    ctx.fillStyle = isHover ? "#2ecc71" : "#27ae60"; // Changement de couleur au survol
    ctx.fillRect(btn.x, btn.y, btn.w, btn.h);

    ctx.fillStyle = "white";
    ctx.font = "bold 24px Arial";
    ctx.fillText("RETRY", btn.x + btn.w / 2, btn.y + 35);

    ctx.textAlign = "left";
  }
}
