import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
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

@Component({
  selector: 'app-purchase-info',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent],
  templateUrl: './purchase-info.component.html',
  styleUrl: './purchase-info.component.css'
})
export class PurchaseInfoComponent implements OnInit{

  purchaseStatus = 1; // 1: Compra realizada, 2: Compra cancelada

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

  constructor() { }

  ngOnInit(): void {
  }

  cancelPurchase(flightID: number) {
    console.log('Cancelar compra de vuelo con ID: ', flightID);
  }

}
