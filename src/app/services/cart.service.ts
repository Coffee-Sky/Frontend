import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './api.service';
import { JwtService } from './jwt.service';

interface CartFlight {
  flightID: number;
  tripType: string;
  origin: string;
  destiny: string;
  departure: string;
  passengers: number;
  selectedClass: 'economy' | 'business' | null;
  price: number;
}

interface CartItem {
  id: string; // Identificador único para el grupo de vuelos (para poder manejar como grupo los vuelos de ida y vuelta)
  flights: CartFlight[];
  tripType: string;
}

interface FlightCart {
  clientId: number;
  outboundFlightId: number;
  outboundClassType: string;
  quantity: number;
  isRoundTrip: boolean;
  returnFlightId: number;
  returnClassType: string;
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

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private apiService: ApiService, private jwtService: JwtService) { }

  private cartItems = new BehaviorSubject<any[]>([]);
  flightData$ = this.cartItems.asObservable();

  addToCart(flights: CartFlight[], tripType: string) {
    const currentCartItems = this.cartItems.value;
    const cartItem: CartItem = {
      id: `${Date.now()}`, // Generamos un ID único para el grupo de vuelos
      flights: [...flights],
      tripType
    };
    
    const updatedCartItems = [...currentCartItems, cartItem];
    this.cartItems.next(updatedCartItems);
  }

  uplodadCartItems(flights: FlightCart) {
    if(flights){
      console.log('Vuelos:', flights);
      this.apiService.postData('cart/add-flight', flights).subscribe(
        (response) => {
          console.log('Funcionaaa');
        },
        (error) => {
          console.error('Error al subir los vuelos al carrito:', error);
        }
      );
    }
  }

  getCartItems(): Observable<CartFlights[]> {
    return this.apiService.getData('cart/get-cart-flights?clientId=' + this.jwtService.getCode());
  }
  
  getCartData() {
    return this.cartItems.value;
  }

  removeFromCart(id: string) {
    const currentItems = this.cartItems.getValue();
    const updatedItems = currentItems.filter(item => item.id !== id);
    this.cartItems.next(updatedItems);
  }

  getPassengersNumber() {
    return this.cartItems.value.reduce((sum, item) => {
      // Tomamos los pasajeros del primer vuelo ya que serán los mismos para todo el grupo
      return sum + item.flights[0].passengers;
    }, 0);
  }

  clearCart() {
    this.cartItems.next([]);
  }
}