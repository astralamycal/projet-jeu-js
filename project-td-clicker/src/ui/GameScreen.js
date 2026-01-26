import mapImage from "../../public/assets/map.png";

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 480;
canvas.height = 320;

const img = new Image();
console.log(mapImage);
img.src = mapImage;
img.addEventListener("load", () => c.drawImage(img, 0, 0));
