import { CommonModule, registerLocaleData } from '@angular/common';
import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import localeEs from '@angular/common/locales/es';
import { SearchFlightService } from '../../../services/search-flight.service';
import { SearchFlightsComponent } from '../search-flights/search-flights.component';
import { ModalService } from '../../../services/modal.service';

registerLocaleData(localeEs, 'es');

@Component({
  selector: 'app-flights',
  standalone: true,
  imports: [RouterLink, CommonModule, SearchFlightsComponent],
  providers: [{ provide: LOCALE_ID, useValue: 'es' }],
  templateUrl: './flights.component.html',
  styleUrl: './flights.component.css'
})
export class FlightsComponent implements OnInit {

  vuelosIda: any[] = [];
  vuelosVuelta: any[] = [];
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
  selectedClassIda: 'economy' | 'firstClass' | null = null;
  selectedClassVuelta: 'economy' | 'firstClass' | null = null;
  editingSearch: boolean = false;

  constructor(private searchFlightService: SearchFlightService, private editSearchService: ModalService) { }

  ngOnInit(): void {
    this.editSearchService.$edit.subscribe((value)=>{this.editingSearch = value})
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
      // console.log('vuelos: ', flights)
      // console.log('origin: ', this.origin)
      // console.log('destination: ', this.destination)
      // console.log('departureDate: ', this.departureDate)
      // console.log('returnDate', this.returnDate)
      if (this.tripType === 'roundtrip') {
        this.vuelosVuelta = flights.filter((vuelo: { origin: string; destination: string; departureDate: Date | null; }) => vuelo.origin === this.destination && vuelo.destination === this.origin && vuelo.departureDate === this.returnDate);
        this.vuelosIda = flights.filter((vuelo: { origin: string; destination: string; departureDate: Date | null; }) => vuelo.origin === this.origin && vuelo.destination === this.destination && vuelo.departureDate === this.departureDate);
        // console.log('vuelos ida: ', this.vuelosIda);
        // console.log('vuelos vuelta: ', this.vuelosVuelta);
      } else {
        this.vuelosIda = flights.filter((vuelo: { origin: string; destination: string; departureDate: Date | null; }) => vuelo.origin === this.origin && vuelo.destination === this.destination && vuelo.departureDate === this.departureDate);
      }
    });
  }

  editSearch(){
    this.editingSearch = true;
  }

  close(){
    this.editSearchService.$edit.emit(false);
  }

  formatTime(time: string): string {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes.padStart(2, '0')} ${period}`;
  }

  selectFlight(vuelo: any): void {
    if (this.selectedFlight === vuelo) {
      if (!this.selectedClassIda) {
        this.selectedFlight = null;
        this.selectedClassIda = null;
      }
    } else {
      this.selectedFlight = vuelo;
      this.selectedClassIda = null;
    }
    console.log('vuelo ida: ', this.selectedFlight);
  }

  selectReturnFlight(vuelo: any): void {
    if (this.selectedReturnFlight === vuelo) {
      if (!this.selectedClassVuelta) {
        this.selectedReturnFlight = null;
        this.selectedClassVuelta = null;
      }
    } else {
      this.selectedReturnFlight = vuelo;
      this.selectedClassVuelta = null;
    }
    console.log('vuelo regreso: ', this.selectedReturnFlight);
  }

  selectClass(classType: 'economy' | 'firstClass', tipo: 'ida' | 'vuelta'): void {
    if (tipo === 'ida') {
      this.selectedClassIda = classType;
    } else {
      this.selectedClassVuelta = classType;
    }
  }

  isFlightSelected(vuelo: any, tipo: 'ida' | 'vuelta'): boolean {
    if (tipo === 'ida') {
      return this.selectedFlight === vuelo && this.selectedClassIda !== null;
    } else {
      return this.selectedReturnFlight === vuelo && this.selectedClassVuelta !== null;
    }
  }

  getSelectedPrice(vuelo: any, tipo: 'ida' | 'vuelta'): number {
    const selectedClass = tipo === 'ida' ? this.selectedClassIda : this.selectedClassVuelta;
    return selectedClass === 'firstClass' ? vuelo.priceFirstClass : vuelo.priceEconomy;
  }

}