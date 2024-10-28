import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchFlightService {

  constructor() { }
  private searchCriteria = new BehaviorSubject<any>(null);
  private flightsSubject = new BehaviorSubject<any>([]);

  searchCriteria$ = this.searchCriteria.asObservable();
  flights$ = this.flightsSubject.asObservable();

  private flights = [
    { id: '1', departureTime: '12:06', arrivalTimeDestination: '13:06', origin: 'Bogotá',  destination: 'Cali', duration: '1h', priceEconomy: 190255, priceFirstClass: 380600 },
    { id: '2', departureTime: '12:39', arrivalTimeDestination: '13:39', origin: 'Bogotá',  destination: 'Cali', duration: '1h', priceEconomy: 190255, priceFirstClass: 380600 },
    { id: '3', departureTime: '09:18', arrivalTimeDestination: '10:19', origin: 'Bogotá',  destination: 'Cali', duration: '1h 1m', priceEconomy: 190255, priceFirstClass: 380600 },
    { id: '4', departureTime: '15:23', arrivalTimeDestination: '16:36', origin: 'Bogotá',  destination: 'Cali', duration: '1h 13m', priceEconomy: 226170, priceFirstClass: 452340 },
    { id: '5', departureTime: '03:38', arrivalTimeDestination: '04:51', origin: 'Bogotá',  destination: 'Cali', duration: '1h 13m', priceEconomy: 226170, priceFirstClass: 452340 },
    { id: '6', departureTime: '17:00', arrivalTimeDestination: '18:04', origin: 'Bogotá',  destination: 'Cali', duration: '1h 4m', priceEconomy: 226170, priceFirstClass: 452340 },
  ];

  setSearchCriteria(criteria: any) {
    this.searchCriteria.next(criteria);
    this.filterFlights(criteria);
  }

  private filterFlights(criteria: any) {
    if (!criteria) {
      this.flightsSubject.next([]);
      return;
    }

    let filterdFlights = this.flights.filter(flight => {
      return flight.origin === criteria.origin &&
        flight.destination === criteria.destination;
    });

    filterdFlights = filterdFlights.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
    this.flightsSubject.next(filterdFlights);
  }

}