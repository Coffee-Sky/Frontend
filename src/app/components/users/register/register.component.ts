import { Component } from '@angular/core';
import { EmailValidator, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { threadId } from 'node:worker_threads';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  registerForm = new FormGroup({
    firstname: new FormControl('', Validators.required),
    secondname: new FormControl(''),
    firstlastname: new FormControl('', Validators.required),
    secondlastname: new FormControl(''),
    genderID: new FormControl('', Validators.required),
    identificationnumber: new FormControl('', Validators.required),
    borncountry: new FormControl('', Validators.required),
    bornstate: new FormControl('', Validators.required),
    borncity: new FormControl('', Validators.required),
    bornDate: new FormControl('', Validators.required),
    username: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
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
