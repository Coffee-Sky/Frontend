import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeaderComponent } from '../../../home/header/header.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-add-card',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HeaderComponent, RouterModule],
  templateUrl: './add-card.component.html',
  styleUrl: './add-card.component.css'
})
export class AddCardComponent implements OnInit {
  
  today = new Date().toISOString().split('T')[0];
  streetTypes = ['Autopista', 'Avenida', 'Calle', 'Carrera', 'Circular', 'Circunvalar', 'Diagonal', 'Manzana', 'Pasaje', 'Peatonal', 'Transversal', 'Vereda', 'Vía', 'Zona', 'Otro'];

  constructor() { }

  ngOnInit(): void {
  }

  cardForm = new FormGroup({
    type: new FormControl('', Validators.required),
    number: new FormControl('', [Validators.required, Validators.pattern(/^\d{16}$/)]),
    cvv: new FormControl('', [Validators.required, Validators.pattern(/^\d{3,4}$/)]),
    caducityDate: new FormControl('', Validators.required),
    balance: new FormControl('', [Validators.required, Validators.pattern(/^\d+$/)]),
    firstname: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/)]),
    secondname: new FormControl('', Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/)),
    firstlastname: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/)]),
    secondlastname: new FormControl('', Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/)),
    phone: new FormControl('', [Validators.required, Validators.pattern(/^\d{7,15}$/)]),
    country: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    neighborhood: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-z0-9\sÁÉÍÓÚáéíóúÑñ]+$/)]),
    streetType: new FormControl('', Validators.required),
    streetName: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-z0-9\sÁÉÍÓÚáéíóúÑñ]+$/)]),
    streetNumber1: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-z0-9]{1,5}$/)]),
    streetNumber2: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-z0-9]{1,5}$/)]),
    postalCode: new FormControl('', [Validators.required, Validators.pattern(/^\d{4,10}$/)]),
  });

  onBalanceInput(event: Event, controlName: string) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/[^\d]/g, ''); // Remover todo excepto números
    if (value) {
      this.cardForm.get(controlName)?.setValue(Number(value), {emitEvent: false});
    }
  }

  save() {
    if (this.cardForm.valid) {
      console.log(this.cardForm.value);
    } else {
      console.log("Error");
    }
  }
}
