import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { Carrito } from 'src/app/modules/carrito';
import { AlertServiceService } from 'src/app/services/alert-service.service';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { ToastServiceService } from 'src/app/services/toast-service.service';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
})
export class CarritoPage implements OnInit {

 
  listaCarrito : Carrito[] = [];
  totalCarrito!: number; // Variable para almacenar el total del carrito
  idusuario!: number;
  infoUsuario: any = [];

  constructor(
    private router: Router, 
    private storage : NativeStorage,
    private bd: ServicebdService,
    private activaterouter: ActivatedRoute, 
    private alerta: AlertServiceService,
    private toast: ToastServiceService)
  {

  }

  ngOnInit() {
    this.storage.getItem('usuario_logueado').then((idUsuario) => {
      if (idUsuario) {
        console.log('ID del usuario logueado:', idUsuario);
        this.idusuario = idUsuario;
  
        this.bd.mostrarCarrito(this.idusuario).then(() => {
          this.bd.fetchCarrito().subscribe(data => {
            this.listaCarrito = data;
            this.calcularTotalCarrito(); // Calcula el total después de actualizar
          });
        });
  
        this.bd.traerUsuario(this.idusuario).then(data => {
          this.infoUsuario = data;
          console.log('Usuario:', this.infoUsuario.usuario); // Log para verificar los datos
          console.log('Correo:', this.infoUsuario.correo_usuario);
        }).catch(e => {
          console.error('Error obteniendo usuario:', e);
        });
      }
    }).catch(e => {
      this.alerta.GenerarAlerta('Error', 'No se pudo obtener el usuario logueado: ' + JSON.stringify(e));
    });
  }
  
  
 
  calcularTotalCarrito() {
    this.totalCarrito = this.listaCarrito.reduce((acc, album) => {
      return acc + album.precio_album * album.cantidad;
    }, 0);
  }

  aceptarCompra() {
    this.storage.getItem('usuario_logueado').then(async (idUsuario: any) => {
      if (!idUsuario) {
        this.alerta.GenerarAlerta('Error', 'No hay un usuario logueado.');
        return;
      }
  
      try {
        await this.bd.registrarVenta(idUsuario, this.totalCarrito, this.listaCarrito);
  
        // Emitir evento de cambio de stock
        this.bd.emitirCambioStock();
  
        this.router.navigate(['/boleta'], {
          state: {
            usuario: this.infoUsuario,
            total: this.totalCarrito,
            albums: this.listaCarrito
          }
        });
  
        await this.bd.vaciarCarrito(idUsuario);
        console.log('Carrito vaciado exitosamente.');
        this.toast.GenerarToast('Su compra fue realizada con éxito', 1000, 'middle');
      } catch (e) {
        this.alerta.GenerarAlerta('Error', 'Error al procesar la compra: ' + JSON.stringify(e));
      }
    }).catch(e => {
      this.alerta.GenerarAlerta('Error', 'No se pudo obtener el usuario logueado: ' + JSON.stringify(e));
    });
  }
  
  
  
  

  eliminarCarrito(album: any) {
    this.bd.eliminarCarrito(album.id_carrito).then(() => {
      this.toast.GenerarToast('Artículo borrado perfectamente', 1000, 'middle');
      
      // Llamada correcta a mostrarCarrito con el ID del usuario
      this.bd.mostrarCarrito(this.idusuario).then(() => {
        this.calcularTotalCarrito(); // Recalcula el total después de eliminar
      });
    }).catch(e => {
      this.alerta.GenerarAlerta('Error', 'Error al eliminar el artículo: ' + JSON.stringify(e));
    });
  }
  

  calcularTotal(precio: number, cantidad: number): number {
    return precio * cantidad;
  }
  
  sumar(album: any){
    album.cantidad++;
    this.bd.actualizarCantidad(album.cantidad,album.id_carrito)
    this.calcularTotalCarrito(); // Recalcula el total después de sumar
  }

  restar(album: any){
    if (album.cantidad > 1) {
      album.cantidad--;
      this.bd.actualizarCantidad(album.cantidad,album.id_carrito)
      this.calcularTotalCarrito(); // Recalcula el total después de sumar
    }
  }


  irHome() {
    this.router.navigate(['/home']);
  }

}


//NO MAS COTROL Z
//VACIA EL CARRITO Y FUNCIONA LA BOLETA NO CTRL Z
//SI TE ARREPIENTES BORA HASTA ACA