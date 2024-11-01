import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeaderComponent } from '../../../home/header/header.component';
import { RouterModule } from '@angular/router';
import { JwtService } from '../../../../services/jwt.service';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-card',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HeaderComponent, RouterModule],
  templateUrl: './add-card.component.html',
  styleUrl: './add-card.component.css'
})
export class AddCardComponent implements OnInit {

  code: string = '';
  
  today = new Date().toISOString().split('T')[0];
  streetTypes = ['Autopista', 'Avenida', 'Calle', 'Carrera', 'Circular', 'Circunvalar', 'Diagonal', 'Manzana', 'Pasaje', 'Peatonal', 'Transversal', 'Vereda', 'Vía', 'Zona', 'Otro'];

  cardForm = new FormGroup({
    type: new FormControl('', Validators.required),
    cardNumber: new FormControl('', [Validators.required, Validators.pattern(/^\d{16}$/)]),
    cvv: new FormControl('', [Validators.required, Validators.pattern(/^\d{3}$/)]),
    expirationDate: new FormControl('', Validators.required),
    balance: new FormControl('', [Validators.required, Validators.pattern(/^\d+$/)]),
    cardHolderFirstName: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/)]),
    cardHolderSecondName: new FormControl('', Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/)),
    cardHolderFirstLastName: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/)]),
    cardHolderSecondLastName: new FormControl('', Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/)),
    cardHolderPhoneNumber: new FormControl('', [Validators.required, Validators.pattern(/^\d{7,15}$/)]),
    country: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    zone: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-z0-9\sÁÉÍÓÚáéíóúÑñ]+$/)]),
    streetType: new FormControl('', Validators.required),
    streetName: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-z0-9\sÁÉÍÓÚáéíóúÑñ]+$/)]),
    streetNumberOne: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-z0-9]{1,5}$/)]),
    streetNumberTwo: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-z0-9]{1,5}$/)]),
    postalCode: new FormControl('', [Validators.required, Validators.pattern(/^\d{4,10}$/)]),
    userId: new FormControl(''),
    cardHolderId: new FormControl('')
  });

  constructor(private jwtService: JwtService, private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {
    this.getCodeUser();
  }

  getCodeUser() {
    this.code = this.jwtService.getCode() ?? ''
  }

  onBalanceInput(event: Event, controlName: string) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/[^\d]/g, ''); // Remover todo excepto números
    if (value) {
      this.cardForm.get(controlName)?.setValue(Number(value), {emitEvent: false});
    }
  }

  changeExpirationDate(expirationDate: string) {
    const [year, month] = expirationDate.split('-'); // Dividimos por '-'
    return`${year}-${month}`
  }

  save() {
    if (this.cardForm.valid) {
      this.cardForm.get('userId')?.setValue(this.code);
      this.cardForm.get('cardHolderId')?.setValue(this.code);
      this.cardForm.get('expirationDate')?.setValue(this.changeExpirationDate(this.cardForm.get('expirationDate')?.value!));
      // console.log(this.cardForm.value);

      this.apiService.postData('update/enroll-card', this.cardForm.value).subscribe(
        (response) => {
          // console.log(response);
          window.alert('Tarjeta registrada correctamente.');
          this.router.navigate(['/cards']);
        },
        (error) => {
          console.error(error);
          window.alert('Error al registrar la tarjeta. Vuélvalo a intentar.');
        }
      );
    } else {
      console.error("Error");
    }
  }
}
