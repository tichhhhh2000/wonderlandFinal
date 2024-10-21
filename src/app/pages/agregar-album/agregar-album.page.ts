import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertServiceService } from 'src/app/services/alert-service.service';
import { CamaraService } from 'src/app/services/camara.service';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { ToastServiceService } from 'src/app/services/toast-service.service';

@Component({
  selector: 'app-agregar-album',
  templateUrl: './agregar-album.page.html',
  styleUrls: ['./agregar-album.page.scss'],
})
export class AgregarAlbumPage implements OnInit {

  nombreArtista: string = '';
  nombreAlbum: string = '';
  detalleAlbum: string = '';
  precio: number = 0;
  portadaAlbum: string | null = null;

  constructor(
    private router: Router,
    private alerta: AlertServiceService,
    private toast: ToastServiceService,
    private bd: ServicebdService,
    private camera: CamaraService
  ) { }

  validacion() {
    if (!this.nombreArtista || !this.nombreAlbum || !this.precio) {
      this.alerta.GenerarAlerta('Error', 'Rellene todos los campos');
    } else if (this.precio <= 0) {
      this.toast.GenerarToast('El precio debe ser mayor a 0', 1000, 'middle');
    } else {
      this.bd.insertarProducto(this.nombreArtista, this.nombreAlbum, this.detalleAlbum, this.precio, this.portadaAlbum)
        .then((res) => {
          if (res) {
            this.toast.GenerarToast('El álbum ha sido añadido exitosamente', 1000, 'middle');
            this.router.navigate(['/administracion']);
          } else {
            this.alerta.GenerarAlerta('Error', 'Hubo un problema al añadir el álbum');
          }
        })
        .catch(err => {
          this.alerta.GenerarAlerta('Error', 'Error al insertar álbum: ' + JSON.stringify(err));
        });
    }
  }

  ngOnInit() {
  }

  async ingresarImagen(){
    try{
     const resultado = await this.camera.tomarFoto();
     if(resultado){
      this.portadaAlbum = resultado
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