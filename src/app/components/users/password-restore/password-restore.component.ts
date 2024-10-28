import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalService } from '../../../services/modal.service';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-password-restore',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './password-restore.component.html',
  styleUrl: './password-restore.component.css'
})
export class PasswordRestoreComponent {
  constructor(private passwordService: ModalService, private apiService: ApiService){}

  ngOnInit(): void {
    
  }

  emailForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.pattern(/^[a-z]([a-z0-9.-]+)?@[a-z0-9]+.[a-z]{2,3}(.([a-z]{2}))?$/)]),
  })

  save() {
    if (this.emailForm.valid) {
      this.apiService.getData('update/recover-password?email='+this.emailForm.value.email).subscribe(
        (response) => {
          // console.log('Contraseña enviada al correo:', response);
          window.alert("Se ha enviado el correo para recuperar tu contraseña.")
        },
        (error) => {
          console.error('Error:', error);
          window.alert('No se ha podido enviar la contraseña al correo, inténtelo nuevamente.');
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
