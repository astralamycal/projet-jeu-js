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

  draw(ctx) {
    if (!ctx) return;

    // Dessine la tour (via GameObject/Entity)
    super.draw(ctx);

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
    //update liste des cookies dans la range de la tour
    this.#validEnemies = this.#ballonManager.container.children.filter(
      (ballon) => {
        return Math.hypot(ballon.x - this.x, ballon.y - this.y) <= this.#radius;
      },
    );
    this.#target = this.#validEnemies[0];

    // si cookie dans range, création de projectile
    if (this.#target) {
      if (this.#frames % 120 === 0) {
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
    }
  }
}
