// src/entities/towers/Tower.js
import { Entity } from "../Entity.js";
import { Projectile } from "../Projectile.js";

const sprite = "/assets/spr_tower_archer.png";

export class Tower extends Entity {
  #projectiles = [];
  #center;
  #ballonManager;
  #radius = 100;
  #target;
  #validEnemies = [];
  #frames = 0;

  constructor(x, y, ballonManager) {
    super(x, y, 16, 16, 1, 0, sprite);
    this.#center = this.center;
    this.#ballonManager = ballonManager;
  }

  // ✅ 2. DRAW : Reçoit le contexte (ctx), gère uniquement l'image
  draw(ctx) {
    if (!ctx) return;
    // this.#target = findTarget();

    // Dessine l'archer (via GameObject/Entity)
    super.draw(ctx);

    //ctx.fillStyle = "blue";
    //ctx.beginPath();
    //ctx.arc(this.#center.x, this.#center.y, this.#radius, 0, Math.PI * 2);
    //ctx.fill();

    // Dessine chaque projectile
    for (let i = this.#projectiles.length - 1; i >= 0; i--) {
      const projectile = this.#projectiles[i];
      projectile.update(ctx);
      if (projectile.targetReached) {
        projectile.targetBallon.takeDamage(projectile.hp);
        this.#projectiles.splice(i, 1);
      }
    }

    this.update(ctx);
  }

  update(ctx) {
    this.#validEnemies = this.#ballonManager.container.children.filter(
      (ballon) => {
        return Math.hypot(ballon.x - this.x, ballon.y - this.y) <= this.#radius;
      },
    );
    this.#target = this.#validEnemies[0];

    if (this.#target) {
      if (this.#frames % 180 === 0) {
        this.#projectiles.push(
          new Projectile(
            this.x,
            this.y,
            10,
            this.#ballonManager,
            this.#validEnemies[0],
          ),
        );
      }
      this.#frames++;
    } else {
      this.#frames = 0;
    }
  }
}
