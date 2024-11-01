import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalService } from '../../../../services/modal.service';
import { JwtService } from '../../../../services/jwt.service';
import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'app-password-root',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './password-root.component.html',
  styleUrl: './password-root.component.css'
})
export class PasswordRootComponent implements OnInit{
  constructor(private passwordService: ModalService, private jwtService: JwtService, private apiService: ApiService){}

  ngOnInit(): void {
    
  }

  passwordForm = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(20), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&/-])[A-Za-z\d@$!%*?&/-]{8,20}$/)])
  })

  save() {
    if (this.passwordForm.valid) {
      // console.log(this.passwordForm.value);
      // console.log(this.jwtService.decodeToken());
      const data = {
        userID: this.jwtService.decodeToken()?.sub,
        password: this.passwordForm.value.password
      }
      this.apiService.putData('update/change-password', data).subscribe(
        (response) => {
          // console.log(response);
          window.alert('Contraseña actualizada');
          this.passwordService.$password.emit(false);
        },
        (error) => {
          console.error(error);
        }
      )
    } else {
      console.error('Formulario inválido');
    }
  }

  close(){
    this.passwordService.$password.emit(false);
  }
}
