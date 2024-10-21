import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { ServicebdService } from 'src/app/services/servicebd.service';

@Component({
  selector: 'app-boleta',
  templateUrl: './boleta.page.html',
  styleUrls: ['./boleta.page.scss'],
})
export class BoletaPage implements OnInit {

  infoUsuario: any = {};
  totalCarrito!: number;
  albumsComprados: any[] = [];
  idusuario!: number;


  constructor(private router: Router, private bd: ServicebdService, private storage : NativeStorage) {
    const nav = this.router.getCurrentNavigation();
    if (nav && nav.extras.state) {
      this.infoUsuario = nav.extras.state['usuario'] || {};  // Uso con corchetes
      this.totalCarrito = nav.extras.state['total'];
      this.albumsComprados = nav.extras.state['albums'] || {};

      console.log('Total en la boleta:', this.totalCarrito);
    }
    
  }

  ngOnInit() {
    this.obtenerIdUsuario()
    //this.bd.vaciarCarrito(this.idusuario)
  }


  async obtenerIdUsuario() {
  try {
    const usuario = await this.storage.getItem('usuario_logueado');
    if (usuario && usuario.id_usuario) {
      this.idusuario = usuario.id_usuario;
      console.log('ID Usuario obtenido:', this.idusuario); // Verificar el ID obtenido
    } else {
      console.error('No se pudo obtener el ID del usuario');
    }
  } catch (error) {
    console.error('Error al obtener el usuario logueado:', error);
  }
}



  volverAlInicio() {
    this.router.navigate(['/home']);
  }

}

// VACIA EL CARRITO Y FUNCIONA LA BOLETA NO CTRL Z