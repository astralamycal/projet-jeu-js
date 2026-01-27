// src/entities/Entity.js
import { GameObject } from "../components/GameObject.js";
import mapPaths from "../utils/data/mapPaths.json";

export class Entity extends GameObject {
  #waypoints;
  #size = { width: 10, height: 10 };
  #waypointIndex = 1;
  #speed = 2; // Ajout d'une vitesse modifiable
  #isAlive = true;

  constructor(width, height, mapName) {
    // On initialise la position au premier waypoint
    const paths = mapPaths[mapName];
    if (!paths) throw new Error(`Map ${mapName} introuvable`);

    super(paths[0].x, paths[0].y); // Niveau 1 d'héritage

    this.#size.width = width;
    this.#size.height = height;
    this.#waypoints = paths;

    // On ajuste la position pour centrer l'entité
    this.x -= this.#size.width / 2;
    this.y -= this.#size.height / 2;
  }

  get isAlive() {
    return this.#isAlive;
  }

  update() {
    if (this.#waypointIndex >= this.#waypoints.length) {
      this.#isAlive = false;
      return;
    }

    const target = this.#waypoints[this.#waypointIndex];

    // Calcul du centre actuel pour le pathfinding
    const centerX = this.x + this.#size.width / 2;
    const centerY = this.y + this.#size.height / 2;

    const distY = target.y - centerY;
    const distX = target.x - centerX;
    const angle = Math.atan2(distY, distX);

    // Déplacement basé sur la vitesse
    this.x += Math.cos(angle) * this.#speed;
    this.y += Math.sin(angle) * this.#speed;

    // Vérification de l'arrivée au waypoint (marge d'erreur de la vitesse)
    if (
      Math.abs(centerX - target.x) < this.#speed &&
      Math.abs(centerY - target.y) < this.#speed
    ) {
      this.#waypointIndex++;
    }
  }

  draw(ctx) {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, this.#size.width, this.#size.height);
  }
}
