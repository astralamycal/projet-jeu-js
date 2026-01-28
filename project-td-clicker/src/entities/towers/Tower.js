import { GameObject } from "../../components/GameObject.js";

export class Tower extends GameObject {
  #canvas;

  constructor(x, y, canvas) {
    super(x, y);
    this.#canvas = canvas;
  }

  draw() {
    console.log(this.#canvas);
    this.#canvas.fillStyle = "blue";
    this.#canvas.fillRect(this.x, this.y, 16, 16);
  }
}
