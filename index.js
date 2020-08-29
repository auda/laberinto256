
import { Juego } from "./js/Juego";

var juego = new Juego();

loop();

function loop() {
  requestAnimationFrame(loop);
  juego.actualizar();
}




