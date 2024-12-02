import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../services/api.service';
import { ModalService } from '../../../../services/modal.service';

// import 'sweetalert2/src/sweetalert2.scss';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-creation-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './creation-admin.component.html',
  styleUrl: './creation-admin.component.css'
})
export class CreationAdminComponent implements OnInit{

  isLoading: boolean = false;

  constructor(private createAdminService: ModalService,
              private apiService: ApiService
  ){
  }

  ngOnInit(): void {
    
  }

  creationForm = new FormGroup({
    identificationnumber: new FormControl('', [Validators.required, Validators.pattern(/^(1\d{9}|[1-9]\d{7})$/)]),
    email: new FormControl('', [Validators.required, Validators.pattern(/^[a-z]([a-z0-9.-]+)?@[a-z0-9]+.[a-z]{2,3}(.([a-z]{2}))?$/)]),
  })

  save() {
    // console.log(this.creationForm.value);
    if (this.creationForm.valid) {
      // console.log(this.creationForm.value);
      this.isLoading = true;
      this.apiService.postData('sign-up/register-admin', this.creationForm.value).subscribe(
        (response) => {
          // console.log(response);
          // window.alert('Administrador creado con éxito');
          // this.createAdminService.$create.emit(false);
          // window.location.reload();
          Swal.fire({
            icon: "success",
            title: "Crear administrador",
            text: "Administrador creado con éxito.",
            confirmButtonColor: "#0F766E",
            showConfirmButton: false,
            timer: 2500,
            timerProgressBar: true
          }).then(() => {
            this.close();
            window.location.reload();
          });
        },
        (error) => {
          console.error(error);
          Swal.fire({
            icon: "error",
            title: "Crear administrador",
            text: "Hubo un error. Inténtelo nuevamente.",
            confirmButtonColor: "#0F766E",
            showConfirmButton: false,
            timer: 2500,
            timerProgressBar: true
          }).then(() => {
            this.close();
            window.location.reload();
          });
        }
      );
    } else {
      console.error('Formulario inválido');
    }
  }

  close(){
    this.createAdminService.$create.emit(false);
  }
  
}
