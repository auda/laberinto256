class Personaje {
  constructor(mapa) {
    this.mapa = mapa;
    this.fila = 0.5;
    this.columna = 0.5;
    this.altura = 0;
    this.direccion = 0;
    this.velocidadGiro = new VariableContinua(20);
    this.velocidad = new VariableContinua(20);
    this.capacidadSalto = 1;
    this.aceleracion = 0.03; //0.04;
    this.ancho = 5;
    this.largo = 5;
    this.alto = 5;
    this.mesh;
  }

  girarIzquierda() {this.velocidadGiro.cambiar(-this.aceleracion);}
  girarDerecha()   {this.velocidadGiro.cambiar(this.aceleracion);}
  avanzar()        {this.velocidad.cambiar(this.aceleracion);}
  retroceder()     {this.velocidad.cambiar(-this.aceleracion);}
  posicionXYZ()    {return this.mapa.posicionXYZ(this.fila, this.columna);}

  actualizar() {
    this.direccion += this.velocidadGiro.valor;

    var d_fila = this.velocidad.valor * Math.cos(this.direccion);
    var d_columna = this.velocidad.valor * Math.sin(this.direccion);

    var new_fila = this.fila + d_fila;
    var new_columna = this.columna + d_columna;

    var nueva = this.mapa.posicionXYZ(new_fila, new_columna);

    if (!this.puedeMover(nueva)) {
      var nuevaX = this.mapa.posicionXYZ(new_fila, this.columna);
      var nuevaZ = this.mapa.posicionXYZ(this.fila, new_columna);

      if (!this.puedeMover(nuevaX)) new_fila = this.fila;
      if (!this.puedeMover(nuevaZ)) new_columna = this.columna;
    }

    this.velocidad.actualizar();
    this.velocidadGiro.actualizar();
    this.actualizarPosicion(new_fila, new_columna);
    
  }

  puedeMover(destino) {
    var puntos = this.puntosContorno(destino);

    for (var i = 0; i < puntos.length; i++)
      if (!this.puedeSaltar(puntos[i])) return false;

    return true;
  }

  puedeSaltar(destino) {
    if (destino == -1) return false;

    var delta_y = Math.abs(destino.y - this.altura);
    if (delta_y > this.capacidadSalto) return false;

    return true;
  }

  actualizarPosicion(fila, columna) {
    var final = this.mapa.posicionXYZ(fila, columna);

    this.fila = fila;
    this.columna = columna;
    this.altura = final.y;

    this.mesh.position.x = final.x;
    this.mesh.position.y = final.y;
    this.mesh.position.z = final.z;
    this.mesh.rotation.y = -this.direccion;
  }

  puntosContorno(centro) {
    var puntos = new Array();

    var w = (this.ancho / this.mapa.tamCelda) / 2;
    var l = (this.largo / this.mapa.tamCelda) / 2;

    var f = centro.fila;
    var c = centro.columna;

    puntos.push(this.mapa.posicionXYZ(f + l, c + w));
    puntos.push(this.mapa.posicionXYZ(f + l, c - w));
    puntos.push(this.mapa.posicionXYZ(f - l, c + w));
    puntos.push(this.mapa.posicionXYZ(f - l, c - w));

    return puntos;
  }

  crear3D() {
    this.mesh = crearMallaJugador(this.ancho,this.alto,this.largo);
  }

  objetosEnContacto() {
    var contactados = new Array();
    var objetos = this.mapa.objetos;
    for (var i=0;i<objetos.length;i++)
        if (this.enContacto(objetos[i]))
          contactados.push(objetos[i]);

    return contactados;
  }

  enContacto(objeto) {
    var p0 = this.mapa.posicionXYZ(this.fila, this.columna);
    var p1 = objeto.posicion;
    var s0 = {l:this.largo,   w:this.ancho,   d:this.alto};
    var s1 = {l:objeto.largo, w:objeto.ancho, d:objeto.alto};

    if (p0.x+s0.w/2 > p1.x-s1.w/2 && 
        p0.x-s0.w/2 < p1.x+s1.w/2 && 
        p0.y+s0.d/2 > p1.y-s1.d/2 && 
        p0.y-s0.d/2 < p1.y+s1.d/2 && 
        p0.z+s0.l/2 > p1.z-s1.l/2 && 
        p0.z-s0.l/2 < p1.z+s1.l/2) 
        return true;

    return false;
  }
}

