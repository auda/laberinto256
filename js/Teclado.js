
class Teclado {
  constructor () {

  }

  static init(){
    window.addEventListener('keydown', Teclado.onKeyDown, false);
    window.addEventListener('keyup', Teclado.onKeyUp, false);
  }

  static onKeyUp(event)   {Teclado.tecla[event.keyCode] = 0;}
  static onKeyDown(event) {Teclado.tecla[event.keyCode] = 1;}

}

Teclado.tecla = new Array();



export { Teclado };
