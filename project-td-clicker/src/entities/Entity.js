import { GameObject } from "../components/GameObject.js";

export class Entity extends GameObject {
  #width = 10;
  #height = 10;
  #hp = 1;

  constructor(x, y, width, height, hp) {
    super(x, y);

    if (typeof width !== "number" || width < 0) {
      throw new Error("Width must be a number greater than 0.");
    }

    if (typeof height !== "number" || height < 0) {
      throw new Error("Height must be a number greater than 0.");
    }

    if (typeof hp !== "number" || hp <= 0) {
      throw new Error("Hp must be a number greater than 0.");
    }

    this.#width = width;
    this.#height = height;
    this.#hp = hp;
  }

  get width() {
    return this.#width;
  }

  get height() {
    return this.#height;
  }

  get hp() {
    return this.#hp;
  }

  isAlive() {
    return this.#hp > 0;
  }

  get center() {
    return {
      x: this.x + this.#width / 2,
      y: this.y + this.#height / 2,
    };
  }
}
