import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface CartFlight {
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
  id: string; // Identificador único para el grupo de vuelos (para poder manejar como grupo los vuelos de ida y vuelta)
  flights: CartFlight[];
  tripType: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor() { }

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