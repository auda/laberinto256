
class VariableContinua {
  constructor(pasos) {
     this.pasos = pasos;
     this.valor = 0;
     this.x = -1;
     this.a = 0;
   }  

  cambiar(valor){
     if (this.x == -1) {
       this.a = valor;
       this.paso = Math.PI/this.pasos;
       this.x = 0;
     }
     else {
       if (Math.sign(valor) == Math.sign(this.a)) {
         if (this.x<this.pasos/2) return;
         this.a = valor;
         this.x = Math.floor(this.pasos/2);
       }
     }
  }

  actualizar() {
    if (this.x == -1) return;

    this.valor = this.a*Math.sin(this.x*this.paso);

    this.x++;
    if (this.x >= this.pasos) {
      this.x = -1;
      this.valor = 0;
    }
  }   
}


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
    console.log(this.image.estado);
    if (this.image.estado == 0) {
      var image = new Image();
      image.mapa = this;
      image.src = 'assets/mapa.png';
      image.setAttribute('crossOrigin', '');
      image.onload = function() {
          var canvas = document.createElement('canvas');
          canvas.width = image.width;
          canvas.height = image.height;
          var context = canvas.getContext('2d');

          context.drawImage(image, 0, 0);
          this.mapa.image.data = context.getImageData(0, 0, image.width, image.height).data;
          this.mapa.image.width = image.width;
          this.mapa.image.height = image.height;
          this.mapa.image.estado = 2;
          }
      this.image.estado = 1;
      return false;
    }
    else if (this.image.estado == 1)
      return false;

    console.log(this.image.estado);

    this.filas = 5;
    this.columnas = 5;
/*
    this.alturas = new Array();
    for (var i=0;i<this.filas;i++){
        var fila = new Array();
        for (var j=0;j<this.columnas;j++)
            fila.push(this.image.data[(i*this.image.height+j)*4]);
        this.alturas.push(fila);
    }
*/
    this.alturas = [[25,2,3,4,5],
                    [16,17,18,19,6],    
                    [15,24,25,20,7],    
                    [14,23,22,21,8],    
                    [13,12,11,10,9],    
    ]

    console.log(this.filas+"x"+this.columnas);
    //this.crearAlturasAleatorias(1);

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

    if (config.verCentroMapa)
       group.add(crearEjeY());

    // creamos las celdas
    for (var i = 0; i < this.filas; i++) {
      for (var j = 0; j < this.columnas; j++) {
        var posicion = this.posicionXYZ(i + 0.5, j + 0.5);

        var obj = crearCelda(this.tamCelda, posicion.y);
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


    var obj = crearSprite('llave', this.objetos[0].posicion, 5);
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



var config = {
  verCentroMapa:  false,
  verCentro:      false,
  verMuneco:      true,
  verCuadrado:    false,
  verDireccion:   false,
  verMalla:       false
  };


var camera, scene, renderer;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var teclado = new Array();
var juego;

init();
animate();


function init() {
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
  scene = new THREE.Scene();
  //scene.background = new THREE.Color(0x2b2b2b);
  //scene.fog = new THREE.Fog(0x2b2b2b, 1, 10000);

  renderer = new THREE.WebGLRenderer({ antialias: false });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  
  juego = new Juego(scene);

  window.addEventListener('resize', onWindowResize, false);
  window.addEventListener('keydown', onKeyDown, false);
  window.addEventListener('keyup', onKeyUp, false);
}

function animate() {
  requestAnimationFrame(animate);
  juego.actualizar();
}

function render() {renderer.render(scene, camera);}


function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function actualizarEntrada() {
  if (teclado[37])  juego.jugador.girarIzquierda();
  if (teclado[39])  juego.jugador.girarDerecha();
  if (teclado[38])  juego.jugador.avanzar();
  if (teclado[40])  juego.jugador.retroceder();
}

function onKeyUp(event)   {teclado[event.keyCode] = 0;}
function onKeyDown(event) {teclado[event.keyCode] = 1;}

function actualizarCamara() {
  var tipoCamara = 2;
  var jugador = juego.jugador;
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

    camera.lookAt(new THREE.Vector3(0, 0, 0));
  } 
  else if (tipoCamara == 2) {
    var distancia = 80;
    var delta_x = distancia * Math.cos(-jugador.direccion + Math.PI);
    var delta_y = distancia/2+posicion.y;
    var delta_z = distancia * Math.sin(+jugador.direccion - Math.PI);

    var new_dx = posicion.x + delta_x;
    var new_dy = delta_y;
    var new_dz = posicion.z + delta_z;

    camera.lookAt(new THREE.Vector3(posicion.x, posicion.y, posicion.z));
  }

  camera.position.x = new_dx;
  camera.position.y = new_dy;
  camera.position.z = new_dz;
}



function crearReferencia(size) {
  var group = new THREE.Group();

  var g = new THREE.BoxBufferGeometry(size, size, size);
  var m = new THREE.MeshBasicMaterial({ color: 0xffffff });
  var obj = new THREE.Mesh(g, m);
  group.add(obj);

  return group;
}


function crearMallaJugador(ancho,alto,largo) {
  var group = new THREE.Group();

  if (config.verDireccion) {
    var g = new THREE.BoxBufferGeometry(0.1, 4, 0.1);
    g.translate(0, 2, 0);
    g.rotateZ(-Math.PI / 2);
    var m = new THREE.MeshBasicMaterial({ color: 0xffffff });
    var obj = new THREE.Mesh(g, m);
    group.add(obj);
  }

  if (config.verCuadrado) {
    var g = new THREE.BoxBufferGeometry(ancho, alto, largo);
    g.translate(0, alto / 2, 0);
    //g.rotateZ( -Math.PI / 2 );
    var m = new THREE.MeshBasicMaterial({ color: 0xff00ff });
    var obj = new THREE.Mesh(g, m);
    group.add(obj);
  }

  if (config.verMalla) {
    var g = new THREE.BoxBufferGeometry(ancho, alto, largo);
    var wireframe = new THREE.WireframeGeometry(g);
    var line = new THREE.LineSegments(wireframe);
    line.material.depthTest = true;
    line.material.opacity = 1;
    line.material.transparent = true;
    line.translateY(alto / 2);
    group.add(line);
  }

  if (config.verMuneco) {
    var spriteMap = new THREE.TextureLoader().load('assets/pj.png');
    spriteMap.magFilter = THREE.NearestFilter;
    spriteMap.minFilter = THREE.LinearFilter;

    var spriteMaterial = new THREE.SpriteMaterial({ map: spriteMap });
    var sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(largo, alto, ancho);
    sprite.translateY(alto / 2);
    group.add(sprite);
  }

  return group;
}



function crearCelda(tamCelda,h) {
  var celda = new THREE.Group();

  if (config.verCentro) {
    var g = new THREE.BoxBufferGeometry(0.1, 4, 0.1);
    g.translate(0, h + 2, 0);
    var m = new THREE.MeshBasicMaterial({ color: 0xffffff });
    var obj = new THREE.Mesh(g, m);
    celda.add(obj);
  }
 
  var g = new THREE.PlaneBufferGeometry(tamCelda, tamCelda);
  var wireframe = new THREE.WireframeGeometry(g);
  var line = new THREE.LineSegments(wireframe);
  line.material.depthTest = true;
  line.material.opacity = 1;
  line.material.transparent = true;
  line.translateY(h + 0.1);
  line.rotateX(-Math.PI / 2);
  celda.add(line);

  var g = new THREE.PlaneBufferGeometry(tamCelda, tamCelda);
  g.rotateX(-Math.PI / 2);
  g.translate(0, h, 0);
  var m = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  var obj = new THREE.Mesh(g, m);
  celda.add(obj);

  var g = new THREE.PlaneBufferGeometry(tamCelda, h);
  g.translate(0, h / 2, tamCelda / 2);
  var m = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  var obj = new THREE.Mesh(g, m);
  celda.add(obj);

  var g = new THREE.PlaneBufferGeometry(tamCelda, h);
  g.rotateY(Math.PI);
  g.translate(0, h / 2, -tamCelda / 2);
  var m = new THREE.MeshBasicMaterial({ color: 0xffffff });
  var obj = new THREE.Mesh(g, m);
  celda.add(obj);

  var g = new THREE.PlaneBufferGeometry(tamCelda, h);
  g.rotateY(Math.PI / 2);
  g.translate(tamCelda / 2, h / 2, 0);
  var m = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  var obj = new THREE.Mesh(g, m);
  celda.add(obj);

  var g = new THREE.PlaneBufferGeometry(tamCelda, h);
  g.rotateY(-Math.PI / 2);
  g.translate(-tamCelda / 2, h / 2, 0);
  var m = new THREE.MeshBasicMaterial({ color: 0xff00ff });
  var obj = new THREE.Mesh(g, m);
  celda.add(obj);

  return celda;
}


function crearEjeY() {
   var g = new THREE.BoxBufferGeometry(0.1, 30, 0.1);
   g.translate(0, 15, 0);
   var m = new THREE.MeshBasicMaterial({ color: 0xffffff });
   var obj = new THREE.Mesh(g, m);
   return obj;   
}


function crearSprite(nombre, posicion, escala) {
  var spriteMap = new THREE.TextureLoader().load('assets/'+nombre+'.png');
  spriteMap.magFilter = THREE.NearestFilter;
  spriteMap.minFilter = THREE.LinearFilter;

  var spriteMaterial = new THREE.SpriteMaterial({ map: spriteMap });
  var sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(escala,escala,escala);
  sprite.position.x = posicion.x;
  sprite.position.y = posicion.y+escala/2;
  sprite.position.z = posicion.z;

  return sprite;
}

function crearCubo(posicion, largo, ancho, alto) {
  var group = new THREE.Group();

  //console.log(posicion);
/*
  var g = new THREE.BoxBufferGeometry(ancho, alto, largo);
  g.translate(posicion.x, posicion.y+alto / 2, posicion.z);
  var m = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  var obj = new THREE.Mesh(g, m);
  group.add(obj);
*/

  var g = new THREE.BoxBufferGeometry(ancho, alto, largo);
  var wireframe = new THREE.WireframeGeometry(g);
  var line = new THREE.LineSegments(wireframe);
  line.material.depthTest = true;
  line.material.opacity = 1;
  line.material.transparent = false;
  line.translate(posicion.x, posicion.y+alto / 2, posicion.z);
  line.position.x = posicion.x;
  line.position.y = posicion.y + alto/2;
  line.position.z = posicion.z;

  group.add(line); 

  return group;
}


function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}