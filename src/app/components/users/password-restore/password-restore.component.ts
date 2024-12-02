import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalService } from '../../../services/modal.service';
import { ApiService } from '../../../services/api.service';

// import 'sweetalert2/src/sweetalert2.scss';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-password-restore',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './password-restore.component.html',
  styleUrl: './password-restore.component.css'
})
export class PasswordRestoreComponent {

  isLoading: boolean = false;

  constructor(private passwordService: ModalService, private apiService: ApiService){}

  ngOnInit(): void {
    
  }

  emailForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.pattern(/^[a-z]([a-z0-9.-]+)?@[a-z0-9]+.[a-z]{2,3}(.([a-z]{2}))?$/)]),
  })

  save() {
    if (this.emailForm.valid) {
      this.isLoading = true;
      this.apiService.getData('update/recover-password?email='+this.emailForm.value.email).subscribe(
        (response) => {
          // console.log('Contraseña enviada al correo:', response);
          Swal.fire({
            icon: "success",
            title: "Recuperar contraseña",
            text: "Se ha enviado el correo para recuperar tu contraseña.",
            showConfirmButton: false,
            timer: 2500,
            timerProgressBar: true
          }).then(() => {
            this.close();
          });
        },
        (error) => {
          console.error('Error:', error);
          // window.alert('No se ha podido enviar la contraseña al correo, inténtelo nuevamente.');
          Swal.fire({
            icon: "error",
            title: "Recuperar contraseña",
            text: "Vuelve a intentarlo.",
            confirmButtonColor: "#0F766E",
            showConfirmButton: false,
            timer: 2500,
            timerProgressBar: true
          }).then(() => {
            this.close();
          });
        }
      );
    } else {
      console.error('Formulario inválido');
    }
  }

  close(){
    this.passwordService.$password.emit(false);
  }

}
