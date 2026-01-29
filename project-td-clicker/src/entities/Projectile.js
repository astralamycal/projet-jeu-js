// src/entities/Projectile.js
import { Entity } from "./Entity.js"; // N'oublie pas l'extension .js si nécessaire

const sprite = "/assets/spr_tower_archer_projectile.png";

export class Projectile extends Entity {
  #velocity = {
    x: 0,
    y: 0,
  };
  #ballonManager;
  #targetBallon;
  #distanceTarget;
  #targetReached = false;

  constructor(x, y, hp, ballonManager, target) {
    super(x, y, 7, 3, hp, 0, sprite);
    this.#ballonManager = ballonManager;
    this.#targetBallon = target;
  }

  get targetReached() {
    return this.#targetReached;
  }
  get targetBallon() {
    return this.#targetBallon;
  }

  draw(ctx) {
    // if (!ctx) return;
    // ctx.beginPath();
    // // On utilise this.x et this.y mis à jour par l'update
    // ctx.arc(this.x, this.y, this.width / 2, 0, 2 * Math.PI);
    // ctx.fillStyle = "#ff9100";
    // ctx.fill();
    // ctx.closePath();

    super.draw(ctx);
  }

  update(ctx) {
    if (this.#targetBallon) {
      this.#distanceTarget = Math.hypot(
        this.#targetBallon.center.x - this.x,
        this.#targetBallon.center.y - this.y,
      );

      if (this.#distanceTarget < this.#targetBallon.width / 2) {
        //function to hit ballon
        this.#targetReached = true;
      }

      const angle = Math.atan2(
        this.#targetBallon.center.y - this.y,
        this.#targetBallon.center.x - this.x,
      );
      this.#velocity.x = Math.cos(angle) * 6;
      this.#velocity.y = Math.sin(angle) * 6;

      this.x += this.#velocity.x;
      this.y += this.#velocity.y;
    }
    this.draw(ctx);
  }
}
