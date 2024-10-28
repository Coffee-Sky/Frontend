import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CreationFlightComponent } from '../creation-flight/creation-flight.component';
import { PromotionComponent } from '../promotion/promotion.component';
import { ModalService } from '../../../../services/modal.service';
import { EditFlightService } from '../../../../services/edit-flight.service';
import { CancelFlightComponent } from '../cancel-flight/cancel-flight.component';
import { JwtService } from '../../../../services/jwt.service';
import { ApiService } from '../../../../services/api.service';

interface Role {
  roleID: number;
  name: string;
}

interface Admin {
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

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [RouterModule, CommonModule, CreationFlightComponent, PromotionComponent, CancelFlightComponent],
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.css'
})
export class AdminHomeComponent implements OnInit{
  creationFlight: boolean = false;
  cancelFlight: boolean = false;
  creationPromo: boolean = false;
  isEditing: boolean = false;
  isDropdownOpen: boolean = false;

  code: string = '';

  admin: Admin = {
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

  constructor(private createPromoService: ModalService,
              private editFlightService: EditFlightService,
              private cancelFlightService: ModalService,
              private jwtService: JwtService,
              private apiService: ApiService
            ){}

  vuelos = [
    {vueloID: 'A001', origin: 'Pereira', destination: 'Bogotá', departureDate: '2024-11-14', priceFirstClass: 900000, priceEconomy: 500000, TiquetesVendidos: 0, statusID: 1},
    {vueloID: 'A002', origin: 'Cali', destination: 'Cartagena', departureDate: '2024-11-15', priceFirstClass: 1000000, priceEconomy: 570000, TiquetesVendidos: 125, statusID: 1},
  ]

  ngOnInit(): void {
    this.createPromoService.$promotion.subscribe((value)=>{this.creationPromo = value})
    this.cancelFlightService.$cancel.subscribe((value)=>{this.cancelFlight = value})
    this.getAdminInfo();
  }

  getAdminInfo() {
    this.code = this.jwtService.getCode() ?? '';
    this.apiService.getData('data/get-user-info?userID='+this.code).subscribe(
      (response: Admin) => {
        this.admin = response;
        console.log(this.admin);
      },
      (error) => {
        console.error('Error obteniendo la información del usuario:', error);
      }
    );
  }

  createFlight(){
    this.creationFlight = true;
  }

  createPromo(){
    this.creationPromo = true;
  }

  editFlight(){
    this.editFlightService.toggleEditFlight();
  }

  cancelFlightFunction(){
    this.cancelFlight = true;
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout() {
    this.jwtService.removeToken();
    window.location.href = '';
  }

}
