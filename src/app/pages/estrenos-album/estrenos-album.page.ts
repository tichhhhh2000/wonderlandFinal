import { Component, OnInit } from '@angular/core';
import { EstrenoService } from 'src/app/services/estreno.service'; // Importamos el servicio

@Component({
  selector: 'app-estrenos-album',
  templateUrl: './estrenos-album.page.html',
  styleUrls: ['./estrenos-album.page.scss'],
})
export class EstrenosAlbumPage implements OnInit {

  estrenos: any[] = [];  // Variable para almacenar los estrenos

  constructor(private estrenoService: EstrenoService) {}

  ngOnInit() {
    this.cargarEstrenos();  // Llamamos al método al inicializar la página
  }

  // Método para cargar los estrenos desde la API
  cargarEstrenos() {
    this.estrenoService.getEstrenos().subscribe(
      (response) => {
        if (response.ok && response.statusCode === 200) {
          this.estrenos = response.data;  // Guardamos los datos en la variable
        } else {
          console.error('Error en la respuesta de la API:', response);
        }
      },
      (error) => {
        console.error('Error al cargar los estrenos:', error);
      }
    );
  }
}