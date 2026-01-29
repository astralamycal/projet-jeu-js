import { Entity } from "./Entity";

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
    ctx.beginPath();
    ctx.arc(this.x, this.y, 10, 0, 2 * Math.PI);
    ctx.fillStyle = "#ff9100";
    ctx.closePath();
    ctx.fill();
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
      this.#velocity.x = Math.cos(angle) * 2;
      this.#velocity.y = Math.sin(angle) * 2;

      this.x += this.#velocity.x;
      this.y += this.#velocity.y;
    }
    this.draw(ctx);
  }
}
