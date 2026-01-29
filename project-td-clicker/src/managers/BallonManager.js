// src/managers/BallonManager.js
import { Container } from "../components/Container.js";
import { Ballon } from "../entities/mobs/Ballon.js";
import roundsData from "../utils/data/round.json";

export class BallonManager {
  #container;
  #currentRoundIndex = 0;
  #spawnTimer = 0;
  #enemiesRemainingToSpawn = 0;
  #isSpawning = false;
  #mapName;
  #activeRoundData = null; // <--- AJOUT : On stocke les données du round en cours

  constructor(mapName) {
    this.#container = new Container();
    this.#mapName = mapName;
  }

  get isRoundActive() {
    return this.#isSpawning || this.#container.count > 0;
  }
  get canStartNext() {
    return !this.#isSpawning;
  }
  get currentRoundNumber() {
    return this.#currentRoundIndex + 1;
  }

  startNextRound() {
    if (this.#isSpawning) return;

    // 1. On cherche d'abord dans le JSON
    let data = roundsData[this.#currentRoundIndex];

    // 2. Si pas trouvé, on génère le round infini
    if (!data) {
      data = this.#generateInfiniteRound(this.#currentRoundIndex);
    }

    if (data) {
      this.#activeRoundData = data; // <--- CRUCIAL : On mémorise ces données
      this.#enemiesRemainingToSpawn = data.count;
      this.#spawnTimer = 0;
      this.#isSpawning = true;
      console.log(`Lancement du Round ${this.currentRoundNumber}`);
    }
  }

  update(dt) {
    this.#handleSpawning(dt);
    this.#container.update(dt);

    if (this.#isSpawning && this.#enemiesRemainingToSpawn === 0) {
      this.#isSpawning = false;
      this.#currentRoundIndex++;
    }
  }

  #handleSpawning(dt) {
    // Si on ne spawn rien ou qu'on n'a pas de données, on sort
    if (
      !this.#isSpawning ||
      this.#enemiesRemainingToSpawn <= 0 ||
      !this.#activeRoundData
    )
      return;

    this.#spawnTimer += dt * 1000;

    // On utilise #activeRoundData qui contient soit le JSON, soit l'infini
    if (this.#spawnTimer >= this.#activeRoundData.interval) {
      const enemy = new Ballon(
        this.#mapName,
        this.#activeRoundData.color,
        this.#activeRoundData.speed,
        this.#activeRoundData.hp,
      );
      this.#container.add(enemy);

      this.#spawnTimer = 0;
      this.#enemiesRemainingToSpawn--;
    }
  }

  #generateInfiniteRound(index) {
    const baseRound = roundsData[roundsData.length - 1]; // Dernier round du JSON
    const extraLevel = index - roundsData.length + 1;

    return {
      count: baseRound.count + extraLevel * 2,
      interval: Math.max(150, baseRound.interval * Math.pow(0.9, extraLevel)),
      hp: Math.floor(baseRound.hp * Math.pow(1.15, extraLevel)), // +15% HP par round
      speed: Math.min(4, baseRound.speed + extraLevel * 0.05),
      color: "purple", // Couleur spéciale pour les vagues infinies
    };
  }

  get isRoundActive() {
    return this.#isSpawning || this.#container.count > 0;
  }

  // src/managers/BallonManager.js
  get enemies() {
    // On renvoie la liste des enfants du container (les ballons)
    return this.#container.children;
  }

  draw(ctx) {
    this.#container.draw(ctx);
  }
}
