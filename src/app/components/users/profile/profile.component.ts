import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CloudinaryService } from '../../../services/cloudinary.service';
import { HeaderComponent } from '../../home/header/header.component';
import { FooterComponent } from '../../home/footer/footer.component';
import { ApiService } from '../../../services/api.service';
import { LocationService } from '../../../services/location.service';
import { JwtService } from '../../../services/jwt.service';

interface Role {
  roleID: number;
  name: string;
}

interface User {
  userID: number;
  firstname: string;
  secondname: string;
  firstlastname: string;
  secondlastname: string;
  identificationnumber: string;
  bornDate: string;
  borncountry: string;
  bornstate: string;
  borncity: string;
  genderID: number;
  image: string;
  username: string;
  email: string;
  role: Role;
  statusID: number;
}

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
  code: string = '';
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

  user: User = {
    userID: 0,
    firstname: '',
    secondname: '',
    firstlastname: '',
    secondlastname: '',
    identificationnumber: '',
    bornDate: '',
    borncountry: '',
    bornstate: '',
    borncity: '',
    genderID: 0,
    image: '',
    username: '',
    email: '',
    role: {
      roleID: 0,
      name: ''
    },
    statusID: 0
  };

  constructor(private fb: FormBuilder, private cdRef: ChangeDetectorRef, private cloudinary: CloudinaryService, private apiService: ApiService, private locationService: LocationService, private jwtService: JwtService) { 
  }

  ngOnInit(): void {
    this.jwtService.getRole();
    this.getUserInfo();
    this.editProfileForm = this.fb.group({
      firstname: [this.user.firstname, [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/)]],
      secondname: [this.user.secondname, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/)],
      firstlastname: [this.user.firstlastname, [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/)]],
      secondlastname: [this.user.secondlastname, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/)],
      genderID: [this.user.genderID, Validators.required],
      identificationnumber: [this.user.identificationnumber, [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      borncountry: [this.user.borncountry, Validators.required],
      bornstate: [this.user.bornstate, Validators.required],
      borncity: [this.user.borncity, Validators.required],
      bornDate: [this.user.bornDate, Validators.required],
      username: [this.user.username, [Validators.required, Validators.minLength(5), Validators.maxLength(12), Validators.pattern(/^[A-Za-z0-9_]+$/)]],
      email: [{value: this.user.email, disabled: true}],
      // password: ['12w@waR4', [Validators.required, Validators.minLength(8), Validators.maxLength(20), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&/-])[A-Za-z\d@$!%*?&/-]{8,20}$/)]],
    });
    this.originalValues = this.editProfileForm.getRawValue();
    this.getGenders();
    this.getAccessToken();
  }

  verifyRole(){
    const role = this.jwtService.getRole();
    if(role === 'ROLE_ADMIN'){
      return true;
    }
    return false;
  }

  getUserInfo() {
    this.code = this.jwtService.getCode() ?? '';
    this.apiService.getData('data/get-user-info?userID='+this.code).subscribe(
      (response: User) => {
        const user = response;
        this.editProfileForm.patchValue(user);
        this.originalValues = this.editProfileForm.getRawValue();
        console.log(user);
        console.log(user.identificationnumber);
        if(user.image !== '' && user.image !== 'default.jpg'){
          this.imageUrl = user.image;
        }
      },
      (error) => {
        console.error('Error obteniendo la información del usuario:', error);
      }
    );
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

    // console.log('Selected Country:', selectedCountry);

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
    // console.log('entreeee');
    this.isEditing = true;
    this.cdRef.detectChanges();
    // console.log('el valor es: ', this.isEditing);
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
      // console.log(this.editProfileForm.value);
      this.isEditing = false;
      this.editProfileForm.controls['genderID'].disable();
      this.submitUserInfo(this.editProfileForm.getRawValue());
    } else {
      console.error('Formulario invalido');
    }
  }

  submitUserInfo(info: any) {
    const { email, ...userInfo } = info;
    userInfo.userID = Number(this.code);
    userInfo.image = this.imageUrl;
    userInfo.username = userInfo.username;
    console.log('Información del usuario a enviar:', userInfo);
    this.apiService.putData('update/update-client-info', userInfo).subscribe(
      (response) => {
        // console.log(response)
        this.getUserInfo();
      },
      (error) => {
        console.error('Error obteniendo la información del usuario:', error);
        this.cancel();
      }
    );
  }

  cancel() {
    this.isEditing = false;
    this.editProfileForm.reset(this.originalValues);
    // console.log('el valor en cancelar es: ', this.isEditing);
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
          // console.log('Imagen subida correctamente', response);
          this.imageUrl = response.secure_url;
          this.submitUserInfo(this.originalValues);
          this.changingPicture = false;
        },
        (error) => {
          console.error('Error al subir la imagen', error);
        }
      );
    }
  }
}