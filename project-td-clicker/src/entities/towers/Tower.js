// src/entities/towers/Tower.js
import { Entity } from "../Entity.js";
import { Projectile } from "../Projectile.js";

const sprite = "/assets/spr_tower_archer.png";

export class Tower extends Entity {
  #projectiles = [];
  #center;
  #ballonManager;
  #target;

  constructor(x, y, ballonManager) {
    super(x, y, 16, 16, 1, 0, sprite);
    this.#center = this.center;
    this.#ballonManager = ballonManager;

    this.#projectiles.push(
      new Projectile(
        this.#center.x,
        this.#center.y,
        10,
        10,
        10,
        2,
        2,
        this.#ballonManager,
      ),
    );
  }

  findTarget() {}

  draw(ctx) {
    // Sécurité absolue : on vérifie que c'est bien le contexte
    if (!ctx || typeof ctx.fillRect !== "function") return;

    // ❌ SURTOUT PAS DE this.draw(ctx) ICI !
  }

  // ✅ 2. DRAW : Reçoit le contexte (ctx), gère uniquement l'image
  draw(ctx) {
    if (!ctx) return;
    // this.#target = findTarget();

    // Dessine l'archer (via GameObject/Entity)
    super.draw(ctx);

    // Dessine chaque projectile
    this.#projectiles.forEach((projectile) => {
      // On passe ctx, qui est l'OBJET de dessin
      projectile.update(ctx);
    });
  }
}
