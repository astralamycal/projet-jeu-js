import { Entity } from "../Entity.js";
import mapPaths from "../../utils/data/mapPaths.json";

export class Ballon extends Entity {
  #waypoints;
  #waypointIndex = 1;

  constructor(mapName, color, speed, hp = 10) {
    const path = mapPaths[mapName];
    if (!path) throw new Error(`Path ${mapName} non trouvé`);

    // 1. On génère le chemin vers le sprite en fonction de la couleur
    const spritePath = `/assets/cookie.png`;

    // 2. On passe le spritePath à Entity (7ème argument)
    // ORDRE : x, y, width, height, hp, speed, spritePath
    super(path[0].x, path[0].y, 25, 25, hp, speed, spritePath);

    this.#waypoints = path;

    // Ajustement pour centrer l'image sur le point de départ
    this.x -= this.width / 2;
    this.y -= this.height / 2;
  }

  update(dt) {
    if (this.#waypointIndex >= this.#waypoints.length) {
      this.takeDamage(999); // Meurt pour être nettoyé
      return;
    }

    const target = this.#waypoints[this.#waypointIndex];
    const dx = target.x - this.center.x;
    const dy = target.y - this.center.y;
    const distance = Math.hypot(dx, dy);

    // Utilisation de la vitesse héritée
    const moveStep = this.speed * (dt || 0.016) * 60;

    if (distance < moveStep) {
      this.#waypointIndex++;
    } else {
      const angle = Math.atan2(dy, dx);
      this.x += Math.cos(angle) * moveStep;
      this.y += Math.sin(angle) * moveStep;
    }
  }
}
