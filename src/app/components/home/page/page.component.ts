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
  }

  save() {
    if (this.searchForm.valid) {
      console.log(this.searchForm.value);
    } else {
      console.log('Formulario invalido');
    }
  }

}
