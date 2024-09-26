import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { EmailValidator, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { threadId } from 'node:worker_threads';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  registerForm = new FormGroup({
    firstname: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/)]),
    secondname: new FormControl(''),
    firstlastname: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/)]),
    secondlastname: new FormControl(''),
    genderID: new FormControl('', Validators.required),
    identificationnumber: new FormControl('', [Validators.required, Validators.pattern(/^(1\d{9}|[1-9]\d{7})$/)]),
    borncountry: new FormControl('', Validators.required),
    bornstate: new FormControl('', Validators.required),
    borncity: new FormControl('', Validators.required),
    bornDate: new FormControl('', Validators.required),
    username: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.pattern(/^[a-z]([a-z0-9.-]+)?@[a-z0-9]+.[a-z]{2,3}(.([a-z]{2}))?$/)]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  save() {
    if ( this.registerForm.valid) {
      console.log(this.registerForm.value);
    } else {
      console.log('Formulario invalido');
    }
  }
}
