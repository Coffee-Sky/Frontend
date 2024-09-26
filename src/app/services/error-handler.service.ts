import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor() { }

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';

    // Verificar si error.error es un objeto con la propiedad 'message'
    if (error.error && error.error.message) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } else if (error.status) {
      // Caso de error del lado del servidor
      errorMessage = `Server-side error: ${error.status} - ${error.message}`;
    }

    console.error(errorMessage);
    return throwError({ status: error.status, message: errorMessage });
  }
}
