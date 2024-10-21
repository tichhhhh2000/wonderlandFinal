import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AlertServiceService } from 'src/app/services/alert-service.service';
import { ServicebdService } from 'src/app/services/servicebd.service';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.page.html',
  styleUrls: ['./recuperar.page.scss'],
})
export class RecuperarPage implements OnInit {

  correo: string = '';  // Campo para ingresar el correo electrónico
  correoValido: boolean = false;  // Bandera para habilitar el cambio de contraseña

  nuevaContrasena: string = '';
  confirmarContrasena: string = '';

  constructor(
    private router: Router,
    private bd: ServicebdService,
    private alerta: AlertServiceService
  ) {}

  validarCorreo() {
    this.bd.verificarCorreo(this.correo).then(existe => {
      if (existe) {
        this.alerta.GenerarAlerta('Éxito', 'Correo verificado. Ahora puedes cambiar tu contraseña.');
        this.correoValido = true;
      } else {
        this.alerta.GenerarAlerta('Error', 'Correo no registrado.');
      }
    }).catch(e => {
      this.alerta.GenerarAlerta('Error', 'Error al verificar el correo: ' + JSON.stringify(e));
    });
  }

  cambiarContrasena() {
    if (this.nuevaContrasena !== this.confirmarContrasena) {
      this.alerta.GenerarAlerta('Error', 'Las contraseñas no coinciden');
      return;
    }

    if (!this.nuevaContrasena.trim()) {
      this.alerta.GenerarAlerta('Error', 'La contraseña no puede estar vacía');
      return;
    }

    this.bd.actualizarContrasenaPorCorreo(this.correo, this.nuevaContrasena).then(() => {
      this.alerta.GenerarAlerta('Éxito', 'Contraseña actualizada');
      this.router.navigate(['/login']);
    }).catch(e => {
      this.alerta.GenerarAlerta('Error', 'Error al actualizar la contraseña: ' + JSON.stringify(e));
    });
  }

  cancelar() {
    this.router.navigate(['/login']);
  }

  ngOnInit() {}
}

//NO MAS COTROL Z