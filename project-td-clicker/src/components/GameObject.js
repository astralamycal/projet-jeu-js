export class GameObject {
  #sprite = null;
  #isLoaded = false;

  constructor(x, y, width = 0, height = 0, spritePath = null) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    // loads image for object
    if (spritePath) {
      this.#sprite = new Image();
      this.#sprite.src = spritePath;
      this.#sprite.onload = () => {
        this.#isLoaded = true;
      };
    }
  }

  draw(ctx) {
    if (!ctx) return;

    if (this.#sprite && this.#isLoaded) {
      ctx.drawImage(this.#sprite, this.x, this.y, this.width, this.height);
    } else {
      // Dessin par défaut si pas de sprite ou pas encore chargé
      ctx.fillStyle = "rgba(255, 0, 255, 0.5)"; // Magenta transparent
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }
}
