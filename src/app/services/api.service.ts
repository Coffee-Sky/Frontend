import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private url = environment.url;

  constructor(private http: HttpClient, private errorHandlerService: ErrorHandlerService) { }

  /**
   * Get data from a specified endpoint.
   * @param {string} endpoint - The endpoint to get data from.
   * @returns {Observable<any>} An Observable of the HTTP response.
   */
  getData(endpoint: string): Observable<any> {
    return this.http.get<any>(`${this.url}/${endpoint}`).pipe(
      catchError(this.errorHandlerService.handleError)
    );
  }

  /**
   * Post data to a specified endpoint.
   * @param {string} endpoint - The endpoint to post data to.
   * @param {any} data - The data to post.
   * @returns {Observable<any>} An Observable of the HTTP response.
   */
  postData(endpoint: string, data: any): Observable<any> {
    return this.http.post<any>(`${this.url}/${endpoint}`, data).pipe(
      catchError(this.errorHandlerService.handleError)
    );
  }
}
