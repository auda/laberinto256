
import * as THREE from 'three';
import { Juego } from "./Juego";

class Recursos {}
Recursos.pj = "https://raw.githubusercontent.com/auda/laberinto256/master/resources/pj.png";
Recursos.llave = "https://raw.githubusercontent.com/auda/laberinto256/master/resources/llave.png";

class Graficos { 
  constructor() {}

  static init() {
    Graficos.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
    Graficos.scene = new THREE.Scene();
    //scene.background = new THREE.Color(0x2b2b2b);
    //scene.fog = new THREE.Fog(0x2b2b2b, 1, 10000);

    Graficos.renderer = new THREE.WebGLRenderer({ antialias: false });
    Graficos.renderer.setPixelRatio(window.devicePixelRatio);
    Graficos.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(Graficos.renderer.domElement);
    window.addEventListener('resize', Graficos.onWindowResize, false);
  }

  static onWindowResize() {
    Graficos.camera.aspect = window.innerWidth / window.innerHeight;
    Graficos.camera.updateProjectionMatrix();
    Graficos.renderer.setSize(window.innerWidth, window.innerHeight);
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
      var spriteMap = new THREE.TextureLoader().load(Recursos.pj);
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


