export class Screen {
  #canvas;
  #ctx;

  constructor(canvas, ctx) {
    // Empêcher l'instanciation directe (Classe abstraite)
    if (new.target === Screen) throw new Error("Classe Screen abstraite");
    this.#canvas = canvas;
    this.#ctx = ctx;
  }

  get canvas() {
    return this.#canvas;
  }
  get ctx() {
    return this.#ctx;
  }

  update() {} // À définir par les enfants
  draw() {} // À définir par les enfants
}
