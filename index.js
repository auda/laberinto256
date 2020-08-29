
import { Juego } from "./js/Juego";

var juego = new Juego();
juego.actualizar();

loop();

function loop() {
  requestAnimationFrame(loop);
  juego.actualizar();
}




