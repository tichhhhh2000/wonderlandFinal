import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertServiceService } from 'src/app/services/alert-service.service';
import { CamaraService } from 'src/app/services/camara.service';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { ToastServiceService } from 'src/app/services/toast-service.service';

@Component({
  selector: 'app-modificar-album',
  templateUrl: './modificar-album.page.html',
  styleUrls: ['./modificar-album.page.scss'],
})
export class ModificarAlbumPage implements OnInit {

  nombreArtista: string = 'BTS';
  nombreAlbum: string = 'Wings';
  precio: number = 21990;
  portadaAlbum: string | null = null;
  stock: number = 20;
  albums: any [] = [];

  imagenSeleccionada: string = ''; // Variable para almacenar la imagen seleccionada

  constructor(private router: Router, private alerta: AlertServiceService, private toast: ToastServiceService, private bd: ServicebdService, private camera: CamaraService) { }

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.bd.consultarProducto();
    this.bd.dbState().subscribe(res => {
      this.bd.fetchProducto().subscribe(data => {
        this.albums = data.map(album => ({
          ...album,
          stock: album.stock || 0  // Inicializa el stock si es nulo o indefinido
        }));
      });
    });
  }
  
  

  validacion(album: any) {
    if (!album.nombre_artista || !album.nombre_album || !album.precio_album) {
      this.alerta.GenerarAlerta('Error', 'Rellene todos los campos');
    } else if (album.precio_album <= 0) {
      this.toast.GenerarToast('El precio debe ser mayor a 0', 1000, 'middle');
    } else if (album.stock < 0) {
      this.alerta.GenerarAlerta('Error', 'El stock no puede ser negativo');
    } else {
      this.modificarAlbum(album);
    }
  }
  
  

  modificarAlbum(album: any) {
    console.log('Álbum a modificar:', album); // Verificar los datos recibidos
  
    // Validar que el nuevo stock no sea negativo
    if (album.stock < 0) {
      this.alerta.GenerarAlerta('Error', 'El stock no puede ser negativo.');
      return;
    }
  
    // Proceder con la modificación del álbum
    this.bd.modificarProducto(
      album.id_album,
      album.nombre_artista,
      album.nombre_album,
      album.detalle_album,
      album.precio_album,
      album.portada_album,
      album.stock
    ).then(res => {
      if (res) {
        this.toast.GenerarToast('Álbum modificado con éxito', 1000, 'middle');
        this.router.navigate(['/modificar-album']);
      } else {
        this.toast.GenerarToast('Error al modificar el álbum', 1000, 'middle');
      }
    }).catch(err => {
      console.error('Error al modificar el álbum:', err);
      this.toast.GenerarToast('Error al modificar el álbum', 1000, 'middle');
    });
  }
  
  
  
  
  
  


  async ingresarImagen(album : any){
    try{
     const resultado = await this.camera.tomarFoto();
     if(resultado){
      album.portada_album = resultado
      this.toast.GenerarToast('Imagen añadida correctamente',1000,'middle')
     }else{
      this.toast.GenerarToast('No se pudo obtener la imagen.',1000,'middle')
     }
    }catch(error : any){
      if (error === 'User cancelled photos app'|| error.message === 'User cancelled photos app'){
        return
      }else{
        this.alerta.GenerarAlerta('Error','Error con ingresar Imagen'+ error) 
      }
     
    }
  }


}

//NO MAS COTROL Z
//ULTIMA VEZ INTENTANDO HACER EL STOCK