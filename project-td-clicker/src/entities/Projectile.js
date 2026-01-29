// src/entities/Projectile.js
import { Entity } from "./Entity.js"; // N'oublie pas l'extension .js si nécessaire

export class Projectile extends Entity {
  #velocity = {
    x: 0,
    y: 0,
  };
  #ballonManager;
  #targetBallon;
  #distanceTarget;

  constructor(x, y, width, height, hp, xSpeed, ySpeed, ballonManager) {
    super(x, y, width, height, hp, xSpeed);
    this.#velocity = {
      x: xSpeed,
      y: ySpeed,
    };
    this.#ballonManager = ballonManager;
    console.log(ballonManager);
  }

  draw(ctx) {
    if (!ctx) return;
    ctx.beginPath();
    // On utilise this.x et this.y mis à jour par l'update
    ctx.arc(this.x, this.y, this.width / 2, 0, 2 * Math.PI);
    ctx.fillStyle = "#ff9100";
    ctx.fill();
    ctx.closePath();
  }

  update(ctx) {
    if (this.#ballonManager.container.children[0]) {
      this.#targetBallon = this.#ballonManager.container.children[0];

      this.#distanceTarget = Math.hypot(
        this.#targetBallon.center.x - this.x,
        this.#targetBallon.center.y - this.y,
      );

      const angle = Math.atan2(
        this.#targetBallon.center.y - this.y,
        this.#targetBallon.center.x - this.x,
      );
      this.#velocity.x = Math.cos(angle) * 3;
      this.#velocity.y = Math.sin(angle) * 3;

      this.x += this.#velocity.x;
      this.y += this.#velocity.y;
    }
    this.draw(ctx);
  }
}
