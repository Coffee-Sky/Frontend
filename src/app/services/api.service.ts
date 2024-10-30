import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { ErrorHandlerService } from './error-handler.service';
import { JwtService } from './jwt.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private url = environment.url;

  constructor(private http: HttpClient, private errorHandlerService: ErrorHandlerService, private jwtService: JwtService) { }

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

  /**
   * Post data to a specified endpoint with headers.
   * @param {string} endpoint - The endpoint to post data to.
   * @param {any} data - The data to post.
   * @returns {Observable<any>} An Observable of the HTTP response.
   */
  postDataWithHeaders(endpoint: string, data: any): Observable<any> {
    const token = this.jwtService.getToken();
    console.log(token);

    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`);

    console.log(headers);

    return this.http.post<any>(`${this.url}/${endpoint}`, data, { headers }).pipe(
      catchError(this.errorHandlerService.handleError)
    );
  }

  /**
   * Put data to a specified endpoint.
   * @param {string} endpoint - The endpoint to put data to.
   * @param {any} data - The data to put.
   * @returns {Observable<any>} An Observable of the HTTP response.
   */
  putData(endpoint: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.url}/${endpoint}`, data).pipe(
      catchError(this.errorHandlerService.handleError)
    );
  }


  /**
   * Put data to a specified endpoint with headers.
   * @param {string} endpoint - The endpoint to put data to.
   * @param {any} data - The data to put.
   * @returns {Observable<any>} An Observable of the HTTP response.
   */
  putDataWithHeaders(endpoint: string): Observable<any> {
    const token = this.jwtService.getToken();
    console.log(token);
  
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`);

    console.log(headers);
  
    return this.http.put<any>(`${this.url}/${endpoint}`, {}, { headers }).pipe(
      catchError(this.errorHandlerService.handleError)
    );
  }

  /**
   * Delete data from a specified endpoint.
   * @param {string} endpoint - The endpoint to delete data from.
   * @returns {Observable<any>} An Observable of the HTTP response.
   */
  deleteData(endpoint: string): Observable<any> {
    return this.http.delete<any>(`${this.url}/${endpoint}`).pipe(
      catchError(this.errorHandlerService.handleError)
    );
  }
  
}
