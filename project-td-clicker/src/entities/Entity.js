// src/entities/Entity.js
import { GameObject } from "../components/GameObject.js";

export class Entity extends GameObject {
  #hp;
  #speed;

  constructor(x, y, width, height, hp, speed, spritePath = null) {
    // On transmet les infos visuelles au GameObject
    super(x, y, width, height, spritePath);

    // Validations robustes
    if (typeof hp !== "number" || hp <= 0) throw new Error("Hp must be > 0");
    if (typeof speed !== "number") throw new Error("Speed must be a number");

    this.#hp = hp;
    this.#speed = speed;
  }

  get hp() {
    return this.#hp;
  }
  get speed() {
    return this.#speed;
  }

  takeDamage(amount) {
    this.#hp -= amount;
    if (this.#hp < 0) this.#hp = 0;
  }

  isAlive() {
    return this.#hp > 0;
  }

  get center() {
    return {
      x: this.x + this.width / 2,
      y: this.y + this.height / 2,
    };
  }
}
