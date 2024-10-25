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
      window.alert("Se ha enviado el correo para recuperar tu contraseña.")
      console.log(this.emailForm.value);
    } else {
      console.log('Formulario inválido');
    }
  }

  close(){
    this.passwordService.$password.emit(false);
  }

}
