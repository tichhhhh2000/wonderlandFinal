import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { AlertServiceService } from 'src/app/services/alert-service.service';
import { CamaraService } from 'src/app/services/camara.service';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { ToastServiceService } from 'src/app/services/toast-service.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  IDUSUARIO! : number;
  foto: string = "";
  fotoNueva: string = "";

  infoUsuario: any = {
    username: '',
    correo_usuario: '',
    direccion: '',
    foto_perfil: '' 
  }; 


  constructor(private bd : ServicebdService, private storage : NativeStorage, private alerta : AlertServiceService , private router: Router, private camera: CamaraService, private toast: ToastServiceService) { }

  ngOnInit() {
    this.obtenerUsuario().then((idUsuario) => {
      if (idUsuario) {
        this.IDUSUARIO = idUsuario;
        console.log('ID de Usuario:', this.IDUSUARIO);

        this.bd.traerUsuario(this.IDUSUARIO).then((usuario) => {
        if (usuario) {
          this.infoUsuario = usuario;
          console.log('Información del usuario:', this.infoUsuario); // Log para verificar los datos
        }
      });
  
      this.bd.obtenerFotoPerfil(this.IDUSUARIO).then((foto) => {
        if (foto) {
          this.infoUsuario.foto_perfil = foto; // Mostrar la foto recuperada
        }
      });
    }
  }).catch((e) => {
    this.alerta.GenerarAlerta('Error', 'Error obteniendo el usuario: ' + JSON.stringify(e));
  });
}


  irModificarPerfil(){
    let NavigationExtras: NavigationExtras={
      state:{
        usuarioSeleccionado: this.IDUSUARIO
      }
    }
    this.router.navigate(['/modificar-perfil'],NavigationExtras)
  }


  async obtenerUsuario(){
    try{
      const idUsuario = await this.storage.getItem('usuario_logueado')
      return idUsuario
    }catch(e){
      this.alerta.GenerarAlerta('Error','Error obteniendo el usuario'+JSON.stringify(e))
      return null
    }
  }


  async ingresarImagen() {
    try {
      const resultado = await this.camera.tomarFoto();
      if (resultado) {
        this.foto = resultado; // Asignamos la nueva foto
        this.infoUsuario.foto_perfil = resultado;
  
        const actualizacionExitosa = await this.bd.actualizarFotoPerfil(this.IDUSUARIO, resultado);
        if (actualizacionExitosa) {
          this.toast.GenerarToast('Imagen guardada correctamente', 2000, 'bottom');
        } else {
          this.toast.GenerarToast('No se pudo guardar la imagen.', 2000, 'bottom');
        }
      } else {
        this.toast.GenerarToast('No se pudo obtener la imagen.', 2000, 'bottom');
      }
    } catch (error: any) {
      if (error === 'User cancelled photos app' || error.message === 'User cancelled photos app') {
        return; // El usuario canceló la operación
      } else {
        this.alerta.GenerarAlerta('Error', 'Error al ingresar imagen: ' + JSON.stringify(error));
      }
    }
  }
  
}

//NO MAS COTROL Z perfil listo ya guarda foto de peril