import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../home/header/header.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [HeaderComponent, CommonModule, RouterModule],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.css'
})
export class CartPageComponent implements OnInit {

  total = 578000;

  flights = [
    { flightID: 1, type: 'Nacional', origin: 'Bogotá', destiny: 'Pereira', passengers: 2, price: 578000},
  ]

  constructor() { }

  ngOnInit(): void {
  }

  deleteFlightFunction(flightID: number){
    console.log(flightID);
  }

}
