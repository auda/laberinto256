import * as THREE from 'three';

import { Mapa } from "./Mapa";
import { Objeto } from "./Objeto";
import { Personaje } from "./Personaje";
import { VariableContinua } from "./Utils";
import { Teclado } from "./Teclado";
import { Graficos } from "./Graficos";

class Juego {
  constructor() {
    this.estado = 0;
    this.clock = new THREE.Clock();
    this.mapa = new Mapa(this, 10);
    this.jugador = new Personaje(this.mapa);    
  }

  actualizar() {
    var delta = this.clock.getDelta();
    switch (this.estado) {
      case 0:   
        Graficos.init();
        Teclado.init();
        this.mapa.cargar();
        this.mapa.crear3D();
        this.jugador.crear3D();
        Graficos.scene.add(this.mapa.mesh);
        Graficos.scene.add(this.jugador.mesh);
        this.estado = 1;
        break;

      case 1: 
        this.actualizarEntrada();
        this.mapa.actualizar();
        this.jugador.actualizar(delta);
        var objetos = this.jugador.objetosEnContacto();
        for (var i=0;i<objetos.length;i++)
          objetos[i].efecto();
        this.actualizarCamara();
        Graficos.render();    
        break;

      case 2:
        Graficos.scene.remove(this.mapa.mesh);
        Graficos.scene.remove(this.jugador.mesh);
        this.mapa = new Mapa(this, 10);
        this.jugador = new Personaje(this.mapa);    
        this.estado = 0;
        break;
    }    
  }

  actualizarEntrada() {
    if (Teclado.tecla[37])  this.jugador.girarIzquierda();
    if (Teclado.tecla[39])  this.jugador.girarDerecha();
    if (Teclado.tecla[38])  this.jugador.avanzar();
    if (Teclado.tecla[40])  this.jugador.retroceder();
  }


  actualizarCamara() {
    var tipoCamara = 2;
    var jugador = this.jugador;
    var posicion = jugador.posicionXYZ();

    if (tipoCamara == 0) {
      var distancia = 20;
      var delta_x = distancia * Math.cos(-jugador.direccion + Math.PI);
      var delta_y = distancia + posicion.y;
      var delta_y = posicion.y;
      var delta_z = distancia * Math.sin(+jugador.direccion - Math.PI);

      var new_dx = posicion.x + delta_x;
      var new_dy = posicion.y + delta_y;
      var new_dz = posicion.z + delta_z;
    } 
    else if (tipoCamara == 1) {
      var distancia = 100;

      var new_dx = 0;
      var new_dy = distancia;
      var new_dz = 0;

      Graficos.camera.lookAt(new THREE.Vector3(0, 0, 0));
    } 
    else if (tipoCamara == 2) {
      var distancia = 60;
      var delta_x = distancia * Math.cos(-jugador.direccion + Math.PI);
      var delta_y = distancia/2+posicion.y;
      var delta_z = distancia * Math.sin(+jugador.direccion - Math.PI);

      var new_dx = posicion.x + delta_x;
      var new_dy = delta_y;
      var new_dz = posicion.z + delta_z;

      Graficos.camera.lookAt(new THREE.Vector3(posicion.x, posicion.y, posicion.z));
    }

    Graficos.camera.position.x = new_dx;
    Graficos.camera.position.y = new_dy;
    Graficos.camera.position.z = new_dz;
  }

}

Juego.configuracion = {
  verCentroMapa:  false,
  verCentro:      false,
  verMuneco:      true,
  verCuadrado:    false,
  verDireccion:   false,
  verMalla:       false
  };


export { Juego };


