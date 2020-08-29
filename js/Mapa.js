
import * as THREE from 'three';

import { Objeto } from "./Objeto"
import { Juego } from "./Juego"
import { Graficos } from "./Graficos"
 
class Mapa {
  constructor(juego, tamCelda) {
    this.juego = juego;
    this.alturas;
    this.filas;
    this.columnas;
    this.tamCelda = tamCelda;
    this.objetos = new Array();
    this.mesh;
    this.image = {estado:0};
  }

  cargar () {
/*
    this.alturas = new Array();
    for (var i=0;i<this.filas;i++){
        var fila = new Array();
        for (var j=0;j<this.columnas;j++)
            fila.push(this.image.data[(i*this.image.height+j)*4]);
        this.alturas.push(fila);
    }
*/
    this.alturas = [[1,2,3,4,5],
                    [16,17,18,19,6],    
                    [15,24,25,20,7],    
                    [14,23,22,21,8],    
                    [13,12,11,10,9],    
    ]

    this.filas = this.alturas.length;
    this.columnas = this.alturas[0].length;

    var posicion = this.posicionXYZ(2.5,2.5);
    var objeto = new Objeto(this, posicion);
    objeto.efecto = function() {
      this.mapa.juego.estado = 2;
    }
    this.objetos.push(objeto);
    return true;
  }

  crearAlturasAleatorias(alturaMaxima) {
    this.alturas = new Array();

    for (var i = 0; i < this.filas; i++) {
      var fila = new Array();

      for (var j = 0; j < this.columnas; j++)
        fila[j] = Math.floor(Math.random() * alturaMaxima);

      this.alturas[i] = fila;
    }
  }

  posicionXYZ(fila, columna) {
    if (
      fila < 0 ||
      fila >= this.filas ||
      columna < 0 ||
      columna >= this.columnas
    )
      return -1;

    var f = Math.floor(fila);
    var c = Math.floor(columna);

    var x = fila * this.tamCelda - (this.tamCelda * this.columnas) / 2;
    var y = this.alturas[f][c];
    var z = columna * this.tamCelda - (this.tamCelda * this.filas) / 2;

    return { x: x, y: y, z: z, fila: fila, columna: columna };
  }

  crear3D() {
    var group = new THREE.Group();

    if (Juego.configuracion.verCentroMapa)
       group.add(crearEjeY());

    // creamos las celdas
    for (var i = 0; i < this.filas; i++) {
      for (var j = 0; j < this.columnas; j++) {
        var posicion = this.posicionXYZ(i + 0.5, j + 0.5);

        var obj = Graficos.crearCelda(this.tamCelda, posicion.y);
        obj.position.x = posicion.x;
        obj.position.z = posicion.z;
        obj.matrixAutoUpdate = false;
        obj.updateMatrix();

        group.add(obj);
      }
    }

    // creamos los objetos
    for (var i=0;i<this.objetos.length;i++) {
      var obj = this.objetos[i].crear3D();
      group.add(obj);
    }


    var obj = Graficos.crearSprite('llave', this.objetos[0].posicion, 5);
    group.add(obj);

   this.mesh = group;
  }
 
  actualizar() {
    /*
      this.t+=.05;
      var s = this.meshDestino.scale;
      var ancho = 5*Math.sin(this.t);    
      this.meshDestino.scale.set(ancho,s.y,s.z);    
    */
  }


}


export {Mapa};