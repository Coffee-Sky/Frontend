import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { HeaderComponent } from '../../../home/header/header.component';

interface CartFlight {
  flightID: number;
  tripType: string;
  origin: string;
  destiny: string;
  departure: string;
  passengers: number;
  selectedClass: 'economy' | 'firstClass';
  price: number;
}

interface Flight {
  flightId: number;
  complementaryFlightId: number;
  originCity: string;
  destinationCity: string;
  departure: string;
  quantity: number;
  classType: string;
  price: number;
  purchaseId: number;
}

interface Ticket {
  ticketId: number;
}

interface Passenger {
  id: number;
  ticketId: number;
  firstname: string;
  secondname: string;
  firstlastname: string;
  secondlastname: string;
  documentType: string;
  identificationnumber: string;
  bornDate: string;
  borncountry: string;
  gender: number;
  email: string;
}

interface Purchase {
  isRoundTrip: boolean;
  reservations: Flight[];
  ticketReservationIds: Ticket[];
  passengers: Passenger[];
  status: number;
  id: string;
}

@Component({
  selector: 'app-purchase-info',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent],
  templateUrl: './purchase-info.component.html',
  styleUrl: './purchase-info.component.css'
})
export class PurchaseInfoComponent implements OnInit{

  @Input() flightId: string = '';
  @Input() purchaseStatus: number = 0;
  @Input() purchases: Purchase[] = [];

  selectedPurchase: Purchase = {
    isRoundTrip: false,
    reservations: [],
    ticketReservationIds: [],
    passengers: [],
    status: 0,
    id: ''
  };

  displayedPassengers: Passenger[] = [];

  flights: CartFlight[][] = [
    [
      {flightID: 1, tripType: 'roundtrip', origin: 'Pereira', destiny: 'Miami', departure: '2024-12-06T14:00:00', passengers: 1, selectedClass: 'economy', price: 200},
      {flightID: 2, tripType: 'roundtrip', origin: 'Miami', destiny: 'Pereira', departure: '2024-12-06T14:00:00', passengers: 1, selectedClass: 'firstClass', price: 200},
    ],
  ]

  flights2: CartFlight[][] = [
    [
      {flightID: 3, tripType: 'oneway', origin: 'Pereira', destiny: 'Miami', departure: '2024-12-06T14:00:00', passengers: 3, selectedClass: 'firstClass', price: 400},
    ],
  ]

  passengers = [
    {firstname: 'Juan', secondname: '', firstlastname: 'Perez', secondlastname: '', genderID: 1, identificationtype: 1, identificationnumber: '123456789', bornDate: '2004-06-06', bornCountry: 'Colombia', email: 'juan@gmail.com'},
    {firstname: 'Chil', secondname: '', firstlastname: 'Perez', secondlastname: '', genderID: 2, identificationtype: 1, identificationnumber: '123456700', bornDate: '2014-12-06', bornCountry: 'Colombia', email: 'chil@gmail.com'},
  ]

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Filtrar el arreglo purchases para obtener la compra con el flightId
    this.selectedPurchase = this.purchases.find(purchase => purchase.id === this.flightId) || {
      isRoundTrip: false,
      reservations: [],
      ticketReservationIds: [],
      passengers: [],
      status: 0,
      id: ''
    };

    if (this.selectedPurchase) {
      console.log('Compra seleccionada:', this.selectedPurchase);

      const numberToDisplay = this.selectedPurchase.reservations[0].quantity;
      this.displayedPassengers = this.selectedPurchase.passengers.slice(0, numberToDisplay);
      
      console.log('Pasajeros a mostrar:', this.displayedPassengers);
    } else {
      console.warn('No se encontró una compra con el ID proporcionado:', this.flightId);
    }
  }

  goBack(): void {
    window.location.reload();
  }

  cancelPurchase(flightID: number) {
    console.log('Cancelar compra de vuelo con ID: ', flightID);
  }

}
