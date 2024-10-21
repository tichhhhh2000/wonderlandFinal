import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { ToastServiceService } from './services/toast-service.service';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  
  constructor(private router: Router, private menuController: MenuController, private toast :ToastServiceService, private storage : NativeStorage) { }


  
  async cerrarSesion(){
    const idusuario = await this.storage.remove('usuario_logueado')
    this.toast.GenerarToast('Sesión Cerrada con Éxito',2000,'bottom')
    this.menuController.close()
    console.log(idusuario);
    this.router.navigate(['/login'])
  }

  closeMenu(){
    this.menuController.close()
  }

  

}





