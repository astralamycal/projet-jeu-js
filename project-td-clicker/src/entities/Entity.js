export class Entity {
  // ? TEMP set waypoint list until final map
  #waypoints = [
    { x: 400, y: 300 },
    { x: 0, y: 0 },
  ];

  #position = {
    x: 0,
    y: 0,
  };

  #size = {
    width: 10,
    height: 10,
  };

  #center = {
    x: null,
    y: null,
  };

  #waypointIndex = 0; // says which waypoint is tracked

  constructor(
    width,
    height,
    x = this.#waypoints[0].x,
    y = this.#waypoints[0].y,
  ) {
    if (typeof width === "number" && width > 0) {
      this.#size.width = width;
    } else {
      throw new Error("Width of entity must be a number greater than 0.");
    }

    if (typeof height === "number" && height > 0) {
      this.#size.height = height;
    } else {
      throw new Error("Height of entity must be a number greater than 0.");
    }

    if (typeof x === "number") {
      this.#position.x = x;
    } else if (typeof x !== "undefined") {
      throw new Error("X coordinate must be a number.");
    }

    if (typeof y === "number") {
      this.#position.y = y;
    } else if (typeof y !== "undefined") {
      throw new Error("Y coordinate must be a number");
    }
    this.#setCenter();
  }

  #setCenter() {
    this.#center.x = this.#position.x + this.#size.width / 2;
    this.#center.y = this.#position.y + this.#size.height / 2;
  }

  #draw(canvas) {
    canvas.fillStyle = "red";
    canvas.fillRect(
      this.#position.x,
      this.#position.y,
      this.#size.width,
      this.#size.height,
    );
  }

  update(canvas) {
    this.#draw(canvas);

    //pathfinding
    const waypoint = this.#waypoints[this.#waypointIndex];
    const yDistance = waypoint.y - this.#center.y;
    const xDistance = waypoint.x - this.#center.x;
    const angle = Math.atan2(yDistance, xDistance);

    this.#position.x += Math.cos(angle);
    this.#position.y += Math.sin(angle);

    this.#setCenter();

    //checks arrival towards waypoint
    if (
      Math.round(this.#center.x) === waypoint.x &&
      Math.round(this.#center.y) === waypoint.y
    ) {
      if (this.#waypointIndex < this.#waypoints.length - 1) {
        this.#waypointIndex++;
      } else {
        console.log("DAMAGE FUNCTION"); // ? call damage function here
      }
    }
  }
}
