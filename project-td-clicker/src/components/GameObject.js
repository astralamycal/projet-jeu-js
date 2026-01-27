export class GameObject {
  #x;
  #y;

  constructor(x, y) {
    if (this.constructor === GameObject) throw new Error("Classe abstraite");
    this.#x = x;
    this.#y = y;
  }

  // Accesseurs sécurisés (Encapsulation)
  get x() {
    return this.#x;
  }
  set x(value) {
    this.#x = value;
  }
  get y() {
    return this.#y;
  }
  set y(value) {
    this.#y = value;
  }

  update() {}
  draw(ctx) {}
}
