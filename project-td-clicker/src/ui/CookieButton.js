// src/ui/components/CookieButton.js
import { GameObject } from "../components/GameObject.js";

export class CookieButton extends GameObject {
  constructor(x, y, w, h) {
    // ORDRE GameObject : x, y, width, height, spritePath
    super(x, y, w, h, "./public/assets/cookie.png");
  }

  /**
   * On surcharge la méthode draw pour inclure l'effet visuel d'activation.
   * @param {CanvasRenderingContext2D} ctx
   * @param {boolean} isActive - État du round pour le filtre
   */
  draw(ctx, isActive) {
    if (!ctx) return;

    ctx.save();

    // Si le round n'est pas actif, on applique le filtre de désactivation
    if (!isActive) {
      ctx.filter = "grayscale(100%) opacity(50%)";
    }

    // On appelle le draw du GameObject qui gère l'affichage du sprite
    super.draw(ctx);

    ctx.restore();
  }
}
