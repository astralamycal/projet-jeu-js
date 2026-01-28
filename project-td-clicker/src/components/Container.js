import { GameObject } from "./GameObject.js";

export class Container extends GameObject {
  // Propriété privée pour stocker les enfants (Encapsulation)
  #children = [];

  constructor() {
    // Un container n'a pas forcément de position fixe propre
    super(0, 0);
  }

  add(child) {
    if (child instanceof GameObject) {
      this.#children.push(child);
    } else {
      throw new Error("L'enfant doit être une instance de GameObject."); // Robustesse
    }
  }

  /**
   * Retire un enfant spécifique du container.
   */
  remove(child) {
    this.#children = this.#children.filter((c) => c !== child);
  }

  update(dt) {
    // On parcourt les enfants et on appelle leur propre update
    this.#children.forEach((child) => {
      if (typeof child.update === "function") {
        child.update(dt);
      }
    });

    // Optionnel : Nettoyage automatique des objets morts
    this.#cleanup();
  }

  draw(ctx) {
    this.#children.forEach((child) => {
      if (typeof child.draw === "function") {
        child.draw(ctx);
      }
    });
  }

  /**
   * Supprime les entités qui ne sont plus vivantes (ex: ballons éclatés)
   */
  #cleanup() {
    this.#children = this.#children.filter((child) => {
      // Si l'enfant a une propriété isAlive, on s'en sert
      return child.isAlive !== false;
    });
  }

  // Accesseur pour obtenir le nombre d'éléments (utile pour le debug)
  get count() {
    return this.#children.length;
  }
}
