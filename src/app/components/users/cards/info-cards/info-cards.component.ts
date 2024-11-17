import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../home/header/header.component';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../../../services/modal.service';
import { DeleteCardComponent } from '../delete-card/delete-card.component';
import { ApiService } from '../../../../services/api.service';
import { LocationService } from '../../../../services/location.service';

import 'sweetalert2/src/sweetalert2.scss';
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

interface Card {
  cardId: number;
  cardHolderId: number;
  cardHolderFirstName: string;
  cardHolderSecondName: string;
  cardHolderFirstLastName: string;
  cardHolderSecondLastName: string;
  cardHolderPhoneNumber: string;
  type: string;
  cardNumber: string;
  expirationDate: string;
  cvv: string;
  balance: number;
  billingInfoId: number;
}

interface BillingInfo {
  billingInfoID: number;
  userId: number;
  country: string;
  state: string;
  city: string;
  zone: string;
  streetName: string;
  streetNumberOne: string;
  streetNumberTwo: string;
  streetType: string;
  postalCode: string;
}

interface paymentInfo {
  card: Card;
  billingInfo: BillingInfo;
}

@Component({
  selector: 'app-info-cards',
  standalone: true,
  imports: [HeaderComponent, CommonModule, ReactiveFormsModule, DeleteCardComponent, RouterModule],
  templateUrl: './info-cards.component.html',
  styleUrl: './info-cards.component.css'
})
export class InfoCardsComponent implements OnInit {

  code: string = '';

  accessToken: string = '';

  countries: Country[] = [];
  states: State[] = [];
  cities: City[] = [];

  isEditing: boolean = false;
  originalValues: any;
  editCardForm!: FormGroup;
  deleteCard: boolean = false;

  streetTypes = ['Autopista', 'Avenida', 'Calle', 'Carrera', 'Circular', 'Circunvalar', 'Diagonal', 'Manzana', 'Pasaje', 'Peatonal', 'Transversal', 'Vereda', 'Vía', 'Zona', 'Otro'];

  paymentInfo: paymentInfo = {
    card: {
      cardId: 0,
      cardHolderId: 0,
      cardHolderFirstName: '',
      cardHolderSecondName: '',
      cardHolderFirstLastName: '',
      cardHolderSecondLastName: '',
      cardHolderPhoneNumber: '',
      type: '',
      cardNumber: '',
      expirationDate: '',
      cvv: '',
      balance: 0,
      billingInfoId: 0
    },
    billingInfo: {
      billingInfoID: 0,
      userId: 0,
      country: '',
      state: '',
      city: '',
      zone: '',
      streetName: '',
      streetNumberOne: '',
      streetNumberTwo: '',
      streetType: '',
      postalCode: ''
    }
  };

  typeMap: { [key: string]: string } = {
    debit: 'Débito',
    credit: 'Crédito'
  };

  constructor(private fb: FormBuilder, private cdRef: ChangeDetectorRef, private deleteCardService: ModalService, private route: ActivatedRoute, private router: Router, private apiService: ApiService, private locationService: LocationService) { }

  ngOnInit(): void {
    this.getAccessToken();
    this.route.paramMap.subscribe(params => {
      this.code = params.get('code') ?? '';
      if (!this.code) this.router.navigate(['cards']);
    });

    this.deleteCardService.$cancel.subscribe((value)=>{this.deleteCard = value})
    this.editCardForm = this.fb.group({
      type: [this.paymentInfo.card.type, Validators.required],
      cardNumber: [this.paymentInfo.card.cardNumber, [Validators.required, Validators.pattern(/^\d{16}$/)]],
      cvv: [this.paymentInfo.card.cvv, [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
      expirationDate: [this.paymentInfo.card.expirationDate, Validators.required],
      balance: [this.paymentInfo.card.balance, [Validators.required, Validators.pattern(/^\d+$/)]],
      cardHolderFirstName: [this.paymentInfo.card.cardHolderFirstName, [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/)]],
      cardHolderSecondName: [this.paymentInfo.card.cardHolderSecondName, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/)],
      cardHolderFirstLastName: [this.paymentInfo.card.cardHolderFirstLastName, [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/)]],
      cardHolderSecondLastName: [this.paymentInfo.card.cardHolderSecondLastName, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/)],
      cardHolderPhoneNumber: [this.paymentInfo.card.cardHolderPhoneNumber, [Validators.required, Validators.pattern(/^\d{7,15}$/)]],
      country: [this.paymentInfo.billingInfo.country, Validators.required],
      state: [this.paymentInfo.billingInfo.state, Validators.required],
      city: [this.paymentInfo.billingInfo.city, Validators.required],
      zone: [this.paymentInfo.billingInfo.zone, [Validators.required, Validators.pattern(/^[A-Za-z0-9\sÁÉÍÓÚáéíóúÑñ]+$/)]],
      streetType: [this.paymentInfo.billingInfo.streetType, Validators.required],
      streetName: [this.paymentInfo.billingInfo.streetName, [Validators.required, Validators.pattern(/^[A-Za-z0-9\sÁÉÍÓÚáéíóúÑñ]+$/)]],
      streetNumberOne: [this.paymentInfo.billingInfo.streetNumberOne, [Validators.required, Validators.pattern(/^[A-Za-z0-9]{1,5}$/)]],
      streetNumberTwo: [this.paymentInfo.billingInfo.streetNumberTwo, [Validators.required, Validators.pattern(/^[A-Za-z0-9]{1,5}$/)]],
      postalCode: [this.paymentInfo.billingInfo.postalCode, [Validators.required, Validators.pattern(/^\d{4,10}$/)]],
      cardId: [this.code],
    });
    this.getCardInfo();
    this.originalValues = this.editCardForm.getRawValue();
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

  getCardInfo() {
    this.apiService.getData('data/get-card-info?cardID='+this.code).subscribe(
      (response: paymentInfo) => {
        const { card, billingInfo } = response;

        // Asigna los valores a los controles del formulario
        this.editCardForm.patchValue({
          type: card.type,
          cardNumber: card.cardNumber,
          cvv: card.cvv,
          expirationDate: card.expirationDate,
          balance: card.balance,
          cardHolderFirstName: card.cardHolderFirstName,
          cardHolderSecondName: card.cardHolderSecondName,
          cardHolderFirstLastName: card.cardHolderFirstLastName,
          cardHolderSecondLastName: card.cardHolderSecondLastName,
          cardHolderPhoneNumber: card.cardHolderPhoneNumber,
          country: billingInfo.country,
          state: billingInfo.state,
          city: billingInfo.city,
          zone: billingInfo.zone,
          streetType: billingInfo.streetType,
          streetName: billingInfo.streetName,
          streetNumberOne: billingInfo.streetNumberOne,
          streetNumberTwo: billingInfo.streetNumberTwo,
          postalCode: billingInfo.postalCode,
        });
        // console.log(card);
        this.originalValues = this.editCardForm.getRawValue();
      },
      (error) => {
        console.error('Error obteniendo la información de la tarjeta:', error);
        // window.alert('Error obteniendo la información de la tarjeta. Intente de nuevo más tarde.');
        // window.location.href = '/cards';
        Swal.fire({
          icon: "error",
          title: "Información tarjeta",
          text: "Error obteniendo la información de la tarjeta. Intente de nuevo más tarde.",
          confirmButtonColor: "#0F766E",
          showConfirmButton: false,
          timer: 2500,
          timerProgressBar: true
        }).then(() => {
          window.location.href = '/cards';
        });
      }
    );
  }

  toggleEdit() {
    this.isEditing = true;
    this.cdRef.detectChanges();
  }

  deleteCardFunction(){
    this.deleteCard = true;
  }

  save() {
    if (this.editCardForm.valid) {
      // console.log(this.editCardForm.value);
      this.isEditing = false;

      this.apiService.putData('update/edit-card', this.editCardForm.value).subscribe(
        (response) => {
          // console.log(response);
          // window.alert('Tarjeta actualizada correctamente.');
          Swal.fire({
            icon: "success",
            title: "Editar tarjeta",
            text: "Tarjeta actualizada correctamente.",
            confirmButtonColor: "#0F766E",
            showConfirmButton: false,
            timer: 2500,
            timerProgressBar: true
          })
        },
        (error) => {
          console.error('Error actualizando la tarjeta:', error);
          // window.alert('Error actualizando la tarjeta. Intente de nuevo más tarde.');
          Swal.fire({
            icon: "error",
            title: "Editar tarjeta",
            text: "Error actualizando la tarjeta. Intente de nuevo más tarde.",
            confirmButtonColor: "#0F766E",
            showConfirmButton: false,
            timer: 2500,
            timerProgressBar: true
          })
        }
      );
    } else {
      console.error('Formulario invalido');
    }
  }

  cancel() {
    this.isEditing = false;
    this.editCardForm.reset(this.originalValues);
  }

}
