import { Component, OnInit } from '@angular/core';
import { CreateAdminService } from '../../../../services/modal/create-admin.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-creation-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './creation-admin.component.html',
  styleUrl: './creation-admin.component.css'
})
export class CreationAdminComponent implements OnInit{

  constructor(private createAdminService: CreateAdminService){
  }

  ngOnInit(): void {
    
  }

  creationForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.pattern(/^[a-z]([a-z0-9.-]+)?@[a-z0-9]+.[a-z]{2,3}(.([a-z]{2}))?$/)]),
  })

  save() {
    if (this.creationForm.valid) {
      console.log(this.creationForm.value);
    } else {
      console.log('Formulario inválido');
    }
  }

  close(){
    this.createAdminService.$create.emit(false);
  }
  
}
