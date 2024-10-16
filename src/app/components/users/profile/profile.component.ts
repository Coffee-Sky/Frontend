import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CloudinaryService } from '../../../services/cloudinary.service';

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
  imageUrl: string = '';
  changingPicture: boolean = false;
  selectedFile: File | null = null;

  genders = [
    { id: 1, name: 'Masculino' },
    { id: 2, name: 'Femenino' },
    { id: 3, name: 'Otro' }
  ];

  constructor(private fb: FormBuilder, private cdRef: ChangeDetectorRef, private cloudinary: CloudinaryService) { 
  }

  ngOnInit(): void {
    this.editProfileForm = this.fb.group({
      firstname: ['Pedro', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/)]],
      secondname: ['jjjjjj', Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/)],
      firstlastname: ['Suarez', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/)]],
      secondlastname: ['', Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/)],
      genderID: [1, Validators.required],
      identificationnumber: [{value: '12345678', disabled: true}],
      borncountry: ['Colombia', Validators.required],
      bornstate: ['Risaralda', Validators.required],
      borncity: ['Pereira', Validators.required],
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
    }
  }

  getGenderName(genderID: number): string {
    const gender = this.genders.find(g => g.id === genderID);
    return gender ? gender.name : 'Desconocido'; // Si no encuentra el género, devuelve 'Desconocido'
  }

  save() {
    if (this.editProfileForm.valid) {
      console.log(this.editProfileForm.value);
      this.isEditing = false;
      this.editProfileForm.controls['genderID'].disable();
    } else {
      console.log('Formulario invalido');
    }
  }

  cancel() {
    this.isEditing = false;
    this.editProfileForm.reset(this.originalValues);
    console.log('el valor en cancelar es: ', this.isEditing);
    this.editProfileForm.controls['genderID'].disable();
  }

  changeImage(){
    this.changingPicture = true;
  }

  close(){
    this.changingPicture = false;
  }

  // Método para manejar la selección del archivo
  onFileSelected(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.selectedFile = event.target.files[0];
    }
  }

  // Método para subir la imagen
  uploadImage() {
    if (this.selectedFile) {
      this.cloudinary.uploadImage(this.selectedFile).subscribe(
        (response) => {
          console.log('Imagen subida correctamente', response);
          this.imageUrl = response.secure_url;
          this.changingPicture = false;
        },
        (error) => {
          console.error('Error al subir la imagen', error);
        }
      );
    }
  }
}