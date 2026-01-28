// src/components/Container.js
import { GameObject } from "./GameObject.js";

export class Container extends GameObject {
  #children = [];

  constructor() {
    super(0, 0);
  }

  add(child) {
    if (child instanceof GameObject) {
      this.#children.push(child);
    } else {
      throw new Error("L'enfant doit être une instance de GameObject.");
    }
  }

  remove(child) {
    this.#children = this.#children.filter((c) => c !== child);
  }

  update(dt) {
    this.#children.forEach((child) => {
      if (typeof child.update === "function") {
        child.update(dt);
      }
    });

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
   * Nettoyage intelligent : vérifie si c'est une méthode ou une propriété
   */
  #cleanup() {
    this.#children = this.#children.filter((child) => {
      // 1. Si c'est une méthode : child.isAlive()
      if (typeof child.isAlive === "function") {
        return child.isAlive();
      }
      // 2. Si c'est une propriété : child.isAlive
      if (child.isAlive !== undefined) {
        return child.isAlive !== false;
      }
      // 3. Par défaut, on garde l'objet
      return true;
    });
  }

  get count() {
    return this.#children.length;
  }
}
