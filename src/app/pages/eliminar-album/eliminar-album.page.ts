import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { ToastServiceService } from 'src/app/services/toast-service.service';

@Component({
  selector: 'app-eliminar-album',
  templateUrl: './eliminar-album.page.html',
  styleUrls: ['./eliminar-album.page.scss'],
})
export class EliminarAlbumPage implements OnInit {

  albums: any [] = [];
  

  constructor(private router: Router, private toast: ToastServiceService, private bd: ServicebdService) { }

  validacion() {
    this.toast.GenerarToast('Álbum eliminado', 1000, 'middle');
  }

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.bd.consultarProducto();
    this.bd.dbState().subscribe(res => {
      if (res) {
        this.bd.fetchProducto().subscribe(data => {
          this.albums = data;
        });
      }
    });
  }

  eliminarAlbum(id_album: number) {
    this.bd.eliminarProducto(id_album).then(res => {
      if (res) {
        // Actualizar la lista de álbumes después de la eliminación
        this.albums = this.albums.filter(album => album.id_album !== id_album);
        // Mostrar el toast de validación
        this.validacion();  // Aquí se llama al toast para que se muestre
      }
    }).catch(err => {
      console.log('Error al eliminar el álbum:', err);
    });
  }

}
//NO MAS COTROL Z