import { Container } from "../components/Container.js";
import { Ballon } from "../entities/mobs/Ballon.js";
import roundsData from "../utils/data/round.json";

export class BallonManager {
  #container;
  #currentRoundIndex = 0;
  #spawnTimer = 0;
  #enemiesRemainingToSpawn = 0;
  #isSpawning = false; // Nouveau : on suit si le spawn est en cours
  #mapName;

  constructor(mapName) {
    this.#container = new Container();
    this.#mapName = mapName;
  }

  // On peut passer au round suivant si on ne spawn plus rien
  get canStartNext() {
    return !this.#isSpawning;
  }

  startNextRound() {
    // On ne lance le round que si le précédent a fini de spawner
    if (this.#isSpawning) return;

    const roundData = roundsData[this.#currentRoundIndex];
    if (roundData) {
      this.#enemiesRemainingToSpawn = roundData.count;
      this.#spawnTimer = 0;
      this.#isSpawning = true;
    }
  }

  update(dt) {
    this.#handleSpawning(dt);
    this.#container.update(dt);

    // Si on a fini de spawner TOUS les ballons du round actuel
    if (this.#isSpawning && this.#enemiesRemainingToSpawn === 0) {
      this.#isSpawning = false;
      this.#currentRoundIndex++;
      // Note : On incrémente l'index ici pour que le bouton "Suivant"
      // soit prêt pour le round d'après immédiatement.
    }
  }

  #handleSpawning(dt) {
    if (!this.#isSpawning || this.#enemiesRemainingToSpawn <= 0) return;

    const roundData = roundsData[this.#currentRoundIndex];
    this.#spawnTimer += dt * 1000;

    if (this.#spawnTimer >= roundData.interval) {
      const enemy = new Ballon(
        this.#mapName,
        roundData.color,
        roundData.speed,
        roundData.hp,
      );
      this.#container.add(enemy);
      this.#spawnTimer = 0;
      this.#enemiesRemainingToSpawn--;
    }
  }

  draw(ctx) {
    this.#container.draw(ctx);
  }

  get currentRoundNumber() {
    return this.#currentRoundIndex + 1;
  }
}
