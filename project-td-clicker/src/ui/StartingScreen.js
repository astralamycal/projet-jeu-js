import { Screen } from "./Screen.js";

export class StartingScreen extends Screen {
  #bgImage = new Image();
  #isLoaded = false;
  #uiElement = null;

  constructor(canvas, ctx, images) {
    super(canvas, ctx);
    this.#initBg(images);
    this.#createUI();
  }

  #initBg(images) {
    const randomSrc = images[Math.floor(Math.random() * images.length)];

    // Règle d'or : définir le callback AVANT la source
    this.#bgImage.onload = () => {
      this.#isLoaded = true;
    };

    this.#bgImage.onerror = () => {
      // Ici, c'est une vraie erreur critique
      console.error(
        "Erreur critique : Impossible de charger l'image",
        randomSrc,
      );
    };

    this.#bgImage.src = randomSrc;
  }

  #createUI() {
    try {
      // 1. Conteneur principal (Overlay)
      this.#uiElement = document.createElement("div");
      this.#uiElement.id = "ui-overlay";

      // 2. Boîte du menu
      const menuBox = document.createElement("div");
      menuBox.id = "main-menu";
      menuBox.className = "menu-box";

      // 3. Titre (Utilisation de textContent pour éviter l'injection)
      const title = document.createElement("h1");
      title.textContent = "TOWER DEFENSE CLICKER";

      // 4. Conteneur des boutons
      const btnContainer = document.createElement("div");
      btnContainer.className = "menu-buttons";

      // 5. Bouton JOUER
      const playBtn = document.createElement("button");
      playBtn.id = "btn-play";
      playBtn.className = "primary-btn";
      playBtn.textContent = "JOUER";

      // Gestion de l'événement directement sur l'élément (plus propre)
      playBtn.onclick = () => {
        document.dispatchEvent(new CustomEvent("start-game"));
      };

      // 6. Crédits
      const credits = document.createElement("p");
      credits.className = "credits";
      credits.textContent = "Projet Gamejam JS";

      // 7. Assemblage (Le "Composite" du DOM)
      btnContainer.appendChild(playBtn);

      menuBox.appendChild(title);
      menuBox.appendChild(btnContainer);
      menuBox.appendChild(credits);

      this.#uiElement.appendChild(menuBox);

      // 8. Injection finale dans le DOM
      const gameContainer = document.getElementById("game-container");
      if (!gameContainer) {
        throw new Error("Conteneur #game-container introuvable dans le DOM.");
      }
      gameContainer.appendChild(this.#uiElement);
    } catch (error) {
      // Gestion robuste des erreurs demandée par le cahier des charges
      console.error(
        `[UI Error] Échec de la création du menu : ${error.message}`,
      );
    }
  }

  onDestroy() {
    if (this.#uiElement) this.#uiElement.remove();
  }

  draw() {
    // if (!this.#isLoaded) {
    //   console.error("Image de fond non chargée");
    //   return;
    // }

    // Algorithme "Cover" Responsive
    const ratio = Math.max(
      this.canvas.width / this.#bgImage.width,
      this.canvas.height / this.#bgImage.height,
    );
    const w = this.#bgImage.width * ratio;
    const h = this.#bgImage.height * ratio;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(
      this.#bgImage,
      (this.canvas.width - w) / 2,
      (this.canvas.height - h) / 2,
      w,
      h,
    );
  }
}
