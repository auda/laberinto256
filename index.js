





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


