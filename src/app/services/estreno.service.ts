import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EstrenoService {

  private apiURL = 'https://api-discso.onrender.com/'; // URL de tu API en Render

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    })
  };

  constructor(private http: HttpClient) {}

  // Método para obtener todos los estrenos
  getEstrenos(): Observable<any> {
    return this.http.get<any>(`${this.apiURL}/`, this.httpOptions).pipe(
      retry(1),  // Reintenta 1 vez en caso de error
      catchError(this.handleError)  // Maneja los errores
    );
  }

  // Método para obtener un estreno por ID
  getEstrenoById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiURL}/${id}`, this.httpOptions).pipe(
      retry(1),  // Reintenta 1 vez en caso de error
      catchError(this.handleError)  // Maneja los errores
    );
  }

  // Manejo de errores
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('Error del cliente:', error.error.message);
    } else {
      console.error(`Error del servidor ${error.status}: ${error.message}`);
    }
    return throwError('Error en la carga, intenta nuevamente más tarde.');
  }
}
