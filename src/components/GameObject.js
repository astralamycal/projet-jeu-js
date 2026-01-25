class GameObject {
  #sprite;
  #position;

  constructor(sprite, position) {
    this.#sprite = sprite;
    this.#position = position;
  }

  getSprite() {
    return this.#sprite;
  }

  getPosition() {
    return this.#position;
  }

  setSprite(sprite) {
    this.#sprite = sprite;
  }

  setPosition(position) {
    this.#position = position;
  }
}
