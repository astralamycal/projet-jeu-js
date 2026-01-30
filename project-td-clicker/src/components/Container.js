import { GameObject } from "./GameObject.js";

export class Container extends GameObject {
  #children = [];

  constructor() {
    super(0, 0);
  }

  get children() {
    return this.#children;
  }

  // adds cookies to a list of cookies
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

  //updates every cookie in list
  update(dt) {
    this.#children.forEach((child) => {
      if (typeof child.update === "function") {
        child.update(dt);
      }
    });

    this.#cleanup();
  }

  //draws every cookie in list
  draw(ctx) {
    this.#children.forEach((child) => {
      if (typeof child.draw === "function") {
        child.draw(ctx);
      }
    });
  }

  // vérifie si c'est une méthode ou une propriété
  #cleanup() {
    this.#children = this.#children.filter((child) => {
      // On utilise la méthode de l'Entity pour savoir s'il faut le garder
      if (typeof child.isAlive === "function") {
        return child.isAlive();
      }
      return true; // save state in case of no isAlive method
    });
  }
}
