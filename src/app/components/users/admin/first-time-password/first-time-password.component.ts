import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ModalService } from '../../../../services/modal.service';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { JwtService } from '../../../../services/jwt.service'; 

// import 'sweetalert2/src/sweetalert2.scss';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-first-time-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './first-time-password.component.html',
  styleUrl: './first-time-password.component.css'
})
export class FirstTimePasswordComponent {

  changePassword = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&/<>+-])[A-Za-z\d@$!%*?&/<>+-]{8,20}$/)]),
  })

  constructor(private firstTimePassword: ModalService, private apiService: ApiService, private jwtService: JwtService){}

  save(){
    if(this.changePassword.valid){
      this.submitInfo();
    }
    else{
      console.error('Formulario invalido');
      // window.alert('Ingrese la información correctamente.');
      Swal.fire({
        icon: "error",
        title: "Cambiar contraseña",
        text: "Ingrese la información correctamente.",
        confirmButtonColor: "#0F766E",
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true
      })
    }
  }
  
  submitInfo() {
    // this.apiService.postData("auth/login", this.changePassword.value).subscribe(
    //   (response) => {
    //     this.token = response['token'];
    //     if(this.jwtService.verifyIdRole(this.token)){
    //       this.close();
    //       this.passwordService.$password.emit(true);
    //     }
    //     else{
    //       window.alert('No tiene permisos para acceder. Vuelva a iniciar sesión.');
    //       this.jwtService.removeToken();
    //       window.location.reload();
    //     }
    //   },
    //   (error) => {
    //     console.error('Error iniciando sesión:', error);
    //     window.alert('Credenciales incorrectas.');
    //   }
    // );}
    const data = {
      userID: this.jwtService.decodeToken()?.sub,
      password: this.changePassword.value.password
    }
    this.apiService.putData('update/change-password', data).subscribe(
      (response) => {
        // console.log(response);
        // window.alert('Contraseña actualizada');
        // this.close();
        Swal.fire({
          icon: "success",
          title: "Cambiar contraseña",
          text: "Contraseña actualizada correctamente.",
          confirmButtonColor: "#0F766E",
          showConfirmButton: false,
          timer: 2500,
          timerProgressBar: true
        }).then(() => {
          this.close();
        });
      },
      (error) => {
        console.error(error);
      }
    )
  }

  close(){
    if(this.jwtService.decodeToken()?.role === 'ROLE_ADMIN'){
      window.location.href = '/profile';
    }
    this.firstTimePassword.$firstTimePassword.emit(false);
  }

}
