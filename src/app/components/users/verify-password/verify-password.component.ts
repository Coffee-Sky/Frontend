import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ModalService } from '../../../services/modal.service';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { JwtService } from '../../../services/jwt.service';

import 'sweetalert2/src/sweetalert2.scss';
import Swal from 'sweetalert2';

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
      // window.alert('Ingrese la información correctamente.');
      Swal.fire({
        icon: "error",
        title: "Verificar contraseña",
        text: "Ingrese la información correctamente.",
        showConfirmButton: false,
        timer: 2000
      });
    }
  }
  
  submitInfo() {
    this.isLoading = true;
    this.apiService.postData("auth/login", this.verifyPassword.value).subscribe(
      (response) => {
        console.log(response)
        this.token = response['token'];
        if(this.jwtService.verifyIdRole(this.token)){
          this.close();
          this.passwordService.$password.emit(true);
        }
        else{
          // window.alert('No tiene permisos para acceder. Vuelva a iniciar sesión.');
          this.errorLogin();
        }
      },
      (error) => {
        console.error('Error iniciando sesión:', error);
        this.errorLogin();
      }
    );
  }

  errorLogin() {
    Swal.fire({
      icon: "error",
      title: "Verificar contraseña",
      text: "No tiene permisos para acceder. Vuelva a iniciar sesión.",
      // showCancelButton: false,
      showConfirmButton: false,
      // confirmButtonColor: "#0F766E",
      // cancelButtonColor: "#d33",
      // confirmButtonText: "Aceptar",
      timer: 2500,
      timerProgressBar: true
    }).then(() => {
      this.jwtService.removeToken();
      window.location.reload();
    });
  }

  close(){
    this.verifyPasswordService.$verifyPassword.emit(false);
  }
}