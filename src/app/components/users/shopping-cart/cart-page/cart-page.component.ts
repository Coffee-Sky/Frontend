import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../home/header/header.component';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../../../services/cart.service';
import { ApiService } from '../../../../services/api.service';
import { JwtService } from '../../../../services/jwt.service';

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
  flightsCart: CartFlights[] = [];

  constructor(private router: Router,
              private cartService: CartService,
              private apiService: ApiService,
              private jwtService: JwtService
            ) { }

  ngOnInit(): void {
    this.getFlights()
    // this.cartItems = this.cartService.getCartData();
    // this.updateTotal();
  }

  calculateFlightsCartTotal(): void {
    this.total = this.flightsCart.reduce((sum, cartFlight) => {
      return sum + cartFlight.flights.reduce((flightSum, flight) => flightSum + flight.price, 0);
    }, 0);
  }

  getFlights() {
    this.cartService.getCartItems().subscribe((flightsCart: CartFlights[]) => {
      this.flightsCart = flightsCart;
      // console.log('flightsCart:', flightsCart);
      this.calculateFlightsCartTotal();
    });
  }

  removeFlight(flightId: number, isRoundTrip: boolean){
    this.apiService.deleteData('cart/remove-flight?clientId='+this.jwtService.getCode()+'&flightId='+flightId+'&isRoundTrip='+isRoundTrip).subscribe(
      (response) => {
        this.getFlights();
      },
      (error) => {
        console.error('Error obteniendo las tarjetas del usuario:', error);
      }
    );
  }

  // removeFlight(groupId: string) {
  //   this.cartService.removeFromCart(groupId);
  //   this.cartItems = this.cartService.getCartData();
  //   this.updateTotal();
  // }

  // updateTotal() {
  //   this.total = this.cartItems.reduce((sum, item) => {
  //     const itemTotal = item.flights.reduce((flightSum, flight) => 
  //       flightSum + (flight.price * flight.passengers), 0);
  //     return sum + itemTotal;
  //   }, 0);
  // }

  buycartItems(){
    this.router.navigate(['/passenger-info']);
  }

  makeReservation(){
    this.router.navigate(['/passenger-info']);
  }

}