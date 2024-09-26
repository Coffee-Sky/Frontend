import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private apiUrl = 'https://www.universal-tutorial.com/api/getaccesstoken';
  private apiToken = '1DCAP1IB9-xQX_I4it4aimwPAzhfkyT9cYEn81Uz8y7VMAbR43pKXtnkLwvN_S5UNc0';
  private userEmail = 'coffeeskyairline@gmail.com';

  constructor(private http: HttpClient) { }

  getAccessToken(): Observable<any> {
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'api-token': this.apiToken,
      'user-email': this.userEmail
    });

    return this.http.get(this.apiUrl, { headers });
  }

  getCountries(accessToken: string): Observable<any> {

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json'
    });

    return this.http.get('https://www.universal-tutorial.com/api/countries', { headers });
  }

  getStates(accessToken: string, country: string): Observable<any> {

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json'
    });

    return this.http.get(`https://www.universal-tutorial.com/api/states/${country}`, { headers });
  }

  getCities(accessToken: string, state: string): Observable<any> {
      
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      });
  
      return this.http.get(`https://www.universal-tutorial.com/api/cities/${state}`, { headers });
    }
}
