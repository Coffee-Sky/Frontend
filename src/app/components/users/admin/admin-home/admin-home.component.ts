import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CreationFlightComponent } from '../creation-flight/creation-flight.component';
import { PromotionComponent } from '../promotion/promotion.component';
import { ModalService } from '../../../../services/modal/modal.service';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [RouterModule, CommonModule, CreationFlightComponent, PromotionComponent],
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.css'
})
export class AdminHomeComponent implements OnInit{
  creationFlight: boolean = false;
  cancelFlight: boolean = false;
  creationPromo: boolean = false;
  isEditing: boolean = false;
  isDropdownOpen: boolean = false;

  constructor(private createPromoService: ModalService){}

  vuelos = [
    {vueloID: 'A001', origin: 'Pereira', destination: 'Bogotá', departureDate: '2024-11-14', TiquetesVendidos: 0, statusID: 1},
    {vueloID: 'A002', origin: 'Cali', destination: 'Cartagena', departureDate: '2024-11-15', TiquetesVendidos: 125, statusID: 1},
  ]

  ngOnInit(): void {
    this.createPromoService.$promotion.subscribe((value)=>{this.creationPromo = value})
  }

  createFlight(){
    this.creationFlight = true;
  }

  createPromo(){
    this.creationPromo = true;
  }

  editFlight(){
    this.isEditing = true;
  }

  cancel(){
    this.cancelFlight = true;
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

}
