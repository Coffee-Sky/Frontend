import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ModalService } from '../../../../services/modal/modal.service';
import { PromotionComponent } from "../promotion/promotion.component";
import { EditFlightService } from '../../../../services/modal/edit-flight.service';

@Component({
  selector: 'app-info-flight',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule, PromotionComponent],
  templateUrl: './info-flight.component.html',
  styleUrl: './info-flight.component.css'
})
export class InfoFlightComponent implements OnInit{
  isEditing: boolean = false;
  originalValues: any;
  editFlightForm!: FormGroup;
  creationPromo: boolean = false;
  // tickets: number = 24;
  tickets: number = 0;

  constructor(private fb: FormBuilder, private cdRef: ChangeDetectorRef, private createPromoService: ModalService, private editFlightService: EditFlightService) { }

  ngOnInit(): void {
    this.createPromoService.$promotion.subscribe((value)=>{this.creationPromo = value})
    this.isEditing = this.editFlightService.isEditing;
    this.editFlightForm = this.fb.group({
      origin: ['', [Validators.required]],
      departureDate: ['', [Validators.required]],
      departureTime: ['', [Validators.required]],
      type: ['', [Validators.required]],
      destination: ['', [Validators.required]],
      duration: ['', [Validators.required]],
      arrivalDateDestination: ['', [Validators.required]],
      arrivalTimeDestination: ['', [Validators.required]],
      departureDateDestination: ['', [Validators.required]],
      departureTimeDestination: ['', [Validators.required]],
      arrivalDateOrigin: ['', [Validators.required]],
      arrivalTimeOrigin: ['', [Validators.required]],
      priceFirstClass: ['', [Validators.required]],
      priceEconomy: ['', [Validators.required]]
    });
    this.originalValues = this.editFlightForm.getRawValue();
  }

  toggleEdit() {
    this.isEditing = true;
    this.cdRef.detectChanges();
  }

  createPromo(){
    this.creationPromo = true;
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
