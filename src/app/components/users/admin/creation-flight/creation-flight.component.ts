import { CommonModule, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'app-creation-flight',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './creation-flight.component.html',
  styleUrl: './creation-flight.component.css'
})

export class CreationFlightComponent implements OnInit{
  minDepartureDate = new Date().toISOString().split('T')[0];

  cities_origin: string[] = ['Arauca',
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

  cities: { [key: string]: string[] } = {
    national: ['Bogotá', 'Cali', 'Cartagena', 'Medellín', 'Pereira'],
    international: ['Buenos Aires', 'Londres', 'Madrid', 'Miami', 'New York']
  };

  availableOriginCities: string[] = [];
  availableDestinationCities: string[] = [];

  constructor(private apiService: ApiService) {
  }

  ngOnInit(): void {
    this.creationForm.get('type')?.valueChanges.subscribe(type => {
      if (type) {
        this.updateOriginCities(type);
        this.creationForm.patchValue({
          origin: '',
          destination: ''
        }
      )}
    });
    this.creationForm.get('origin')?.valueChanges.subscribe(origin => {
      if (origin) {
        this.updateDestinationCities();
        this.creationForm.patchValue({
          destination: ''
        })
      }
    });
    this.creationForm.get('departureDate')?.valueChanges.subscribe(() => {
      this.creationForm.get('departureTime')?.updateValueAndValidity();
    });
    this.creationForm.get('type')?.valueChanges.subscribe(() => {
      this.creationForm.get('departureTime')?.updateValueAndValidity();
    });

  }

  creationForm = new FormGroup({
    origin: new FormControl('', [Validators.required]),
    departureDate: new FormControl('', [Validators.required]),
    departureTime: new FormControl('', [Validators.required, this.departureTimeValidator.bind(this)]),
    type: new FormControl('', [Validators.required]),
    destination: new FormControl('', [Validators.required]),
    //duration: new FormControl('', [Validators.required]),
    priceFirstClass: new FormControl('', [Validators.required, Validators.pattern(/^\d+$/)]),
    priceEconomy: new FormControl('', [Validators.required, Validators.pattern(/^\d+$/)]),
  }, { validators: this.priceValidator });

  onPriceInput(event: Event, controlName: string) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/[^\d]/g, ''); // Remover todo excepto números
    if (value) {
      this.creationForm.get(controlName)?.setValue(Number(value), {emitEvent: false});
    }
  }

  priceValidator(group: AbstractControl): ValidationErrors | null {
    const firstClass = group.get('priceFirstClass')?.value;
    const economy = group.get('priceEconomy')?.value;
    if (firstClass && economy && Number(economy) >= Number(firstClass)) {
      return { invalidPrice: true };
    }
    return null;
  }

  updateOriginCities(type: string) {
    if (type === 'Nacional') { // Nacional
      this.availableOriginCities = this.cities_origin;
    } else if (type === 'Internacional') { // Internacional
      this.availableOriginCities = [...this.cities['national'], ...this.cities['international']].sort();
    }
  }

  updateDestinationCities() {
    const type = this.creationForm.get('type')?.value;
    const origin = this.creationForm.get('origin')?.value;
    if (!type || !origin) {
      this.availableDestinationCities = [];
      return;
    }
    if (type === 'Nacional') { // Nacional
      // Si es vuelo nacional, solo mostrar ciudades nacionales excepto la de origen
      this.availableDestinationCities = this.cities_origin.filter(city => city !== origin);
    } else { // Internacional
      // Si el origen es nacional, mostrar solo ciudades internacionales
      if (this.cities['national'].includes(origin)) {
        this.availableDestinationCities = this.cities['international'];
      } 
      // Si el origen es internacional, mostrar solo ciudades nacionales
      else if (this.cities['international'].includes(origin)) {
        this.availableDestinationCities = this.cities['national'];
      }
    }
  }

  departureTimeValidator(control: FormControl): ValidationErrors | null {
    if (!control.value) return null;
    const type = this.creationForm.get('type')?.value;
    const selectedDate = this.creationForm.get('departureDate')?.value;
    if (!type || !selectedDate) return null;
    // Convertir la fecha y hora seleccionada a un objeto Date
    const [hours, minutes] = control.value.split(':');
    const selectedDateTime = new Date(selectedDate);
    selectedDateTime.setDate(selectedDateTime.getDate() + 1);
    selectedDateTime.setHours(parseInt(hours), parseInt(minutes));
    const now = new Date();
    // Si la fecha seleccionada es posterior a hoy, no aplicar validación de hora
    if (selectedDateTime.toDateString() !== now.toDateString()) {
      return null;
    }
    // Crear fecha límite según el tipo de vuelo
    const minDateTime = new Date();
    if (type === 'Nacional') { // Nacional
      minDateTime.setMinutes(minDateTime.getMinutes() + 90); // 1 hora y 30 minutos
    } else { // Internacional
      minDateTime.setMinutes(minDateTime.getMinutes() + 210); // 3 horas y 30 minutos
    }
    if (selectedDateTime < minDateTime) {
      const formattedMinTime = this.formatTime(minDateTime);
      return {
        invalidTime: {
          minTime: formattedMinTime,
          type: type === 'Nacional' ? 'nacional' : 'internacional'
        }
      };
    }
    return null;
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  getTimeErrorMessage(): string {
    const errors = this.creationForm.get('departureTime')?.errors;
    if (errors?.['invalidTime']) {
      return `Para vuelos ${errors['invalidTime'].type}es, la hora de salida debe ser después de ${errors['invalidTime'].minTime}`;
    }
    return '';
  }

  formatDate(): string {
    const departureDate = this.creationForm.value.departureDate;
    if (!departureDate) {
      throw new Error("Departure date is not defined");
    }
    const [year, month, day] = departureDate.split('-').map(Number);

    const departureTime = this.creationForm.value.departureTime;
    if (!departureTime) {
      throw new Error("Departure time is not defined");
    }
    const [hour, minute] = departureTime.split(':').map(Number);

    const date = new Date(Date.UTC(year, month - 1, day, hour, minute));

    return date.toISOString();
  }

  save() {
    if (this.creationForm.valid) {
      // console.log(this.creationForm.value);
  
      const departure = this.formatDate();
  
      const { origin, destination, type, priceEconomy, priceFirstClass } = this.creationForm.value;
  
      const flightInfo = {
        departure,
        origin,
        destiny: destination, 
        type,
        economyPrice: priceEconomy, 
        businessPrice: priceFirstClass 
      };
  
      // console.log('Información del vuelo a enviar:', flightInfo);

      this.apiService.postData('manage/create-flight', flightInfo).subscribe(
        (response) => {
          window.alert('Vuelo creado exitosamente.');
          window.location.href = '/admin';
        },
        (error) => {
          console.error('Error creando el vuelo:', error);
          window.alert('Error creando el vuelo. Inténtelo nuevamente.');
        }
      )
    } else {
      console.error("Error: Formulario no válido");
    }
  }
}