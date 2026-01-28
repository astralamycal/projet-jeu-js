import { GameObject } from "../components/GameObject.js";

export class Entity extends GameObject {
  #width = 10;
  #height = 10;
  #hp = 1;
  #speed = 0; // Ajout de la vitesse

  constructor(x, y, width, height, hp, speed) {
    super(x, y);

    // Validations robustes
    if (typeof width !== "number" || width <= 0)
      throw new Error("Width must be > 0");
    if (typeof height !== "number" || height <= 0)
      throw new Error("Height must be > 0");
    if (typeof hp !== "number" || hp <= 0) throw new Error("Hp must be > 0");
    if (typeof speed !== "number") throw new Error("Speed must be a number");

    this.#width = width;
    this.#height = height;
    this.#hp = hp;
    this.#speed = speed;
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
  get speed() {
    return this.#speed;
  } // Accesseur pour les classes filles

  takeDamage(amount) {
    this.#hp -= amount;
    if (this.#hp < 0) this.#hp = 0;

    // Log pour le debug (tu pourras le retirer plus tard)
    console.log(`Dégâts reçus : ${amount}. PV restants : ${this.#hp}`);
  }

  // On transforme isAlive e  n méthode pour vérifier les PV en temps réel
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
