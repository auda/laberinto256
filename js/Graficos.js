
import * as THREE from 'three';
import { Juego } from "./Juego";

class Recursos {}
Recursos.pj = "https://raw.githubusercontent.com/auda/laberinto256/master/resources/pj.png";
Recursos.llave = "https://raw.githubusercontent.com/auda/laberinto256/master/resources/llave.png";
Recursos.pj2 = "https://raw.githubusercontent.com/auda/laberinto256/master/resources/character.png";


class Animacion {
  constructor (texture, hTiles, vTiles, durationTile) {
    this.currentTile = 0;
    this.durationTile = durationTile;
    this.currentTime = 0;
    this.hTiles = hTiles;
    this.vTiles = vTiles;
    this.cntTiles = this.hTiles * this.vTiles;
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1 / this.hTiles, 1 / this.vTiles);
  }

  update(time) {
    this.currentTime += time;
    while (this.currentTime > this.durationTile) {
      this.currentTime -= this.durationTile;
      this.currentTile++;

      if (this.currentTile == this.cntTiles)
        this.currentTile = 0;

      var iColumn = this.currentTile % this.hTiles;
      texture.offset.x = iColumn / this.hTiles;
      var iRow = Math.floor(this.currentTile / this.hTiles);
      texture.offset.y = iRow / this.vTiles;
    }
  }

}


class Graficos { 
  constructor() {}

  static init() {
    var width = window.innerWidth - 20;
    var height = window.innerHeight - 20;
    if (Graficos.renderer == null) {
      Graficos.camera = new THREE.PerspectiveCamera(60, width / height, 1, 10000);
      Graficos.scene = new THREE.Scene();
      //scene.background = new THREE.Color(0x2b2b2b);
      //scene.fog = new THREE.Fog(0x2b2b2b, 1, 10000);

      Graficos.renderer = new THREE.WebGLRenderer({ antialias: false });
      Graficos.renderer.setPixelRatio(window.devicePixelRatio);
      Graficos.renderer.setSize(width, height);
      document.body.appendChild(Graficos.renderer.domElement);
      window.addEventListener('resize', Graficos.onWindowResize, false);
    }
  }

  static onWindowResize() {
    var width = window.innerWidth - 20;
    var height = window.innerHeight - 20;
    Graficos.camera.aspect = width / height;
    Graficos.camera.updateProjectionMatrix();
    Graficos.renderer.setSize(width, height);
  }

  static render() {
    Graficos.renderer.render(Graficos.scene, Graficos.camera);
  }





  static crearReferencia(size) {
    var group = new THREE.Group();

    var g = new THREE.BoxBufferGeometry(size, size, size);
    var m = new THREE.MeshBasicMaterial({ color: 0xffffff });
    var obj = new THREE.Mesh(g, m);
    group.add(obj);

    return group;
  }


  static crearMallaJugador(ancho,alto,largo) {
    var group = new THREE.Group();

    if (Juego.configuracion.verDireccion) {
      var g = new THREE.BoxBufferGeometry(0.1, 4, 0.1);
      g.translate(0, 2, 0);
      g.rotateZ(-Math.PI / 2);
      var m = new THREE.MeshBasicMaterial({ color: 0xffffff });
      var obj = new THREE.Mesh(g, m);
      group.add(obj);
    }

    if (Juego.configuracion.verCuadrado) {
      var g = new THREE.BoxBufferGeometry(ancho, alto, largo);
      g.translate(0, alto / 2, 0);
      //g.rotateZ( -Math.PI / 2 );
      var m = new THREE.MeshBasicMaterial({ color: 0xff00ff });
      var obj = new THREE.Mesh(g, m);
      group.add(obj);
    }

    if (Juego.configuracion.verMalla) {
      var g = new THREE.BoxBufferGeometry(ancho, alto, largo);
      var wireframe = new THREE.WireframeGeometry(g);
      var line = new THREE.LineSegments(wireframe);
      line.material.depthTest = true;
      line.material.opacity = 1;
      line.material.transparent = true;
      line.translateY(alto / 2);
      group.add(line);
    }

    if (Juego.configuracion.verMuneco) {
      var spriteMap = new THREE.TextureLoader().load(Recursos.pj2);
      spriteMap.magFilter = THREE.NearestFilter;
      spriteMap.minFilter = THREE.LinearFilter;

      var spriteMaterial = new THREE.SpriteMaterial({ map: spriteMap });
      var sprite = new THREE.Sprite(spriteMaterial);
      sprite.scale.set(largo, alto, ancho);
      sprite.translateY(alto / 2);
      group.add(sprite);
      group.texture = spriteMap;
    }

    return group;
  }



  static crearCelda(tamCelda,h) {
    var celda = new THREE.Group();

    if (Juego.configuracion.verCentro) {
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


  static crearEjeY() {
    var g = new THREE.BoxBufferGeometry(0.1, 30, 0.1);
    g.translate(0, 15, 0);
    var m = new THREE.MeshBasicMaterial({ color: 0xffffff });
    var obj = new THREE.Mesh(g, m);
    return obj;   
  }


  static crearSprite(nombre, posicion, escala) {
    var spriteMap = new THREE.TextureLoader().load(Recursos[nombre]);
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

  static crearCubo(posicion, largo, ancho, alto) {
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

}

Graficos.camera = null;
Graficos.scene = null;
Graficos.renderer = null;

export {Graficos};
export {Animacion};

