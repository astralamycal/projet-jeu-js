export class Engine {
  #onUpdate;
  #onDraw;
  #lastTimestamp = 0;
  #isPaused = false;

  /**
   * @param {Function} updateFn - La fonction de mise à jour à appeler
   * @param {Function} drawFn - La fonction de rendu à appeler
   */
  constructor(updateFn, drawFn) {
    this.#onUpdate = updateFn;
    this.#onDraw = drawFn;
  }

  // Démarre le moteur
  start() {
    this.#lastTimestamp = performance.now();
    requestAnimationFrame((t) => this.#loop(t));
  }

  #loop(timestamp) {
    if (this.#isPaused) return;

    // Calcul du temps écoulé (Delta Time) pour la fluidité
    const dt = (timestamp - this.#lastTimestamp) / 1000;
    this.#lastTimestamp = timestamp;

    try {
      // On appelle les fonctions fournies par Game.js
      this.#onUpdate(dt);
      this.#onDraw();
    } catch (error) {
      console.error("Erreur critique dans la boucle moteur :", error.message);
      this.#isPaused = true; // Arrêt de sécurité
    }

    requestAnimationFrame((t) => this.#loop(t));
  }

  // Méthodes pour gérer l'état du moteur
  pause() {
    this.#isPaused = true;
  }
  resume() {
    this.#isPaused = false;
    this.start();
  }
}
