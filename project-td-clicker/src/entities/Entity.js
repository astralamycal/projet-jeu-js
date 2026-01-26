export class Entity {
  #position = {
    x: 0,
    y: 0,
  };

  #size = {
    width: 10,
    height: 10,
  };

  constructor(width, height, x = 0, y = 0) {
    if (typeof width === "number" && width > 0) {
      this.#size.width = width;
    } else {
      throw new Error("Width of entity must be a greater number than 0.");
    }

    if (typeof height === "number" && height > 0) {
      this.#size.height = height;
    } else {
      throw new Error("Height of entity must be a greater number than 0.");
    }

    if (typeof x === "number") {
      this.#position.x = x;
    } else {
      throw new Error("X coordinate must be a number.");
    }

    if (typeof y === "number") {
      this.#position.y = y;
    } else {
      throw new Error("Y coordinate must be a number");
    }
  }

  #draw(canvas) {
    canvas.fillStyle = "red";
    canvas.fillRect(
      this.#position.x,
      this.#position.y,
      this.#size.width,
      this.#size.height,
    );
  }

  update(canvas) {
    this.#draw(canvas);

    const yDistance = 300 - this.#position.y;
    const xDistance = 400 - this.#position.x;
    const angle = Math.atan2(yDistance, xDistance);

    this.#position.x += Math.cos(angle);
    this.#position.y += Math.sin(angle);
  }
}
