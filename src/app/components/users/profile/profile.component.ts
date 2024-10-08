import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{
  isEditing: boolean = false;
  originalValues: any;
  editProfileForm!: FormGroup;

  constructor(private fb: FormBuilder, private cdRef: ChangeDetectorRef) { 

  }

  ngOnInit(): void {
    this.editProfileForm = this.fb.group({
      firstname: ['Pedro', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/)]],
      secondname: ['jjjjjj', Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/)],
      firstlastname: ['Suarez', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/)]],
      secondlastname: ['', Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/)],
      genderID: [{value: '1', disabled: true}, Validators.required],
      identificationnumber: [{value: '12345678', disabled: true}],
      borncountry: [{value: 'Colombia', disabled: true}, Validators.required],
      bornstate: [{value: 'Risaralda', disabled: true}, Validators.required],
      borncity: [{value: 'Pereira', disabled: true}, Validators.required],
      bornDate: ['2000-06-06', Validators.required],
      username: ['Suarez123', [Validators.required, Validators.minLength(5), Validators.maxLength(12), Validators.pattern(/^[A-Za-z0-9_]+$/)]],
      email: [{value: 'Suarez123@gmail.com', disabled: true}],
      password: ['12w@waR4', [Validators.required, Validators.minLength(8), Validators.maxLength(20), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&/-])[A-Za-z\d@$!%*?&/-]{8,20}$/)]],
    });
    this.originalValues = this.editProfileForm.getRawValue();
    
  }

  toggleEdit() {
    console.log('entreeee');
    this.isEditing = true;
    this.cdRef.detectChanges();
    console.log('el valor es: ', this.isEditing);
    if (this.isEditing) {
      this.editProfileForm.controls['genderID'].enable();
      this.editProfileForm.controls['borncountry'].enable();
      this.editProfileForm.controls['bornstate'].enable();
      this.editProfileForm.controls['borncity'].enable();
    }
  }

  save() {
    if (this.editProfileForm.valid) {
      console.log(this.editProfileForm.value);
      this.isEditing = false;
      this.editProfileForm.controls['genderID'].disable();
      this.editProfileForm.controls['borncountry'].disable();
      this.editProfileForm.controls['bornstate'].disable();
      this.editProfileForm.controls['borncity'].disable();
    } else {
      console.log('Formulario invalido');
    }
  }

  cancel() {
    this.isEditing = false;
    this.editProfileForm.reset(this.originalValues);
    console.log('el valor en cancelar es: ', this.isEditing);
    this.editProfileForm.controls['genderID'].disable();
    this.editProfileForm.controls['borncountry'].disable();
    this.editProfileForm.controls['bornstate'].disable();
    this.editProfileForm.controls['borncity'].disable();
  }

  changePicture() {
    console.log('Cambiar imagen');
  }
}