
class Teclado {
  constructor () {

  }

  static init(){
    window.addEventListener('keydown', this.onKeyDown, false);
    window.addEventListener('keyup', this.onKeyUp, false);
  }

  static onKeyUp(event)   {this.tecla[event.keyCode] = 0;}
  static onKeyDown(event) {this.tecla[event.keyCode] = 1;}

}

Teclado.tecla = new Array();



export { Teclado };
