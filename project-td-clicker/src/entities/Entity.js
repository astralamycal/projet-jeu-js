import { GameObject } from "../components/GameObject.js";

/**
 * Niveau 2 d'héritage : Gère les propriétés physiques et de mouvement de base.
 */
export class Entity extends GameObject {
  #width;
  #height;
  #speed;
  #isAlive = true;

  constructor(x, y, width, height, speed) {
    super(x, y);

    // Robustesse : Validation des données
    if (width <= 0 || height <= 0) throw new Error("Dimensions invalides");

    this.#width = width;
    this.#height = height;
    this.#speed = speed;
  }

  get width() {
    return this.#width;
  }
  get height() {
    return this.#height;
  }
  get speed() {
    return this.#speed;
  }
  get isAlive() {
    return this.#isAlive;
  }
  set isAlive(value) {
    this.#isAlive = value;
  }

  get center() {
    return {
      x: this.x + this.#width / 2,
      y: this.y + this.#height / 2,
    };
  }
}
