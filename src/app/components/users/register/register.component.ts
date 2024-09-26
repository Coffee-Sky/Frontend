import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { EmailValidator, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { threadId } from 'node:worker_threads';
import { LocationService } from '../../../services/location.service';
import { HttpClient } from '@angular/common/http';

interface Country {
  country_name: string;
  country_short_name: string;
  country_phone_code: number;
}

interface State {
  state_name: string;
}

interface City {
  city_name: string;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

export class RegisterComponent implements OnInit{

  accessToken: string = '';

  countries: Country[] = [];
  states: State[] = [];
  cities: City[] = [];

  constructor(private locationService: LocationService) { }

  ngOnInit() {
    this.locationService.getAccessToken().subscribe(
      (response) => {
        this.accessToken = response.auth_token;
        // console.log('Access Token:', this.accessToken);
        this.getCountries();
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
        this.countries = response;
        // console.log(this.countries);
      },
      (error) => {
        console.error('Error obteniendo los países:', error);
      }
    );
  }

  getStates(event: Event) {
    const selectedCountry = (event.target as HTMLSelectElement).value;

    // console.log('Selected Country:', selectedCountry);

    this.states = [];
    this.cities = [];

    this.locationService.getStates(this.accessToken, selectedCountry).subscribe(
      (response) => {
        this.states = response;
        // console.log(this.states);
      },
      (error) => {
        console.error('Error obteniendo los estados:', error);
      }
    );
  }

  getCities(event: Event) {
    const selectedState = (event.target as HTMLSelectElement).value;

    // console.log('Selected Country:', selectedState);

    this.locationService.getCities(this.accessToken, selectedState).subscribe(
      (response) => {
        this.cities = response;
        // console.log(this.cities);
      },
      (error) => {
        console.error('Error obteniendo las ciudades:', error);
      }
    );
  }

  registerForm = new FormGroup({
    firstname: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/)]),
    secondname: new FormControl(''),
    firstlastname: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/)]),
    secondlastname: new FormControl(''),
    genderID: new FormControl('', Validators.required),
    identificationnumber: new FormControl('', [Validators.required, Validators.pattern(/^(1\d{9}|[1-9]\d{7})$/)]),
    borncountry: new FormControl('', Validators.required),
    bornstate: new FormControl('', Validators.required),
    borncity: new FormControl('', Validators.required),
    bornDate: new FormControl('', Validators.required),
    username: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.pattern(/^[a-z]([a-z0-9.-]+)?@[a-z0-9]+.[a-z]{2,3}(.([a-z]{2}))?$/)]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  save() {
    if ( this.registerForm.valid) {
      console.log(this.registerForm.value);
    } else {
      console.log('Formulario invalido');
    }
  }
}
