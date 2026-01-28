import { GameObject } from "../../components/GameObject";

export class PlacementTile extends GameObject {
  #canvas;
  constructor(x, y, canvas) {
    super(x, y);
    this.#canvas = canvas;
  }

  draw() {
    this.#canvas.fillStyle = "white";
    this.#canvas.fillRect(this.x, this.y, 16, 16);
  }

  update(mouse) {
    this.draw();
    if (
      mouse.x > this.x &&
      mouse.x < this.x + 16 &&
      mouse.y > this.y &&
      mouse.y < this.y + 16
    ) {
    }
  }
}
//temp
const mouse = {
  x: undefined,
  y: undefined,
};
window.addEventListener("mousemove", (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});
