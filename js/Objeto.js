
class Objeto {
  constructor (mapa, posicion, largo=5, ancho=5, alto=5){
    this.mapa = mapa;
    this.posicion  = posicion; 
    this.largo = largo;
    this.ancho = ancho;
    this.alto = alto;
    this.mesh;
  }

  crear3D() {
    this.mesh = crearCubo(this.posicion,this.largo,this.ancho,this.alto);
    return this.mesh;
  }

}

