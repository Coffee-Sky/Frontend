import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../home/header/header.component';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../../../services/cart.service';

interface CartFlight  {
  flightID: number;
  tripType: string;
  origin: string;
  destiny: string;
  departure: string;
  passengers: number;
  selectedClass: 'economy' | 'firstClass' | null;
  price: number;
}

interface CartItem {
  id: string;
  flights: CartFlight[];
  tripType: string;
}

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [HeaderComponent, CommonModule, RouterModule],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.css'
})
export class CartPageComponent implements OnInit {

  // flights = [
  //   [
  //     { flightID: 1, tripType: 'roundtrip', origin: 'Bogotá', destiny: 'Pereira', passengers: 2, selectedClass: 'economy', price: 578000},
  //     { flightID: 2, tripType: 'roundtrip', origin: 'Pereira', destiny: 'Bogotá', passengers: 2, selectedClass: 'firstClass', price: 618000},
  //   ],
  //   { flightID: 3, tripType: 'roundtrip', origin: 'Cali', destiny: 'Medellin', passengers: 2, selectedClass: 'economy', price: 450000},
  // ];

  cartItems: CartItem[] = [];
  total: number = 0;

  constructor(private router: Router,
              private cartService: CartService) { }

  ngOnInit(): void {
    this.cartItems = this.cartService.getCartData();
    this.updateTotal();
  }

  removeFlight(groupId: string) {
    this.cartService.removeFromCart(groupId);
    this.cartItems = this.cartService.getCartData();
    this.updateTotal();
  }

  updateTotal() {
    this.total = this.cartItems.reduce((sum, item) => {
      const itemTotal = item.flights.reduce((flightSum, flight) => 
        flightSum + (flight.price * flight.passengers), 0);
      return sum + itemTotal;
    }, 0);
  }

  buycartItems(){
    this.router.navigate(['/passenger-info']);
  }

  makeReservation(){
    this.router.navigate(['/passenger-info']);
  }

}