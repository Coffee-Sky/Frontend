import { Component, OnInit } from '@angular/core';
import { CreateAdminService } from '../../../../services/modal/create-admin.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'app-creation-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './creation-admin.component.html',
  styleUrl: './creation-admin.component.css'
})
export class CreationAdminComponent implements OnInit{

  constructor(private createAdminService: CreateAdminService,
              private apiService: ApiService
  ){
  }

  ngOnInit(): void {
    
  }

  creationForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.pattern(/^[a-z]([a-z0-9.-]+)?@[a-z0-9]+.[a-z]{2,3}(.([a-z]{2}))?$/)]),
  })

  save() {
    console.log(this.creationForm.value);
    if (this.creationForm.valid) {
      console.log(this.creationForm.value);
      this.apiService.postData('sign-up/register-admin', this.creationForm.value).subscribe(
        (response) => {
          console.log(response);
          window.alert('Administrador creado con éxito');
          this.createAdminService.$create.emit(false);
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      console.log('Formulario inválido');
    }
  }

  close(){
    this.createAdminService.$create.emit(false);
  }
  
}
