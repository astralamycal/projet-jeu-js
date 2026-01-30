import { GameObject } from "../components/GameObject.js";

export class Map extends GameObject {
  #image;
  #isLoaded = false;
  // On fixe les dimensions de référence du jeu
  static WIDTH = 480;
  static HEIGHT = 320;

  constructor(imagePath) {
    super(0, 0);
    this.#image = new Image();
    this.#image.src = imagePath;
    this.#image.onload = () => {
      this.#isLoaded = true;
    };
  }

  draw(ctx) {
    if (!this.#isLoaded) return;

    // (Le scaling sera géré par le GameScreen pour le responsive)
    ctx.drawImage(this.#image, 0, 0, Map.WIDTH, Map.HEIGHT);
  }
}
