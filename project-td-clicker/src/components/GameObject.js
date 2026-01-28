export class GameObject {
  #x;
  #y;

  constructor(x, y) {
    if (this.constructor === GameObject) throw new Error("Classe abstraite");
    this.#x = x;
    this.#y = y;
  }

  get x() {
    return this.#x;
  }

  set x(value) {
    if (typeof value !== "number") {
      throw new Error("X value of game object must be a number.");
    }
    this.#x = value;
  }

  get y() {
    return this.#y;
  }

  set y(value) {
    if (typeof value !== "number") {
      throw new Error("Y value of game object must be a number.");
    }
    this.#y = value;
  }

  update() {}
  draw(ctx) {}
}
