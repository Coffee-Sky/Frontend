import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../services/api.service';
import { ModalService } from '../../../../services/modal.service';

@Component({
  selector: 'app-creation-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './creation-admin.component.html',
  styleUrl: './creation-admin.component.css'
})
export class CreationAdminComponent implements OnInit{

  constructor(private createAdminService: ModalService,
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
      this.apiService.postDataWithHeaders('sign-up/register-admin', this.creationForm.value).subscribe(
        (response) => {
          console.log(response);
          window.alert('Administrador creado con éxito');
          this.createAdminService.$create.emit(false);
          window.location.reload();
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
