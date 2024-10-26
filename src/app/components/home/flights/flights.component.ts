import { CommonModule, registerLocaleData } from '@angular/common';
import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import localeEs from '@angular/common/locales/es';

registerLocaleData(localeEs, 'es');

@Component({
  selector: 'app-flights',
  standalone: true,
  imports: [RouterLink, CommonModule],
  providers: [{ provide: LOCALE_ID, useValue: 'es' }],
  templateUrl: './flights.component.html',
  styleUrl: './flights.component.css'
})
export class FlightsComponent implements OnInit {

  origin = 'Bogotá';
  destination = 'Cali';
  departureDate = new Date('2024-11-10');
  returnDate = new Date('2024-11-13');
  passengers = 1;
  selectedFlight: any = null;

  vuelos= [
    { id: '1', departureTime: '12:06', arrivalTimeDestination: '13:06', origin: 'BOG', destination: 'CLO', duration: '1h', priceEconomy: 190255 },
    { id: '2', departureTime: '12:39', arrivalTimeDestination: '13:39', origin: 'BOG', destination: 'CLO', duration: '1h', priceEconomy: 190255 },
    { id: '3', departureTime: '09:18', arrivalTimeDestination: '10:19', origin: 'BOG', destination: 'CLO', duration: '1h 1m', priceEconomy: 190255 },
    { id: '4', departureTime: '13:40', arrivalTimeDestination: '14:41', origin: 'BOG', destination: 'CLO', duration: '1h 1m', priceEconomy: 0 },
    { id: '5', departureTime: '15:23', arrivalTimeDestination: '16:36', origin: 'BOG', destination: 'CLO', duration: '1h 13m', priceEconomy: 226170 },
    { id: '6', departureTime: '03:38', arrivalTimeDestination: '04:51', origin: 'BOG', destination: 'CLO', duration: '1h 13m', priceEconomy: 226170 },
    { id: '7', departureTime: '17:00', arrivalTimeDestination: '18:04', origin: 'BOG', destination: 'CLO', duration: '1h 4m', priceEconomy: 226170 },
  ].sort((a,b) => a.departureTime.localeCompare(b.departureTime));

  constructor() { }

  ngOnInit(): void {

  }

  formatTime(time: string): string {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes.padStart(2, '0')} ${period}`;
  }

  selectFlight(vuelo: any): void {
    this.selectedFlight = this.selectedFlight === vuelo ? null : vuelo;
  }

}
