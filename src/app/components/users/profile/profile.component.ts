import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CloudinaryService } from '../../../services/cloudinary.service';
import { HeaderComponent } from '../../home/header/header.component';
import { FooterComponent } from '../../home/footer/footer.component';
import { ApiService } from '../../../services/api.service';
import { LocationService } from '../../../services/location.service';

interface Country {
  country_name: string;
  country_short_name: string;
  country_phone_code: number;
}

interface State {
  state_name: string;
}

interface City {
  city_name: string;
}


interface Gender {
  genderID: number;
  name: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule, HeaderComponent, FooterComponent],
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

  accessToken: string = '';

  countries: Country[] = [];
  states: State[] = [];
  cities: City[] = [];
  genders: Gender[] = [];

  constructor(private fb: FormBuilder, private cdRef: ChangeDetectorRef, private cloudinary: CloudinaryService, private apiService: ApiService, private locationService: LocationService) { 
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

    this.getGenders();
    this.getAccessToken();
  }

  getGenders() {
    this.apiService.getData("sign-up/get-genders").subscribe(
      (response) => {
        this.genders = response;
        // console.log(this.genders);
      },
      (error) => {
        console.error('Error obteniendo los géneros:', error);
      }
    )
  }

  getAccessToken() {
    this.locationService.getAccessToken().subscribe(
      (response) => {
        this.accessToken = response.auth_token;
        // console.log('Access Token:', this.accessToken);
        this.getCountries();
        // this.getStates('Colombia');
        // this.getCities('Antioquia');
      },
      (error) => {
        console.error('Error obteniendo el token de acceso:', error);
      }
    );
  }

  getCountries() {
    this.locationService.getCountries(this.accessToken).subscribe(
      (response) => {
        this.countries = response;
        // console.log(this.countries);
      },
      (error) => {
        console.error('Error obteniendo los países:', error);
      }
    );
  }

  getStates(event: Event) {
    const selectedCountry = (event.target as HTMLSelectElement).value;

    console.log('Selected Country:', selectedCountry);

    this.states = [];
    this.cities = [];

    this.locationService.getStates(this.accessToken, selectedCountry).subscribe(
      (response) => {
        this.states = response;
        // console.log(this.states);
      },
      (error) => {
        console.error('Error obteniendo los estados:', error);
      }
    );
  }

  getCities(event: Event) {
    const selectedState = (event.target as HTMLSelectElement).value;

    // console.log('Selected Country:', selectedState);

    this.locationService.getCities(this.accessToken, selectedState).subscribe(
      (response) => {
        this.cities = response;
        // console.log(this.cities);
      },
      (error) => {
        console.error('Error obteniendo las ciudades:', error);
      }
    );
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
    const gender = this.genders.find(g => g.genderID === genderID);
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