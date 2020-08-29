
class Juego {
  constructor(escena) {
    this.estado = 0;
    this.escena = escena;
    this.mapa = new Mapa(this, 10);
    this.jugador = new Personaje(this.mapa);    
  }

  actualizar() {
    switch (this.estado) {
      case 0:   
        if (!this.mapa.cargar())
           return;

        this.mapa.crear3D();
        this.jugador.crear3D();
        this.escena.add(this.mapa.mesh);
        this.escena.add(this.jugador.mesh);
        this.estado = 1;
        break;

      case 1: 
        actualizarEntrada();
        this.mapa.actualizar();
        this.jugador.actualizar();
        var objetos = this.jugador.objetosEnContacto();
        for (var i=0;i<objetos.length;i++)
          objetos[i].efecto();
        actualizarCamara();
        render();
        break;

      case 2:
        this.escena.remove(this.mapa.mesh);
        this.escena.remove(this.jugador.mesh);
        this.mapa = new Mapa(this, 10);
        this.jugador = new Personaje(this.mapa);    
        this.estado = 0;
        break;
    }    
  }
}

