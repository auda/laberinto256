
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

