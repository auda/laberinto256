
function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}


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


export { VariableContinua };
