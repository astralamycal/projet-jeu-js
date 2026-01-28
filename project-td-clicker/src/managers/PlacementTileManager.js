import { PlacementTile } from "../entities/towers/PlacementTile.js";
import map from "../utils/data/mapPaths.json";

export class PlacementTileManager {
  #tilePlacements = map.towerPlacements;
  #canvas;
  #mouse;

  #placementTiles = [];

  constructor(canvas, mouse) {
    this.#canvas = canvas;
    this.#mouse = mouse;
    this.init();
  }

  init() {
    this.#tilePlacements.forEach((row, y) => {
      row.forEach((symbol, x) => {
        if (symbol === 1) {
          //add building placement tile here
          this.#placementTiles.push(
            new PlacementTile(x * 16, y * 16, this.#canvas, this.#mouse),
          );
        }
      });
    });
  }

  get placementTiles() {
    return this.#placementTiles;
  }

  update(virtualMouse) {
    // Sécurité : si virtualMouse est mal transmis, on arrête
    if (!virtualMouse) return;

    this.#placementTiles.forEach((tile) => {
      tile.update(virtualMouse); // On transmet la souris à chaque tuile
    });
  }

  draw(ctx) {
    this.#placementTiles.forEach((tile) => {
      // On vérifie par sécurité que la méthode draw existe sur la tuile
      if (typeof tile.draw === "function") {
        tile.draw(ctx);
      }
    });
  }
}
