import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ModalService } from '../../../../services/modal.service';
import { PromotionComponent } from "../promotion/promotion.component";
import { EditFlightService } from '../../../../services/edit-flight.service';
import { CancelFlightComponent } from '../cancel-flight/cancel-flight.component';
import { ApiService } from '../../../../services/api.service';

interface Flight {
  flightID: number;
  origin: string;
  destiny: string;
  departure: string;
  arrival: string;
  duration: string;
  economyPrice: number;
  businessPrice: number;
  type: string;
  status: number;
}

@Component({
  selector: 'app-info-flight',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule, PromotionComponent, CancelFlightComponent],
  templateUrl: './info-flight.component.html',
  styleUrl: './info-flight.component.css'
})
export class InfoFlightComponent implements OnInit{
  isEditing: boolean = false;
  originalValues: any;
  editFlightForm!: FormGroup;
  cancelFlight: boolean = false;
  creationPromo: boolean = false;
  tickets: number = 24;
  statusID: number = 1;

  code: string = '';

  flight: Flight = {
    flightID: 0,
    origin: '',
    destiny: '',
    departure: '',
    arrival: '',
    duration: '',
    economyPrice: 0,
    businessPrice: 0,
    type: '',
    status: 0
  }

  constructor(
    private fb: FormBuilder, 
    private cdRef: ChangeDetectorRef, 
    private createPromoService: ModalService, 
    private editFlightService: EditFlightService, 
    private cancelFlightService: ModalService, 
    private router: Router, 
    private route: ActivatedRoute,
    private apiService: ApiService
  ){ }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.code = params.get('code') ?? '';
      if (!this.code) this.router.navigate(['root']);
    });
    this.getFlightInfo();
    this.createPromoService.$promotion.subscribe((value)=>{this.creationPromo = value})
    this.cancelFlightService.$cancel.subscribe((value)=>{this.cancelFlight = value})
    this.isEditing = this.editFlightService.isEditing;
    this.editFlightForm = this.fb.group({
      origin: [this.flight.origin, [Validators.required]],
      departureDate: ['', [Validators.required]],
      departureTime: ['', [Validators.required]],
      type: [this.flight.type, [Validators.required]],
      destination: [this.flight.destiny, [Validators.required]],
      duration: [this.flight.duration, [Validators.required]],
      arrivalDateDestination: ['', [Validators.required]],
      arrivalTimeDestination: ['', [Validators.required]],
      departureDateDestination: ['', [Validators.required]],
      departureTimeDestination: ['', [Validators.required]],
      arrivalDateOrigin: ['', [Validators.required]],
      arrivalTimeOrigin: ['', [Validators.required]],
      priceFirstClass: [this.flight.businessPrice, [Validators.required]],
      priceEconomy: [this.flight.economyPrice, [Validators.required]]
    });
    this.originalValues = this.editFlightForm.getRawValue();
  }

  getFlightInfo() {
    this.apiService.getData('data/get-flight-info?flightID='+this.code).subscribe(
      (response: Flight) => {
        this.flight = response;
        console.log(this.flight);

        // Actualiza el formulario con los datos recibidos del vuelo
        this.editFlightForm.patchValue({
          origin: this.flight.origin,
          departureDate: this.flight.departure.split('T')[0], // Si la fecha incluye hora
          departureTime: this.flight.departure.split('T')[1] || '', // Si incluye hora
          type: this.flight.type,
          destination: this.flight.destiny,
          duration: this.flight.duration,
          arrivalDateDestination: this.flight.arrival.split('T')[0],
          arrivalTimeDestination: this.flight.arrival.split('T')[1] || '',
          priceFirstClass: this.flight.businessPrice,
          priceEconomy: this.flight.economyPrice,
        });
        this.originalValues = this.editFlightForm.getRawValue();
      },
      (error) => {
        console.error('Error obteniendo la información del usuario:', error);
      }
    );
  }

  toggleEdit() {
    this.isEditing = true;
    this.cdRef.detectChanges();
  }

  createPromo(){
    this.creationPromo = true;
  }

  validateCancel(flightDate: string, flightStatus: number){
    let currentDate = new Date();
    let parsedFlightDate = new Date(flightDate);
    if(parsedFlightDate < currentDate || flightStatus !== 1){
      return true;
    }else{
      return false;
    }
  }

  cancelFlightFunction(){
    this.cancelFlight = true;
  }

  save() {
    if (this.editFlightForm.valid) {
      console.log(this.editFlightForm.value);
      this.isEditing = false;
    } else {
      console.log("Error");
    }
  }

  cancel() {
    this.isEditing = false;
    this.editFlightForm.reset(this.originalValues);
    console.log('el valor en cancelar es: ', this.isEditing);
  }
}
