import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, formatDate } from '@angular/common';


@Component({
  selector: 'app-page',
  standalone: true,
  imports: [HeaderComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './page.component.html',
  styleUrl: './page.component.css'
})
export class PageComponent implements OnInit{
  minDepartureDate = new Date().toISOString().split('T')[0];  // Fecha actual como mínima para ida
  selectedDepartureDate: string = '';  // Para almacenar la fecha de ida seleccionada

  cities: string[] = ['Arauca',
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
                      'Yopal']

  cities_destination: { [key: string]: string[] } = {
    national: ['Bogotá', 'Cali', 'Cartagena', 'Medellín', 'Pereira'],
    international: ['Buenos Aires', 'Londres', 'Madrid', 'Miami', 'New York']
  };

  availableDestinationCities: string[] = [];

  searchForm = new FormGroup({
    tripType: new FormControl('roundtrip'),
    origin: new FormControl('', Validators.required),
    destination: new FormControl('', Validators.required),
    departureDate: new FormControl('', Validators.required),
    returnDate: new FormControl(''),
    passengers: new FormControl(1, Validators.required),
  });

  constructor() {
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
    this.searchForm.get('origin')?.valueChanges.subscribe(origin => {
      if (origin) {
        this.updateDestinationCities();
        this.searchForm.patchValue({
          destination: ''
        });
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
      console.log(this.searchForm.value);
    } else {
      console.log('Formulario invalido');
    }
  }
}
