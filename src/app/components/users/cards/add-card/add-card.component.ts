import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeaderComponent } from '../../../home/header/header.component';
import { RouterModule } from '@angular/router';
import { JwtService } from '../../../../services/jwt.service';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { LocationService } from '../../../../services/location.service';

// import 'sweetalert2/src/sweetalert2.scss';
import Swal from 'sweetalert2';

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
  selector: 'app-add-card',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HeaderComponent, RouterModule],
  templateUrl: './add-card.component.html',
  styleUrl: './add-card.component.css'
})
export class AddCardComponent implements OnInit {

  code: string = '';

  accessToken: string = '';

  countries: Country[] = [];
  states: State[] = [];
  cities: City[] = [];
  
  today = new Date().toISOString().split('T')[0];
  streetTypes = ['Autopista', 'Avenida', 'Calle', 'Carrera', 'Circular', 'Circunvalar', 'Diagonal', 'Manzana', 'Pasaje', 'Peatonal', 'Transversal', 'Vereda', 'Vía', 'Zona', 'Otro'];

  cardForm = new FormGroup({
    type: new FormControl('', Validators.required),
    cardNumber: new FormControl('', [Validators.required, Validators.pattern(/^\d{16}$/)]),
    cvv: new FormControl('', [Validators.required, Validators.pattern(/^\d{3}$/)]),
    expirationDate: new FormControl('', Validators.required),
    balance: new FormControl('', [Validators.required, Validators.pattern(/^\d+$/)]),
    cardHolderFirstName: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/)]),
    cardHolderSecondName: new FormControl('', Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/)),
    cardHolderFirstLastName: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/)]),
    cardHolderSecondLastName: new FormControl('', Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/)),
    cardHolderPhoneNumber: new FormControl('', [Validators.required, Validators.pattern(/^\d{7,15}$/)]),
    country: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    zone: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-z0-9\sÁÉÍÓÚáéíóúÑñ]+$/)]),
    streetType: new FormControl('', Validators.required),
    streetName: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-z0-9\sÁÉÍÓÚáéíóúÑñ]+$/)]),
    streetNumberOne: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-z0-9]{1,5}$/)]),
    streetNumberTwo: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-z0-9]{1,5}$/)]),
    postalCode: new FormControl('', [Validators.required, Validators.pattern(/^\d{4,10}$/)]),
    userId: new FormControl(''),
    cardHolderId: new FormControl('')
  });

  constructor(private jwtService: JwtService, private apiService: ApiService, private router: Router, private locationService: LocationService) { }

  ngOnInit(): void {
    this.getAccessToken();
    this.getCodeUser();
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

  getCodeUser() {
    this.code = this.jwtService.getCode() ?? ''
  }

  onBalanceInput(event: Event, controlName: string) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/[^\d]/g, ''); // Remover todo excepto números
    if (value) {
      this.cardForm.get(controlName)?.setValue(Number(value), {emitEvent: false});
    }
  }

  changeExpirationDate(expirationDate: string) {
    const [year, month] = expirationDate.split('-'); // Dividimos por '-'
    return`${year}-${month}`
  }

  save() {
    if (this.cardForm.valid) {
      this.cardForm.get('userId')?.setValue(this.code);
      this.cardForm.get('cardHolderId')?.setValue(this.code);
      this.cardForm.get('expirationDate')?.setValue(this.changeExpirationDate(this.cardForm.get('expirationDate')?.value!));
      // console.log(this.cardForm.value);

      this.apiService.postData('update/enroll-card', this.cardForm.value).subscribe(
        (response) => {
          // console.log(response);
          // window.alert('Tarjeta registrada correctamente.');
          // this.router.navigate(['/cards']);
          Swal.fire({
            icon: "success",
            title: "Nueva tarjeta",
            text: "Tarjeta registrada correctamente.",
            confirmButtonColor: "#0F766E",
            showConfirmButton: false,
            timer: 2500,
            timerProgressBar: true
          }).then(() => {
            this.router.navigate(['/cards']);
          });
        },
        (error) => {
          console.error(error);
          // window.alert('Error al registrar la tarjeta. Vuélvalo a intentar.');
          Swal.fire({
            icon: "error",
            title: "Nueva tarjeta",
            text: "Error al registrar la tarjeta. Vuélvalo a intentar.",
            confirmButtonColor: "#0F766E",
            showConfirmButton: false,
            timer: 2500,
            timerProgressBar: true
          })
        }
      );
    } else {
      console.error("Error");
    }
  }
}
