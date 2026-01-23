Brouillon support

Map :

- Chemin tracé
- Un point d'entrée
- Un point de sortie
- Emplacements de tours libre

...............

Entités :

- Classe abstraite Entité(hp, speed, value, positions, sprite) :
  - pathFollowing() → Savoir où aller et le faire avancer
  - dismiss() → Fait disparaître l'entité si 0 hp et ajoute value a score
  - collisionWith(this) → "this" perd de la vie
  - isAlive → (à vérifier si vrm utile)

...............

Clicker :

- Objet cliquable
- EventListener → on click + ressources

...............

Game :

- Compte les rounds
- HiddenDifficultyScore → base de point initiale
- Affiche et stocke le score
- Object qui gère la valeur initial de HiddenDifficultyScore en fonction de la diff choisie
- fonction qui contient le nombre de mob à spawn par round
- round() → gère le round :
  → génère aléatoirement les mobs par rapport au HiddenDifficultyScore
  → si plus de ballon → round suivant
  → newRound() = HiddenDifficultyScore \* coef (constante à définir)
- endgame() → affiche un écran de game over et gère les éléments affichés (à définir plus tard)
- Affiche le clicker
- Affiche la map → qui stocke les différentes tours que l'on créé

...............

Écran d'accueil :

- Premier affichage → bouton play + fond
- Sélection de la map
- Sélection de la difficulté
- Paramètre (bonus)

...............

Tour :

- Classe abstraite Tower(projectile, fireRate, range, types, positions, passive (bonus), sprite) :
  → attack() :
  - si mob dans range
    → toute les 1/fireRate seconde = appelle méthode projectile

...............

Projectile :

---

Brouillon idées :

- res1 → généré par les kills de mob → build tour
- res2 → génère par des clicks → amélioration

td clicker craft personalisation de tourelle

- aspect clicker → boost de stat lent sur tes tours
- aspect td → matériel pour craft tour drop par les ennemies

- savestate pour faciliter la présentation

- invisibility state (bonus)

- map 2 / aléatoire (bonus prioritaire)

- emplacement de tour libre sauf chemin

- système de plusieurs ressources avec arbre de craft (bonus)

- attribut path qui nous permet de gérer la le free placement

- 2 types de ressources :
  → kill mobs = pièces
  → clicker = ressources

- 3 tours :
  → Monocible
  → Splash
  → Générateur
  → Ligne (bonus)

- Idle pour clicker

- répertoire des différentes entitées

---

Ressources utiles :

spriters-ressource.com
rpgmakervx-fr.com
