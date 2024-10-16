import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { JwtService } from '../../../services/jwt.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.pattern(/^[a-z]([a-z0-9.-]+)?@[a-z0-9]+.[a-z]{2,3}(.([a-z]{2}))?$/)]),
    // password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(20), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&/-])[A-Za-z\d@$!%*?&/-]{8,20}$/)])
    password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(20)])
  });

  constructor(private apiService: ApiService, private jwtService: JwtService) { }

  submitInfo() {
    this.apiService.postData("auth/login", this.loginForm.value).subscribe(
      (response) => {
        window.alert('Bienvenido');
        this.jwtService.setToken(response.token);
        console.log('Token:', response.token);
        const token = this.jwtService.decodeToken();
        console.log('Token decodificado:', token);
        window.location.href = '';
      },
      (error) => {
        console.error('Error iniciando sesión:', error);
        window.alert('Credenciales incorrectas.');
      }
    );
  }

  save() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
      this.submitInfo();
    } else {
      console.log('Formulario invalido');
    }
  }
}