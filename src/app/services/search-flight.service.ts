import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './api.service';

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


@Injectable({
  providedIn: 'root'
})
export class SearchFlightService {

  constructor(private apiService: ApiService) { }
  private searchCriteria = new BehaviorSubject<any>(null);
  private flightsSubject = new BehaviorSubject<any>([]);

  searchCriteria$ = this.searchCriteria.asObservable();
  flights$ = this.flightsSubject.asObservable() as Observable<FlightData>;

  // private flights = [
  //   { id: '1', departureDate: '2024-10-30', departureTime: '12:06', arrivalTimeDestination: '13:06', origin: 'Bogotá',  destination: 'Cali', duration: '1h', priceEconomy: 190255, priceFirstClass: 380600 },
  //   { id: '2', departureDate: '2024-10-30', departureTime: '12:39', arrivalTimeDestination: '13:39', origin: 'Bogotá',  destination: 'Cali', duration: '1h', priceEconomy: 190255, priceFirstClass: 380600 },
  //   { id: '3', departureDate: '2024-10-31', departureTime: '09:18', arrivalTimeDestination: '10:19', origin: 'Bogotá',  destination: 'Cali', duration: '1h 1m', priceEconomy: 190255, priceFirstClass: 380600 },
  //   { id: '4', departureDate: '2024-10-31', departureTime: '15:23', arrivalTimeDestination: '16:36', origin: 'Cali',  destination: 'Bogotá', duration: '1h 13m', priceEconomy: 226170, priceFirstClass: 452340 },
  //   { id: '5', departureDate: '2024-11-01', departureTime: '03:38', arrivalTimeDestination: '04:51', origin: 'Cali',  destination: 'Bogotá', duration: '1h 13m', priceEconomy: 226170, priceFirstClass: 452340 },
  //   { id: '6', departureDate: '2024-11-02', departureTime: '17:00', arrivalTimeDestination: '18:04', origin: 'Cali',  destination: 'Bogotá', duration: '1h 4m', priceEconomy: 226170, priceFirstClass: 452340 },
  // ];

  // setSearchCriteria(criteria: any) {
  //   this.searchCriteria.next(criteria);
  //   this.apiService.getData('data/search-flights?origin='+criteria.origin+'&destiny='+criteria.destiny+'&departure='+criteria.departure+'&arrival='+criteria.arrival+'&passengers='+criteria.passengers+'&tripType='+criteria.tripType).subscribe(
  //     (response: FlightData) => {
  //       this.flightsSubject.next(response);
  //     },
  //     (error) => {
  //       console.error('Error obteniendo los vuelos:', error);
  //       window.alert('Error obteniendo los vuelos');
  //     }
  //   );
  //   // this.filterFlights(criteria);
  // }

  setSearchCriteria(criteria: any) {
    this.searchCriteria.next(criteria);
    const data = {
      "origin": criteria.origin,
      "destiny": criteria.destiny,
      "departure": criteria.departure,
      "arrival": criteria.arrival,
      "passengers": criteria.passengers,
      "tripType": criteria.tripType
    }
    this.apiService.postData('data/search-flights', data).subscribe(
      (response: FlightData) => {
        this.flightsSubject.next(response);
      },
      (error) => {
        console.error('Error obteniendo los vuelos:', error);
        window.alert('Error obteniendo los vuelos');
      }
    );
  }

  // private filterFlights(criteria: any) {
  //   if (!criteria) {
  //     this.flightsSubject.next([]);
  //     return;
  //   }

  //   let filterdFlights = this.flights.filter(flight => {
  //     return flight.origin === criteria.origin &&
  //       flight.destination === criteria.destination || 
  //       flight.origin === criteria.destination &&
  //       flight.destination === criteria.origin;
  //   });

  //   filterdFlights = filterdFlights.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
  //   this.flightsSubject.next(filterdFlights);
  // }

}