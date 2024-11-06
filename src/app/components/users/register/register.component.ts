import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { EmailValidator, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { threadId } from 'node:worker_threads';
import { LocationService } from '../../../services/location.service';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../../services/api.service';
import { RouterModule } from '@angular/router';

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

interface Gender {
  genderID: number;
  name: string;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

export class RegisterComponent implements OnInit{

  accessToken: string = '';

  countries: Country[] = [];
  states: State[] = [];
  cities: City[] = [];
  genders: Gender[] = [];

  constructor(private locationService: LocationService, private apiService: ApiService) { }

  ngOnInit() {
    this.getGenders();
    this.getAccessToken();
  }

  getGenders() {
    this.apiService.getData("sign-up/get-genders").subscribe(
      (response) => {
        this.genders = response;
        // console.log(this.genders);
      },
      (error) => {
        console.error('Error obteniendo los géneros:', error);
      }
    )
  }

  getAccessToken() {
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
    secondname: new FormControl('', Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/)),
    firstlastname: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/)]),
    secondlastname: new FormControl('', Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/)),
    genderID: new FormControl('', Validators.required),
    identificationnumber: new FormControl('', [Validators.required, Validators.pattern(/^(1\d{9}|[1-9]\d{7})$/)]),
    borncountry: new FormControl('', Validators.required),
    bornstate: new FormControl('', Validators.required),
    borncity: new FormControl('', Validators.required),
    bornDate: new FormControl('', Validators.required),
    username: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.pattern(/^[a-z]([a-z0-9.-]+)?@[a-z0-9]+.[a-z]{2,3}(.([a-z]{2}))?$/)]),
    password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(20), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&/<>+])[A-Za-z\d@$!%*?&/<>+]{8,20}$/)]),
    termsAndConditions: new FormControl('', Validators.requiredTrue)
  });

  save() {
    if (this.registerForm.valid) {
      // console.log(this.registerForm.value);
      this.apiService.postData("sign-up/register-client", this.registerForm.value).subscribe(
        (response) => {
          // console.log('Usuario registrado:', response);
          window.alert('Usuario registrado exitosamente');
          window.location.href = '/login';
        },
        (error) => {
          console.error('Error registrando el usuario:', error);
          window.alert('Error registrando el usuario');
        }
      );
    } else {
      console.error('Formulario invalido');
    }
  }
}
