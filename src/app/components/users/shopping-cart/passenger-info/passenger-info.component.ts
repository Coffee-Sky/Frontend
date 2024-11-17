import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeaderComponent } from '../../../home/header/header.component';
import { CartService } from '../../../../services/cart.service';
import { RouterModule } from '@angular/router';

interface CartFlight {
  flightID: number;
  tripType: string;
  origin: string;
  destiny: string;
  departure: string;
  passengers: number;
  selectedClass: 'economy' | 'firstClass';
  price: number;
}

interface CartItem {
  id: string;
  flights: CartFlight[];
  tripType: string;
}

@Component({
  selector: 'app-passenger-info',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent, RouterModule],
  templateUrl: './passenger-info.component.html',
  styleUrl: './passenger-info.component.css'
})
export class PassengerInfoComponent implements OnInit {
  cartItems: CartItem[] = [];
  flightForms: { [key: string]: FormGroup } = {};
  maxDate: string = new Date().toISOString().split('T')[0];

  constructor(private fb: FormBuilder, private cartService: CartService) {}

  ngOnInit() {
    this.cartItems = this.cartService.getCartData();
    this.createFormsForFlights();
  }

  createFormsForFlights() {
    this.cartItems.forEach(item => {
      this.flightForms[item.id] = this.fb.group({
        flightInfo: this.fb.group({
          tripType: [item.tripType],
          origin: [item.flights[0].origin],
          destiny: [item.flights[0].destiny],
        }),
        passengers: this.fb.array([])
      });

      const passengersArray = this.getPassengersArray(item.id);
      for (let i = 0; i < item.flights[0].passengers; i++) {
        passengersArray.push(this.createPassengerForm());
      }
    });
  }

  getPassengersArray(flightId: string): FormArray {
    return this.flightForms[flightId].get('passengers') as FormArray;
  }

  createPassengerForm(): FormGroup {
    return this.fb.group({
      firstname: ['', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/)]],
      secondname: ['', Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/)],
      firstlastname: ['', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/)]],
      secondlastname: ['', Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/)],
      genderID: ['', Validators.required],
      identificationtype: ['', Validators.required],
      identificationnumber: ['', Validators.required],
      bornDate: ['', Validators.required],
      borncountry: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(/^[a-z]([a-z0-9.-]+)?@[a-z0-9]+.[a-z]{2,3}(.([a-z]{2}))?$/)]],
    });
  }

  hasAdult(flightId: string): boolean {
    const passengers = this.getPassengersArray(flightId);
    return passengers.controls.some(control => 
      !this.isChild(control.get('bornDate')?.value)
    );
  }

  hasDuplicateDocuments(flightId: string): boolean {
    const passengers = this.getPassengersArray(flightId);
    const documents = passengers.controls
      .map(control => control.get('identificationnumber')?.value)
      .filter(doc => doc);
    return documents.length !== new Set(documents).size;
  }

  isChild(bornDate: string): boolean {
    if (!bornDate) return false;
    
    const today = new Date();
    const birth = new Date(bornDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age < 18;
  }

  isFormValid(flightId: string): boolean {
    return this.flightForms[flightId].valid && 
           this.hasAdult(flightId) && 
           !this.hasDuplicateDocuments(flightId);
  }

  areAllFormsValid(): boolean {
    return Object.keys(this.flightForms).every(id => this.isFormValid(id));
  }

  save() {
    if (this.areAllFormsValid()) {
      const formData = Object.entries(this.flightForms).map(([id, form]) => ({
        flightId: id,
        ...form.value
      }));
      console.log('Datos de todos los formularios:', formData);
    } else {
      console.log('Hay formularios inválidos');
    }
  }
}