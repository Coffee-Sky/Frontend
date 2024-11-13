import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ModalService } from '../../../services/modal.service';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { JwtService } from '../../../services/jwt.service';

@Component({
  selector: 'app-verify-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './verify-password.component.html',
  styleUrl: './verify-password.component.css'
})
export class VerifyPasswordComponent {

  token: string = '';

  isLoading: boolean = false;

  verifyPassword = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.pattern(/^[a-z]([a-z0-9.-]+)?@[a-z0-9]+.[a-z]{2,3}(.([a-z]{2}))?$/)]),
    password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&/<>+-])[A-Za-z\d@$!%*?&/<>+-]{8,20}$/)]),
  })

  constructor(private verifyPasswordService: ModalService, private passwordService: ModalService, private apiService: ApiService, private jwtService: JwtService){}

  save(){
    if(this.verifyPassword.valid){
      this.submitInfo();
    }
    else{
      console.error('Formulario invalido');
      window.alert('Ingrese la información correctamente.');
    }
  }
  
  submitInfo() {
    this.isLoading = true;
    this.apiService.postData("auth/login", this.verifyPassword.value).subscribe(
      (response) => {
        this.token = response['token'];
        if(this.jwtService.verifyIdRole(this.token)){
          this.close();
          this.passwordService.$password.emit(true);
        }
        else{
          window.alert('No tiene permisos para acceder. Vuelva a iniciar sesión.');
          this.jwtService.removeToken();
          window.location.reload();
        }
      },
      (error) => {
        console.error('Error iniciando sesión:', error);
        window.alert('Credenciales incorrectas.');
      }
    );
  }

  close(){
    this.verifyPasswordService.$verifyPassword.emit(false);
  }
}