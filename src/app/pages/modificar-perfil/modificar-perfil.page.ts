import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertServiceService } from 'src/app/services/alert-service.service';
import { CamaraService } from 'src/app/services/camara.service';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { ToastServiceService } from 'src/app/services/toast-service.service';

@Component({
  selector: 'app-modificar-perfil',
  templateUrl: './modificar-perfil.page.html',
  styleUrls: ['./modificar-perfil.page.scss'],
})
export class ModificarPerfilPage implements OnInit {
   //  variables van arriba del constructor

    idusuario! : number;

   username: string = "";
   email: string = "";
   password: string = "";
   password2: string = "";
   direction: string = "";
   foto: string = "";
   fotoNueva: string = "";

   correoVal : boolean = false;
   contraVal : boolean = false;
   contraIgual : boolean = false;
 
   constructor(private router: Router, private alerta: AlertServiceService, private bd: ServicebdService, private toast: ToastServiceService, private camera : CamaraService, private route : ActivatedRoute) {

    this.route.queryParams.subscribe((param)=>{
      if (this.router.getCurrentNavigation()?.extras.state){
       this.idusuario = this.router.getCurrentNavigation()?.extras?.state?.['usuarioSeleccionado'] 

      }
    })

    if(this.idusuario){
      this.bd.consultarPerfil(this.idusuario).then(data=>{
        this.username = data?.usuario
        this.email = data?.correo_usuario
        this.password = data?.clave_usuario
        this.direction = data?.direccion
        this.foto = data?.foto_perfil
      })
    }

    }
   // router: para ir de una pagina a otra
   // funciones van debajo del constructor
   // this. es para llamar la funcion


   modificar() {
        this.bd.insertarUsuario(this.username, this.email, this.password, this.direction).then(()=>{
          this.username = "";
          this.email = "";
          this.password = "";
          this.password2 = "";
          this.direction = "";
          this.toast.GenerarToast('perfil modificado exitosamente', 3000, 'bottom')
          this.router.navigate(['/login'])
        }).catch(e=>{
          this.alerta.GenerarAlerta('Error', 'Error al modificar perfil' + JSON.stringify(e))
        })
      }



  validarCorreo(correo: string)  {
    const patron =   /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return patron.test(correo);
  }

  validarPassword(password: string) {
    const patron =  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{6,}$/;
    return patron.test(password);
  }

  validacion() {
    if (!this.username || !this.email || !this.password || !this.password2) {
      this.alerta.GenerarAlerta('Error' ,'Rellene todos los campos');
      return
    } 

    this.correoVal = false;
    this.contraVal = false;
    this.contraIgual = false;

    if (!this.validarCorreo(this.email)) {
      this.correoVal = true;
    } 
    if (!this.validarPassword(this.password)) {
      this.contraVal = true;
    }
    if (this.password !== this.password2) {
      this.contraIgual = true;
    }
    if (this.correoVal ||  this.contraVal || this.contraIgual) {
      return;
    }
    this.modificar();
  }

   // Cargar datos del perfil cuando la página se inicia
   ngOnInit() {
    if(this.idusuario) {
      this.bd.consultarPerfil(this.idusuario).then(data => {
        this.username = data?.usuario;
        this.email = data?.correo_usuario;
        this.password = data?.clave_usuario;
        this.direction = data?.direccion;
        this.foto = data?.foto_perfil;
      });
    }
  }

  // Cargar el perfil del usuario actual desde la base de datos
  cargarPerfil() {
    const userId = 1;  // Aquí debes obtener el ID del usuario actual (de la sesión o contexto)
    this.bd.consultarPerfil(userId).then(perfil => {
      if (perfil) {
        // Asignar los datos del perfil a las variables que están enlazadas con los inputs
        this.username = perfil.usuario;
        this.email = perfil.correo_usuario;
        this.password = perfil.clave_usuario;  // La contraseña actual
        this.password2 = perfil.clave_usuario; // Para que las contraseñas coincidan al inicio
        this.direction = perfil.direccion;
      } else {
        this.alerta.GenerarAlerta('Error', 'No se pudo cargar la información del perfil');
      }
    }).catch(e => {
      this.alerta.GenerarAlerta('Error', 'Error al cargar el perfil: ' + JSON.stringify(e));
    });
  }

  
  async ingresarImagen(){
    try{
     const resultado = await this.camera.tomarFoto();
     if(resultado){
      this.foto = ""
      this.fotoNueva = resultado
      this.toast.GenerarToast('Imagen añadida correctamente',2000,'bottom')
     }else{
      this.toast.GenerarToast('No se pudo obtener la imagen.',2000,'bottom')
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