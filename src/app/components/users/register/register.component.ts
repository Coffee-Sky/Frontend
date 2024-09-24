import { Component } from '@angular/core';
import { EmailValidator, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  registerForm = new FormGroup({
    firstname: new FormControl(''),
    secondname: new FormControl(''),
    firstlastname: new FormControl(''),
    secondlastname: new FormControl(''),
    genderID: new FormControl(''),
    identificationnumber: new FormControl(''),
    borncountry: new FormControl(''),
    bornstate: new FormControl(''),
    borncity: new FormControl(''),
    bornDate: new FormControl(''),
    username: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
  });

  save() {
    console.log(this.registerForm.value);
  }
}
