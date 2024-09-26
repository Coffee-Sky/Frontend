import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { LocationService } from '../../../services/location.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-page',
  standalone: true,
  imports: [HeaderComponent ],
  templateUrl: './page.component.html',
  styleUrl: './page.component.css'
})
export class PageComponent implements OnInit {

  accessToken: string = '';

  constructor(private locationService: LocationService) { }

  ngOnInit() {
    this.locationService.getAccessToken().subscribe(
      (response) => {
        this.accessToken = response.auth_token;
        console.log('Access Token:', this.accessToken);
        // this.getCountries();
        // this.getStates('Colombia');
        // this.getCities('Antioquia');
      },
      (error) => {
        console.error('Error obteniendo el token de acceso:', error);
      }
    );
  }

  getCountries() {
    this.locationService.getCountries(this.accessToken).subscribe(
      (response) => {
        console.log('Países:', response);
      },
      (error) => {
        console.error('Error obteniendo los países:', error);
      }
    );
  }

  getStates(country: string) {
    this.locationService.getStates(this.accessToken, country).subscribe(
      (response) => {
        console.log('Estados:', response);
      },
      (error) => {
        console.error('Error obteniendo los estados:', error);
      }
    );
  }

  getCities(state: string) {
    this.locationService.getCities(this.accessToken, state).subscribe(
      (response) => {
        console.log('Ciudades:', response);
      },
      (error) => {
        console.error('Error obteniendo las ciudades:', error);
      }
    );
  }

}
