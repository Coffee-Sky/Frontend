import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../home/header/header.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


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

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [HeaderComponent, CommonModule, RouterModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent implements OnInit{

  purchaseStatus = 1; // 1: Compra realizada, 2: Compra cancelada

  flights: CartFlight[][] = [
    [
      {flightID: 1, tripType: 'roundtrip', origin: 'Pereira', destiny: 'Miami', departure: '2024-12-06T14:00:00', passengers: 1, selectedClass: 'economy', price: 200},
      {flightID: 2, tripType: 'roundtrip', origin: 'Miami', destiny: 'Pereira', departure: '2024-12-06T14:00:00', passengers: 1, selectedClass: 'firstClass', price: 200},
    ],
    [
      {flightID: 3, tripType: 'oneway', origin: 'Pereira', destiny: 'Miami', departure: '2024-12-06T14:00:00', passengers: 3, selectedClass: 'firstClass', price: 400},
    ],
  ]

  constructor() { }

  ngOnInit(): void {
  }

  cancelPurchase(flightID: number) {
    console.log('Cancelar compra de vuelo con ID: ', flightID);
  }
}
