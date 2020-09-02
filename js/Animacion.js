
class Animacion {
  constructor (texture, secuencias) {
    this.currentTile = 0;
    this.durationTile = texture.velocidad;
    this.currentTime = 0;
    this.hTiles = texture.columnas;
    this.vTiles = texture.filas;
    this.cntTiles = this.hTiles * this.vTiles;
    this.texture = texture;
    this.texture.wrapS = this.texture.wrapT = THREE.RepeatWrapping;
    this.texture.repeat.set(1 / this.hTiles, 1 / this.vTiles);
    this.secuencias = secuencias;
  }

  update(time) {
    this.currentTime += time;
    while (this.currentTime > this.durationTile) {
      this.currentTime -= this.durationTile;
      this.currentTile++;

      if (this.currentTile == this.cntTiles)
        this.currentTile = 0;

      var iColumn = this.currentTile % this.hTiles;
      this.texture.offset.x = iColumn / this.hTiles;
      var iRow = Math.floor(this.currentTile / this.hTiles);
      this.texture.offset.y = iRow / this.vTiles;
    }
  }

}