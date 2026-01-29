import { Entity } from "../Entity.js";
import { Projectile } from "../Projectile.js";

export class Tower extends Entity {
  #projectiles = [];
  #center;
  #ballonManager;

  constructor(x, y, ballonManager) {
    super(x, y, 16, 16, 1, 0);
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

  // On reçoit le ctx (le pinceau) ici, à chaque frame
  draw(ctx) {
    // Sécurité absolue : on vérifie que c'est bien le contexte
    if (!ctx || typeof ctx.fillRect !== "function") return;

    ctx.fillStyle = "blue";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  update(ctx) {
    //const angle = Math.atan2();
    this.#projectiles.forEach((projectile) => projectile.update(ctx));

    this.draw(ctx);
  }
}
