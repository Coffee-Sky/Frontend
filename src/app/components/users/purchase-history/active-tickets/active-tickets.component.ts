import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../home/header/header.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PurchaseInfoComponent } from '../purchase-info/purchase-info.component';
import { ApiService } from '../../../../services/api.service';
import { JwtService } from '../../../../services/jwt.service';


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
  selector: 'app-active-tickets',
  standalone: true,
  imports: [HeaderComponent, CommonModule, RouterModule, PurchaseInfoComponent],
  templateUrl: './active-tickets.component.html',
  styleUrl: './active-tickets.component.css'
})
export class ActiveTicketsComponent {
  purchaseStatus = 1; // 1: Compra realizada, 2: Compra cancelada

  purchaseInfoView = false;

  id: string = '';

  passengersFlight: Passenger[] = []

  flights: CartFlight[][] = [
    [
      {flightID: 1, tripType: 'roundtrip', origin: 'Pereira', destiny: 'Miami', departure: '2024-12-06T14:00:00', passengers: 1, selectedClass: 'economy', price: 200},
      {flightID: 2, tripType: 'roundtrip', origin: 'Miami', destiny: 'Pereira', departure: '2024-12-06T14:00:00', passengers: 1, selectedClass: 'firstClass', price: 200},
    ],
    [
      {flightID: 3, tripType: 'oneway', origin: 'Pereira', destiny: 'Miami', departure: '2024-12-06T14:00:00', passengers: 3, selectedClass: 'firstClass', price: 400},
    ],
  ]

  purchases: Purchase[] = [];

  constructor(private apiService: ApiService, private jwtService: JwtService) { }

  ngOnInit(): void {
    this.getInfoPurchases();
  }

  getInfoPurchases(){
    this.apiService.getData('cart/get-active-purchases?clientId='+this.jwtService.getCode()).subscribe(
      (response: Purchase[]) => {
        this.purchases = response;
        console.log('Información de compras activas:', this.purchases);
      },
      (error) => {
        console.error('Error obteniendo las compras activas:', error);
      }
    );

  }

  infoView(flightId: string, passengers: Passenger[]): void {
    console.log('Mostrar información de vuelo con ID: ', flightId);
    this.id = flightId;
    this.passengersFlight = passengers;
    this.purchaseInfoView = !this.purchaseInfoView;
  }

  cancelPurchase(flightID: number) {
    console.log('Cancelar compra de vuelo con ID: ', flightID);
  }

}
