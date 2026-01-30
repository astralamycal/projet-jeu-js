import { Entity } from "./Entity.js";

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

  update(ctx) {
    // get distance entre projectile et target
    if (this.#targetBallon) {
      this.#distanceTarget = Math.hypot(
        this.#targetBallon.center.x - this.x,
        this.#targetBallon.center.y - this.y,
      );

      if (this.#distanceTarget < this.#targetBallon.width / 2) {
        //function to hit ballon si collision
        this.#targetReached = true;
      }

      //pathfinding pour projectile
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
