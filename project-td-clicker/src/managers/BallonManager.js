import { Ballon } from "../entities/mobs/Ballon.js";

export class BallonManager {
  #ballonList = [];

  constructor() {}

  createBallon(hp, speed, imagePath) {
    const ballon = new Ballon(hp, speed, imagePath);
    this.#ballonList.push(ballon);
    return ballon;
  }
}
