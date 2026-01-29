import { Screen } from "./Screen.js";
import { Map } from "../entities/Map.js";
import { BallonManager } from "../managers/BallonManager.js";
import { PlacementTileManager } from "../managers/PlacementTileManager.js";
import { TowerManager } from "../managers/TowerManager.js";

export class GameScreen extends Screen {
  #map;
  #ballonManager;
  #placementTileManager;
  #TowerManager; // Note: Garde la majuscule si c'est ainsi dans tout ton code

  #rawMouse = { x: 0, y: 0 };
  #score = 0;
  #money = 100;
  #clickerZone = { x: 10, y: 250, w: 60, h: 60 };

  constructor(canvas, ctx) {
    super(canvas, ctx);

    this.#map = new Map("./public/assets/map1.png");
    this.#ballonManager = new BallonManager("map1");

    // On passe rawMouse pour le survol (hover)
    this.#placementTileManager = new PlacementTileManager(
      canvas,
      this.#rawMouse,
    );

    // Initialisation du TowerManager
    this.#TowerManager = new TowerManager(this.#ballonManager);

    this.#initEventListeners();
    this.#initClicker();
  }

  #initClicker() {
    this.canvas.addEventListener("click", (e) => {
      const mouse = this.getVirtualMousePos();

      // 1. Logique du bouton Clicker (Ressources)
      // On vérifie si un round est actif (utilise le getter sans parenthèses)
      if (this.#isInside(mouse, this.#clickerZone)) {
        if (this.#ballonManager.isRoundActive) {
          this.#generateResource();
        }
        return; // On s'arrête si on a cliqué sur le bouton
      }

      // 2. Logique d'achat de tour
      this.#handleTowerPurchase(mouse);
    });
  }

  #isInside(pos, zone) {
    return (
      pos.x >= zone.x &&
      pos.x <= zone.x + zone.w &&
      pos.y >= zone.y &&
      pos.y <= zone.y + zone.h
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

    // On cherche la tuile sous la souris
    const targetTile = this.#placementTileManager.getTileAt(mouse);

    // Si on a une tuile, qu'elle est vide et qu'on a l'argent
    if (
      targetTile &&
      targetTile.isEmpty !== false &&
      this.#money >= TOWER_COST
    ) {
      this.#money -= TOWER_COST;

      // On informe la tuile qu'elle est occupée
      targetTile.isEmpty = false;

      // On ajoute la tour via le manager
      this.#TowerManager.addTower(targetTile.x, targetTile.y);

      console.log(`Tour achetée ! Argent restant : ${this.#money}`);
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

    if (this.#placementTileManager) {
      this.#placementTileManager.update(virtualMouse);
    }

    if (this.#ballonManager) {
      this.#ballonManager.update(dt);
    }

    if (this.#TowerManager) {
      this.#TowerManager.update(this.ctx);
    }
  }

  draw() {
    const { width, height } = this.canvas;
    const ctx = this.ctx;

    ctx.clearRect(0, 0, width, height);

    // --- TRANSFORMATION (DÉBUT DU MONDE VIRTUEL) ---
    const scale = Math.min(width / Map.WIDTH, height / Map.HEIGHT);
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.scale(scale, scale);
    ctx.translate(-Map.WIDTH / 2, -Map.HEIGHT / 2);

    this.#map.draw(ctx);

    if (this.#placementTileManager) {
      this.#placementTileManager.draw(ctx);
    }

    // CORRECTION ICI : On appelle draw(ctx) et non update()
    if (this.#TowerManager) {
      this.#TowerManager.draw(ctx); // On passe le ctx ici
    }

    if (this.#ballonManager) {
      this.#ballonManager.draw(ctx);
    }

    this.#drawClickerButton(ctx);

    ctx.restore();
    // --- FIN DU MONDE VIRTUEL ---

    this.#drawUI();
    this.#drawHUD();
  }

  #drawClickerButton(ctx) {
    // Changement de couleur si inactif (hors round)
    const isActive = this.#ballonManager.isRoundActive;
    ctx.fillStyle = isActive ? "#e67e22" : "#7f8c8d";
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;

    ctx.fillRect(
      this.#clickerZone.x,
      this.#clickerZone.y,
      this.#clickerZone.w,
      this.#clickerZone.h,
    );
    ctx.strokeRect(
      this.#clickerZone.x,
      this.#clickerZone.y,
      this.#clickerZone.w,
      this.#clickerZone.h,
    );

    ctx.fillStyle = "white";
    ctx.font = "bold 12px Arial";
    ctx.textAlign = "center";
    ctx.fillText("CLIC", this.#clickerZone.x + 30, this.#clickerZone.y + 35);
    ctx.textAlign = "left";
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
    this.ctx.fillStyle = this.#money >= 50 ? "gold" : "#c0392b"; // Rouge si on ne peut rien acheter
    this.ctx.font = "bold 20px Arial";
    this.ctx.fillText(`$ ${this.#money}`, 20, 90);
  }
}
