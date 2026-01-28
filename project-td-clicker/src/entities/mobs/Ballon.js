import { Entity } from "../Entity.js";
import mapPaths from "../../utils/data/mapPaths.json";

export class Ballon extends Entity {
  #waypoints;
  #waypointIndex = 1;
  #color;

  constructor(mapName, color, speed, hp = 10) {
    const path = mapPaths[mapName];
    if (!path) throw new Error(`Path ${mapName} non trouvé`);

    // ORDRE : x, y, width, height, hp, speed
    super(path[0].x, path[0].y, 25, 25, hp, speed);

    this.#waypoints = path;
    this.#color = color;

    // Ajustement pour que le (x,y) de départ soit centré sur le premier point
    this.x -= this.width / 2;
    this.y -= this.height / 2;
  }

  update(dt) {
    if (this.#waypointIndex >= this.#waypoints.length) {
      this.takeDamage(999); // Meurt pour être nettoyé par le Container
      // ICI : déclencher un événement "perte de vie" si tu veux
      return;
    }

    const target = this.#waypoints[this.#waypointIndex];
    const dx = target.x - this.center.x;
    const dy = target.y - this.center.y;
    const distance = Math.hypot(dx, dy);

    // On utilise la vitesse héritée !
    const moveStep = this.speed * (dt || 0.016) * 60;

    if (distance < moveStep) {
      this.#waypointIndex++;
    } else {
      const angle = Math.atan2(dy, dx);
      this.x += Math.cos(angle) * moveStep;
      this.y += Math.sin(angle) * moveStep;
    }
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.center.x, this.center.y, this.width / 2, 0, Math.PI * 2);
    ctx.fillStyle = this.#color;
    ctx.fill();
    ctx.closePath();
  }
}
