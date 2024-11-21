import { CommonModule, registerLocaleData } from '@angular/common';
import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import localeEs from '@angular/common/locales/es';
import { SearchFlightService } from '../../../services/search-flight.service';
import { SearchFlightsComponent } from '../search-flights/search-flights.component';
import { ModalService } from '../../../services/modal.service';
import { CartService } from '../../../services/cart.service';
import { JwtService } from '../../../services/jwt.service';

import 'sweetalert2/src/sweetalert2.scss';
import Swal from 'sweetalert2';

registerLocaleData(localeEs, 'es');

interface Flight {
  flightID: number;
  origin: string;
  destiny: string;
  departure: string; 
  arrival: string; 
  duration: string;
  economyPrice: number;
  businessPrice: number;
  type: string;
  status: number;
}

interface OutboundFlight {
  outbound: Flight[];
}

interface ReturnFlight {
  return: Flight[];
}

interface FlightData {
  outboundFlights: OutboundFlight;
  returnFlights: ReturnFlight;
}

@Component({
  selector: 'app-flights',
  standalone: true,
  imports: [RouterLink, CommonModule, SearchFlightsComponent],
  providers: [{ provide: LOCALE_ID, useValue: 'es' }],
  templateUrl: './flights.component.html',
  styleUrl: './flights.component.css'
})
export class FlightsComponent implements OnInit {

  vuelosIda: Flight[] = [];
  vuelosVuelta: Flight[] = [];
  origin: string = '';
  originCode: string = '';
  destination: string = '';
  destinationCode: string = '';
  departureDate: Date | null = null;
  returnDate: Date | null = null;
  passengers: number = 1;
  tripType: string = 'roundtrip';
  selectedFlight: any = null;
  selectedReturnFlight: any = null;
  selectedClassIda: 'economy' | 'business' | null = null;
  selectedClassVuelta: 'economy' | 'business' | null = null;
  editingSearch: boolean = false;

allFlights: FlightData = {
  outboundFlights: {
    outbound: [] 
  },
  returnFlights: {
    return: [] 
  }
};

  constructor(private searchFlightService: SearchFlightService, 
              private editSearchService: ModalService,
              private cartService: CartService,
              private router: Router,
              private jwtService: JwtService
            ){ }

  ngOnInit(): void {
    this.editSearchService.$edit.subscribe((value)=>{this.editingSearch = value})
    this.searchFlightService.searchCriteria$.subscribe(criteria => {
      if (criteria) {
        this.tripType = criteria.tripType;
        this.origin = criteria.origin;
        this.originCode = criteria.originCode;
        this.destination = criteria.destiny;
        this.destinationCode = criteria.destinationCode;
        this.departureDate = criteria.departureDate;
        this.returnDate = criteria.returnDate;
        this.passengers = criteria.passengers;
      }
    });

    this.searchFlightService.flights$.subscribe(flights => {
      if(Object.keys(flights).length === 0) return;
      this.allFlights = flights;
      
      // this.allFlights = {
      //   outboundFlights: { outbound: flights['outboundFlights'] || [] },
      //   returnFlights: { return: flights['returnFlights'] || [] }
      // };
      // console.log('vuelos: ', this.allFlights);
      // console.log('origin: ', this.origin)
      // console.log('destination: ', this.destination)
      // console.log('departureDate: ', this.departureDate)
      // console.log('returnDate', this.returnDate)
      // if (this.tripType === 'roundtrip') {
      //   this.vuelosVuelta = flights.filter((vuelo: { origin: string; destination: string; departureDate: Date | null; }) => vuelo.origin === this.destination && vuelo.destination === this.origin && vuelo.departureDate === this.returnDate);
      //   this.vuelosIda = flights.filter((vuelo: { origin: string; destination: string; departureDate: Date | null; }) => vuelo.origin === this.origin && vuelo.destination === this.destination && vuelo.departureDate === this.departureDate);
      //   // console.log('vuelos ida: ', this.vuelosIda);
      //   // console.log('vuelos vuelta: ', this.vuelosVuelta);
      // } else {
      //   this.vuelosIda = flights.filter((vuelo: { origin: string; destination: string; departureDate: Date | null; }) => vuelo.origin === this.origin && vuelo.destination === this.destination && vuelo.departureDate === this.departureDate);
      // }

    });
  }

  alert(){
    window.alert('Próximamente podrá comprar este vuelo.')
  }

  editSearch(){
    this.editingSearch = true;
  }

  close(){
    this.editSearchService.$edit.emit(false);
  }

  formatTime(time: string): string {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes.padStart(2, '0')} ${period}`;
  }

  selectFlight(vuelo: any): void {
    if (this.selectedFlight === vuelo) {
      if (!this.selectedClassIda) {
        this.selectedFlight = null;
        this.selectedClassIda = null;
      }
    } else {
      this.selectedFlight = vuelo;
      this.selectedClassIda = null;
    }
    // console.log('vuelo ida: ', this.selectedFlight);
  }

  selectReturnFlight(vuelo: any): void {
    if (this.selectedReturnFlight === vuelo) {
      if (!this.selectedClassVuelta) {
        this.selectedReturnFlight = null;
        this.selectedClassVuelta = null;
      }
    } else {
      this.selectedReturnFlight = vuelo;
      this.selectedClassVuelta = null;
    }
    // console.log('vuelo regreso: ', this.selectedReturnFlight);
  }

  selectClass(classType: 'economy' | 'business', tipo: 'ida' | 'vuelta'): void {
    if (tipo === 'ida') {
      this.selectedClassIda = classType;
    } else {
      this.selectedClassVuelta = classType;
    }
  }

  isFlightSelected(vuelo: any, tipo: 'ida' | 'vuelta'): boolean {
    if (tipo === 'ida') {
      return this.selectedFlight === vuelo && this.selectedClassIda !== null;
    } else {
      return this.selectedReturnFlight === vuelo && this.selectedClassVuelta !== null;
    }
  }

  getSelectedPrice(vuelo: any, tipo: 'ida' | 'vuelta'): number {
    const selectedClass = tipo === 'ida' ? this.selectedClassIda : this.selectedClassVuelta;
    return selectedClass === 'business' ? vuelo.priceFirstClass : vuelo.priceEconomy;
  }

  // {
  //   "clientId": 0,
  //   "outboundFlightId": 0,
  //   "outboundClassType": "string",
  //   "quantity": 5,
  //   "isRoundTrip": true,
  //   "returnFlightId": 0,
  //   "returnClassType": "string"
  // }

  addToCart(): void {
    if (this.tripType === 'roundtrip') {
      if (this.selectedFlight && this.selectedReturnFlight) {
        const roundTripFlights = [
          {
            flightID: this.selectedFlight.flightID,
            tripType: this.tripType,
            origin: this.selectedFlight.origin,
            destiny: this.selectedFlight.destiny,
            departure: this.selectedFlight.departure,
            passengers: this.passengers,
            selectedClass: this.selectedClassIda,
            price: this.selectedClassIda === 'economy' ? this.selectedFlight.economyPrice : this.selectedFlight.businessPrice
          },
          {
            flightID: this.selectedReturnFlight.flightID,
            tripType: this.tripType,
            origin: this.selectedReturnFlight.origin,
            destiny: this.selectedReturnFlight.destiny,
            departure: this.selectedReturnFlight.departure,
            passengers: this.passengers,
            selectedClass: this.selectedClassVuelta,
            price: this.selectedClassVuelta === 'economy' ? this.selectedReturnFlight.economyPrice : this.selectedReturnFlight.businessPrice
          }
        ];

        const flightsCart = {
          clientId: Number(this.jwtService.getCode()) || 0,
          outboundFlightId: this.selectedFlight.flightID,
          outboundClassType: this.selectedClassIda || '',
          quantity: this.passengers,
          isRoundTrip: true,
          returnFlightId: this.selectedReturnFlight.flightID,
          returnClassType: this.selectedClassVuelta || ''
        }
        
        if(this.jwtService.tokenExistsAndValid()){
          this.cartService.uplodadCartItems(flightsCart);
          this.cartService.addToCart(roundTripFlights, this.tripType);
          // console.log('Carrito: ', this.cartService.getCartData());
          // window.alert('Vuelos agregados al carrito exitosamente');
          this.selectedFlight = null;
          this.selectedReturnFlight = null;
          this.selectedClassIda = null;
          this.selectedClassVuelta = null;
          // Navegar al carrito
          Swal.fire({
            icon: "success",
            title: "Buscar vuelos",
            text: "Vuelos agregados al carrito.",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true
          }).then(() => {
            this.router.navigate(['/cart']);
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Buscar vuelos",
            text: "Debes iniciar sesión para añadir vuelos al carrito.",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true
          }).then(() => {
            this.router.navigate(['/login']);
          });
        }
      } else {
        window.alert('Debe seleccionar un vuelo de ida y un vuelo de vuelta.');
      }
    } 
    if (this.tripType === 'oneway') {
      if (this.selectedFlight) {
        const oneWayFlight = {
          flightID: this.selectedFlight.flightID,
          tripType: this.tripType,
          origin: this.selectedFlight.origin,
          destiny: this.selectedFlight.destiny,
          departure: this.selectedFlight.departure,
          passengers: this.passengers,
          selectedClass: this.selectedClassIda,
          price: this.selectedClassIda === 'economy' ? this.selectedFlight.economyPrice : this.selectedFlight.businessPrice
        };

        const flightsCart = {
          clientId: Number(this.jwtService.getCode()) || 0,
          outboundFlightId: this.selectedFlight.flightID,
          outboundClassType: this.selectedClassIda || '',
          quantity: this.passengers,
          isRoundTrip: false,
          returnFlightId: 0,
          returnClassType: ''
        }

        if(this.jwtService.tokenExistsAndValid()){
          this.cartService.uplodadCartItems(flightsCart);

          Swal.fire({
            icon: "success",
            title: "Buscar vuelos",
            text: "Vuelos agregados al carrito.",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true
          }).then(() => {
            this.router.navigate(['/cart']);
          });

          this.cartService.addToCart([oneWayFlight], this.tripType);
          // console.log('Carrito: ', this.cartService.getCartData());
          // window.alert('Vuelo agregado al carrito exitosamente');
          this.selectedFlight = null;
          this.selectedClassIda = null;
        } else {
          Swal.fire({
            icon: "error",
            title: "Buscar vuelos",
            text: "Debes iniciar sesión para añadir vuelos al carrito.",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true
          }).then(() => {
            this.router.navigate(['/login']);
          });
        }
      } else {
        window.alert('Debe seleccionar un vuelo.');
      }
    }
  }
}