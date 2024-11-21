import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeaderComponent } from '../../../home/header/header.component';
import { CartService } from '../../../../services/cart.service';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { JwtService } from '../../../../services/jwt.service';
import { Router, ActivatedRoute } from '@angular/router';

import 'sweetalert2/src/sweetalert2.scss';
import Swal from 'sweetalert2';
import { LocationService } from '../../../../services/location.service';
import { SelectCardComponent } from '../../cards/select-card/select-card.component';

interface Country {
  country_name: string;
  country_short_name: string;
  country_phone_code: number;
}

interface CartFlights {
  isRoundTrip: boolean;
  id: string;
  flights: Flight[];
}

interface Flight {
  flightId: number;
  originCity: string;
  destinationCity: string;
  departure: string;
  quantity: number;
  classType: string;
  price: number;
}

interface Gender {
  genderID: number;
  name: string;
}

interface Passenger {
  bornDate: string;
  borncountry: string;
  email: string;
  firstlastname: string;
  firstname: string;
  genderID: string;
  identificationnumber: string;
  identificationtype: string;
  secondlastname: string;
  secondname: string;
  trip: string;
}

@Component({
  selector: 'app-passenger-info',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent, RouterModule, SelectCardComponent],
  templateUrl: './passenger-info.component.html',
  styleUrl: './passenger-info.component.css'
})
export class PassengerInfoComponent implements OnInit {
  type: string = ''
  accessToken: string = '';

  countries: Country[] = [];

  flightForms: { [key: string]: FormGroup } = {};
  maxDate: string = new Date().toISOString().split('T')[0];
  flightsCart: CartFlights[] = [];
  genders: Gender[] = [];

  disabledViewCard: boolean = false;
  selectedCardId: number = -1;

  constructor(
    private locationService: LocationService, 
    private fb: FormBuilder, 
    private cartService: CartService, 
    private apiService: ApiService, 
    private jwtService: JwtService, 
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.type = params.get('type') ?? '';
      if (!this.type || (this.type !== '0' && this.type !== '1')) this.router.navigate(['cart']);
    });
    this.getAccessToken();
    this.getFlights();
    this.getGenders();
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

  getGenders() {
    this.apiService.getData("sign-up/get-genders").subscribe(
      (response: Gender[]) => {
        this.genders = response;
        // console.log(this.genders);
      },
      (error) => {
        console.error('Error obteniendo los géneros:', error);
      }
    )
  }


  getFlights() {
    this.cartService.getCartItems().subscribe((flightsCart: CartFlights[]) => {
      this.flightsCart = flightsCart;
      // console.log('flightsCart in Reservas:', flightsCart);
      this.createFormsForFlights();
    });
  }

  createFormsForFlights() {
    this.flightsCart.forEach(item => {
      this.flightForms[item.id] = this.fb.group({
        flightInfo: this.fb.group({
          tripType: [item.isRoundTrip],
          origin: [item.flights[0].originCity],
          destiny: [item.flights[0].destinationCity],
        }),
        passengers: this.fb.array([])
      });

      const passengersArray = this.getPassengersArray(item.id);
      for (let i = 0; i < item.flights[0].quantity; i++) {
        passengersArray.push(this.createPassengerForm());
      }
    });
  }

  getPassengersArray(flightId: string): FormArray {
    return this.flightForms[flightId].get('passengers') as FormArray;
  }

  createPassengerForm(): FormGroup {
    return this.fb.group({
      firstname: ['', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/)]],
      secondname: ['', Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/)],
      firstlastname: ['', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/)]],
      secondlastname: ['', Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/)],
      genderID: ['', Validators.required],
      identificationtype: ['', Validators.required],
      identificationnumber: ['', Validators.required],
      bornDate: ['', Validators.required],
      borncountry: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(/^[a-z]([a-z0-9.-]+)?@[a-z0-9]+.[a-z]{2,3}(.([a-z]{2}))?$/)]],
    });
  }

  hasAdult(flightId: string): boolean {
    const passengers = this.getPassengersArray(flightId);
    return passengers.controls.some(control => 
      !this.isChild(control.get('bornDate')?.value)
    );
  }

  hasDuplicateDocuments(flightId: string): boolean {
    const passengers = this.getPassengersArray(flightId);
    const documents = passengers.controls
      .map(control => control.get('identificationnumber')?.value)
      .filter(doc => doc);
    return documents.length !== new Set(documents).size;
  }

  isChild(bornDate: string): boolean {
    if (!bornDate) return false;
    
    const today = new Date();
    const birth = new Date(bornDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age < 18;
  }

  isFormValid(flightId: string): boolean {
    return this.flightForms[flightId].valid && 
           this.hasAdult(flightId) && 
           !this.hasDuplicateDocuments(flightId);
  }

  areAllFormsValid(): boolean {
    return Object.keys(this.flightForms).every(id => this.isFormValid(id));
  }

  onCardSelected(cardId: number): void {
    this.selectedCardId = cardId;
    console.log('Tarjeta seleccionada en PassengerInfoComponent:', this.selectedCardId);
    if(this.selectedCardId !== -1){
      this.save();
    } else {
      this.disabledViewCard = false;
    }

    // Realiza aquí la lógica adicional que necesites
  }

  processFlightData() {
    const result = this.flightsCart.flatMap((cartItem) => {
      const passengers = this.getPassengersArray(cartItem.id).value.map((passenger: Passenger) => ({
        id: null, // Asigna el valor adecuado según tu lógica
        ticketId: null, // Asigna el valor adecuado según tu lógica
        firstname: passenger.firstname,
        secondname: passenger.secondname || '',
        firstlastname: passenger.firstlastname,
        secondlastname: passenger.secondlastname || '',
        documentType: passenger.identificationtype,
        identificationnumber: passenger.identificationnumber,
        bornDate: passenger.bornDate,
        borncountry: passenger.borncountry,
        gender: passenger.genderID,
        email: passenger.email,
      }));

      const isRoundTrip = cartItem.isRoundTrip;
      const returnFlight = cartItem.flights[1] || { flightId: 0, classType: '' };

      return [
        {
          flightId: cartItem.flights[0].flightId,
          clientId: this.jwtService.getCode(), // Asigna el valor adecuado
          classType: cartItem.flights[0].classType,
          quantity: cartItem.flights[0].quantity,
          isRoundTrip,
          returnFlightId: returnFlight.flightId, // Usa 0 si no hay segundo vuelo
          returnClassType: returnFlight.classType, // Usa '' si no hay segundo vuelo
          passengers,
        },
      ];
  
      // if (cartItem.isRoundTrip) {
      //   // Genera dos JSON para vuelos de ida y vuelta
      //   return [
      //     {
      //       flightId: cartItem.flights[0].flightId,
      //       clientId: this.jwtService.getCode(), // Asigna el valor adecuado
      //       classType: cartItem.flights[0].classType,
      //       quantity: cartItem.flights[0].quantity,
      //       isRoundTrip: true,
      //       returnFlightId: cartItem.flights[1].flightId,
      //       returnClassType: cartItem.flights[1].classType,
      //       passengers,
      //     },
      //     {
      //       flightId: cartItem.flights[1].flightId,
      //       clientId: this.jwtService.getCode(), // Asigna el valor adecuado
      //       classType: cartItem.flights[1].classType,
      //       quantity: cartItem.flights[1].quantity,
      //       isRoundTrip: true,
      //       returnFlightId: cartItem.flights[0].flightId,
      //       returnClassType: cartItem.flights[0].classType,
      //       passengers,
      //     },
      //   ];
      // } else {
      //   // Genera un único JSON para vuelos de ida
      //   return [
      //     {
      //       flightId: cartItem.flights[0].flightId,
      //       clientId: this.jwtService.getCode(), // Asigna el valor adecuado
      //       classType: cartItem.flights[0].classType,
      //       quantity: cartItem.flights[0].quantity,
      //       isRoundTrip: false,
      //       passengers,
      //     },
      //   ];
      // }
    });
  
    // console.log('Datos procesados:', result);
    return result;
  }  

  save(): any {
    if (this.areAllFormsValid()) {
      const processedData = this.processFlightData();
  
      console.log("Datos a enviar: ", processedData);
      if (processedData.length !== 0) {
        if(this.type === '1'){
          this.apiService.postData('cart/reserve-flights', processedData).subscribe(
            (response) => {
              // window.alert('Tiquetes reservados')
              Swal.fire({
                icon: "success",
                title: "Reservar tiquetes",
                text: "Se han reservado los tiquetes.",
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true
              }).then(() => {
                this.router.navigate(['/cart']);
              });
            },
            (error) => {
              console.error('Error reservando:', error);
              // window.alert('Error reservando')
              Swal.fire({
                icon: "error",
                title: "Reservar tiquetes",
                text: "Hubo un error. Inténtalo de nuevo.",
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true
              }).then(() => {
                this.router.navigate(['/cart']);
              });
            }
          )
        } else if (this.type === '0') {
          if(this.selectedCardId !== -1){
            console.log('Entré con la tarjeta seleccionada:', this.selectedCardId);
            const updatedProcessedData = processedData.map(item => ({
              ...item,
              cardId: this.selectedCardId // Usa la variable o el valor que corresponda
            }));
            console.log('Datos a enviar con tarjeta:', updatedProcessedData);
            Swal.fire({
              icon: "question",
              title: "Comprar tiquetes",
              text: "¿Está seguro que desea comprar los tiquetes con la tarjeta seleccionada?",
              showConfirmButton: true,
              showCancelButton: true,
              confirmButtonText: "Sí",
              cancelButtonText: "No",
              confirmButtonColor: "#0F766E",
              cancelButtonColor: "#EF4444"
            }).then((result) => {
              if (result.isConfirmed) {
                console.log('Tarjeta seleccionada:', this.selectedCardId);
                this.apiService.postData('cart/buy-flights', updatedProcessedData).subscribe(
                  (response) => {
                    // window.alert('Tiquetes reservados')
                    Swal.fire({
                      icon: "success",
                      title: "Comprar tiquetes",
                      text: "Se han comprado los tiquetes.",
                      showConfirmButton: false,
                      timer: 2000,
                      timerProgressBar: true
                    }).then(() => {
                      this.router.navigate(['/cart']);
                    });
                  },
                  (error) => {
                    console.error('Error comprando:', error);
                    // window.alert('Error reservando')
                    Swal.fire({
                      icon: "error",
                      title: "Comprar tiquetes",
                      text: "Hubo un error. Inténtalo de nuevo.",
                      showConfirmButton: false,
                      timer: 2000,
                      timerProgressBar: true
                    }).then(() => {
                      this.router.navigate(['/cart']);
                    });
                  }
                )
              }
              else {
                this.selectedCardId = -1;
                this.disabledViewCard = true;
              }
            });
          }
          else {
            this.disabledViewCard = true;
          }
        }
      } else {
        console.error('No hay datos para procesar.');
      }
    } else {
      console.log('Hay formularios inválidos');
    }
  }
  
  
}