import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SearchFlightService } from '../../../services/search-flight.service';
import { Router } from '@angular/router';
import { ModalService } from '../../../services/modal.service';

@Component({
  selector: 'app-search-flights',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './search-flights.component.html',
  styleUrl: './search-flights.component.css'
})
export class SearchFlightsComponent implements OnInit{
  minDepartureDate = new Date().toISOString().split('T')[0];  // Fecha actual como mínima para ida
  selectedDepartureDate: string = '';  // Para almacenar la fecha de ida seleccionada
  editingSearch: boolean = false;
  cities: string[] = [
    'Arauca',
    'Armenia',
    'Barranquilla',
    'Bogotá',
    'Bucaramanga',
    'Cali',
    'Cartagena',
    'Cúcuta',
    'Florencia',
    'Ibagué',
    'Leticia',
    'Manizales',
    'Medellín',
    'Mitú',
    'Mocoa',
    'Montería',
    'Neiva',
    'Pasto',
    'Pereira',
    'Popayán',
    'Puerto Carreño',
    'Puerto Inírida',
    'Quibdó',
    'Riohacha',
    'San Andrés',
    'San José del Guaviare',
    'Santa Marta',
    'Sincelejo',
    'Tunja',
    'Valledupar',
    'Villavicencio',
    'Yopal'
  ];

  cities_destination: { [key: string]: string[] } = {
    national: ['Bogotá', 'Cali', 'Cartagena', 'Medellín', 'Pereira'],
    international: ['Buenos Aires', 'Londres', 'Madrid', 'Miami', 'New York']
  };

  availableDestinationCities: string[] = [];

  cityCodes: { [key: string]: string } = {
    'Arauca': 'AUC',
    'Armenia': 'AXM',
    'Barranquilla': 'BAQ',
    'Bogotá': 'BOG',
    'Bucaramanga': 'BGA',
    'Cali': 'CLO',
    'Cartagena': 'CTG',
    'Cúcuta': 'CUC',
    'Florencia': 'FLA',
    'Ibagué': 'IBE',
    'Leticia': 'LET',
    'Manizales': 'MZL',
    'Medellín': 'MDE',
    'Mitú': 'MVP',
    'Mocoa': 'VGZ',
    'Montería': 'MTR',
    'Neiva': 'NVA',
    'Pasto': 'PSO',
    'Pereira': 'PEI',
    'Popayán': 'PPN',
    'Puerto Carreño': 'PCR',
    'Puerto Inírida': 'PDA',
    'Quibdó': 'UIB',
    'Riohacha': 'RCH',
    'San Andrés': 'ADZ',
    'San José del Guaviare': 'SJE',
    'Santa Marta': 'SMR',
    'Sincelejo': 'CZU',
    'Tunja': 'TUN',
    'Valledupar': 'VUP',
    'Villavicencio': 'VVC',
    'Yopal': 'EYP',
    'Buenos Aires': 'EZE',
    'Londres': 'LHR',
    'Madrid': 'MAD',
    'Miami': 'MIA',
    'New York': 'JFK'
  };

  searchForm = new FormGroup({
    tripType: new FormControl('roundtrip'),
    origin: new FormControl('', Validators.required),
    originCode: new FormControl(''),
    destination: new FormControl('', Validators.required),
    destinationCode: new FormControl(''),
    departureDate: new FormControl('', Validators.required),
    returnDate: new FormControl(''),
    passengers: new FormControl(1, Validators.required),
  });

  constructor(private searchFlightService: SearchFlightService, private router: Router, private editSearchService: ModalService) {
    this.searchForm.get('departureDate')?.valueChanges.subscribe(value => {
      if (value) {
        this.selectedDepartureDate = value;
        const returnDate = this.searchForm.get('returnDate')?.value;
        if (returnDate && returnDate < value) {
          this.searchForm.get('returnDate')?.setValue('');
        }
      }
    });
    this.searchForm.get('tripType')?.valueChanges.subscribe(value => {
      const returnDateControl = this.searchForm.get('returnDate');
      if (value === 'roundtrip') {
        returnDateControl?.setValidators(Validators.required);
      } else {
        returnDateControl?.clearValidators();
        returnDateControl?.setValue('');
      }
      returnDateControl?.updateValueAndValidity();
    });

    if (this.searchForm.get('tripType')?.value === 'roundtrip') {
      this.searchForm.get('returnDate')?.setValidators(Validators.required);
    }
  }

  ngOnInit(): void {
    this.editSearchService.$edit.subscribe((value)=>{this.editingSearch = value})
    this.searchForm.get('origin')?.valueChanges.subscribe(origin => {
      if (origin) {
        this.updateDestinationCities();
        this.searchForm.get('originCode')?.setValue(this.cityCodes[origin] || '');
        this.searchForm.patchValue({
          destination: ''
        });
      }
    });
    this.searchForm.get('destination')?.valueChanges.subscribe(destination => {
      if (destination) {
        this.searchForm.get('destinationCode')?.setValue(this.cityCodes[destination] || '');
      }
    });
  }

  updateDestinationCities() {
    const origin = this.searchForm.get('origin')?.value;
    if (!origin) {
      this.availableDestinationCities = [];
      return;
    }
    if (this.cities_destination['national'].includes(origin)) {
      this.availableDestinationCities = this.cities_destination['international'].concat(this.cities).sort().filter(city => city !== origin);
    } else {
      this.availableDestinationCities = this.cities.filter(city => city !== origin);
    }
  }

  save() {
    if (this.searchForm.valid) {
      this.editSearchService.$edit.emit(false);
      this.searchFlightService.setSearchCriteria(this.searchForm.value);
      this.router.navigate(['/flights']);
      console.log(this.searchForm.value);
    } else {
      console.log('Formulario invalido');
    }
  }

}
