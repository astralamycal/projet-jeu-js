import { Tower } from "../entities/towers/Tower";

export class TowerManager {
  #placementTileManager;
  #towerList = [];
  #activeTile = undefined;
  #canvas;

  constructor(placementTileManager, canvas) {
    this.#placementTileManager = placementTileManager;
    this.#canvas = canvas;

    //event to create tower on click
    this.#canvas.addEventListener("click", (event) => {
      if (this.#activeTile) {
        this.#towerList.push(
          new Tower(this.#activeTile.x, this.#activeTile.y, this.#canvas),
        );
      }
    });
  }

  update() {
    //finds active tile
    this.#activeTile = null;
    this.#placementTileManager.placementTiles.forEach((tile) => {
      if (tile.isHovered) {
        return (this.#activeTile = tile);
      }
    });

    //draws the list of towers
    this.#towerList.forEach((tower) => tower.draw());
  }
}
