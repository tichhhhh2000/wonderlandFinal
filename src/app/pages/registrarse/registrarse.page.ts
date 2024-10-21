import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertServiceService } from 'src/app/services/alert-service.service';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { ToastServiceService } from 'src/app/services/toast-service.service';


@Component({
  selector: 'app-registrarse',
  templateUrl: './registrarse.page.html',
  styleUrls: ['./registrarse.page.scss'],
})
export class RegistrarsePage implements OnInit {

   //  variables van arriba del constructor
   username: string = "";
   email: string = "";
   password: string = "";
   password2: string = "";
   direction: string = "";

   correoVal : boolean = false;
   contraVal : boolean = false;
   contraIgual : boolean = false;
 
   constructor(private router: Router, private alerta: AlertServiceService, private bd: ServicebdService, private toast: ToastServiceService) { }
   // router: para ir de una pagina a otra
   // funciones van debajo del constructor
   // this. es para llamar la funcion
   registrarse() {
     this.bd.verificarUsuarioCorreo(this.username, this.email).then(existe=>{
      if(existe) {
        this.alerta.GenerarAlerta('Error', 'Nombre usuario o correo ya existe')
      } else {
        this.bd.insertarUsuario(this.username, this.email, this.password, this.direction).then(()=>{
          this.username = "";
          this.email = "";
          this.password = "";
          this.password2 = "";
          this.direction = "";
          this.toast.GenerarToast('Usuario creado exitosamente', 2000, 'middle')
          this.router.navigate(['/login'])
        }).catch(e=>{
          this.alerta.GenerarAlerta('Error', 'Error al insertar los datos' + JSON.stringify(e))
        })
      }
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
    this.registrarse();
  }

  ngOnInit() {
  }

}

//NO MAS COTROL Z