import { CommonModule, registerLocaleData } from '@angular/common';
import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import localeEs from '@angular/common/locales/es';
import { SearchFlightService } from '../../../services/search-flight.service';

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

  vuelos: any[] = [];
  origin: string = '';
  originCode: string = '';
  destination: string = '';
  destinationCode: string = '';
  departureDate: Date | null = null;
  returnDate: Date | null = null;
  passengers: number = 1;
  tripType: string = 'roundtrip';
  selectedFlight: any = null;
  selectedReturnFlight: any = null;

  constructor(private searchFlightService: SearchFlightService) { }

  ngOnInit(): void {
    this.searchFlightService.searchCriteria$.subscribe(criteria => {
      if (criteria) {
        this.tripType = criteria.tripType;
        this.origin = criteria.origin;
        this.originCode = criteria.originCode;
        this.destination = criteria.destination;
        this.destinationCode = criteria.destinationCode;
        this.departureDate = criteria.departureDate;
        this.returnDate = criteria.returnDate;
        this.passengers = criteria.passengers;
      }
    });

    this.searchFlightService.flights$.subscribe(flights => {
      this.vuelos = flights;
    });
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
    console.log('vuelo ida: ', this.selectedFlight);
  }

  selectReturnFlight(vuelo: any): void {
    this.selectedReturnFlight = this.selectedReturnFlight === vuelo ? null : vuelo;
    console.log('vuelo regreso: ', this.selectedReturnFlight);
  }

}

