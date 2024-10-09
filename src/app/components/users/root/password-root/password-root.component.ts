import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PasswordRootService } from '../../../../services/modal/password-root.service';

@Component({
  selector: 'app-password-root',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './password-root.component.html',
  styleUrl: './password-root.component.css'
})
export class PasswordRootComponent implements OnInit{
  constructor(private passwordService: PasswordRootService){}

  ngOnInit(): void {
    
  }

  passwordForm = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(20), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&/-])[A-Za-z\d@$!%*?&/-]{8,20}$/)])
  })

  save() {
    if (this.passwordForm.valid) {
      console.log(this.passwordForm.value);
    } else {
      console.log('Formulario inválido');
    }
  }

  close(){
    this.passwordService.$password.emit(false);
  }
}
