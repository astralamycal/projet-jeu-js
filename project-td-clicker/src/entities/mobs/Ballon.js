import { Entity } from "../Entity.js";
import mapPaths from "../../utils/data/mapPaths.json";

/**
 * Niveau 3 d'héritage : L'ennemi principal du jeu.
 */
export class Ballon extends Entity {
  #waypoints;
  #waypointIndex = 1;
  #hp;
  #reward;
  #color;

  constructor(mapName, hp, speed, color, reward) {
    const paths = mapPaths[mapName];
    if (!paths) throw new Error(`Chemin pour ${mapName} introuvable`);

    // On démarre au premier waypoint
    super(paths[0].x, paths[0].y, 30, 30, speed);

    this.#waypoints = paths;
    this.#hp = hp;
    this.#color = color;
    this.#reward = reward;

    // Centrage visuel initial
    this.x -= this.width / 2;
    this.y -= this.height / 2;
  }

  /**
   * Logique de mouvement vers les waypoints (Pathfinding)
   */
  update() {
    if (!this.isAlive) return;

    // Si on a atteint le dernier point
    if (this.#waypointIndex >= this.#waypoints.length) {
      this.isAlive = false;
      console.log("Dégâts au joueur !");
      return;
    }

    const target = this.#waypoints[this.#waypointIndex];
    const center = this.center;

    // Calcul de l'angle vers la cible
    const angle = Math.atan2(target.y - center.y, target.x - center.x);

    // Déplacement fluide
    this.x += Math.cos(angle) * this.speed;
    this.y += Math.sin(angle) * this.speed;

    // Vérification d'arrivée au waypoint (marge d'erreur = vitesse)
    const dist = Math.hypot(target.x - center.x, target.y - center.y);
    if (dist < this.speed) {
      this.#waypointIndex++;
    }
  }

  draw(ctx) {
    if (!this.isAlive) return;

    ctx.beginPath();
    ctx.arc(this.center.x, this.center.y, this.width / 2, 0, Math.PI * 2);
    ctx.fillStyle = this.#color;
    ctx.fill();
    ctx.closePath();
  }
}
