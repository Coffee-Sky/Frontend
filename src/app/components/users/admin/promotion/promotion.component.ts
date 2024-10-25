import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalService } from '../../../../services/modal.service';

@Component({
  selector: 'app-promotion',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './promotion.component.html',
  styleUrl: './promotion.component.css'
})
export class PromotionComponent implements OnInit{
  constructor(private createPromoService: ModalService){}

  ngOnInit(): void {
    
  }

  promotionForm = new FormGroup({
    promotion: new FormControl('', [Validators.required])
  })

  save() {
    if (this.promotionForm.valid) {
      console.log(this.promotionForm.value);
    } else {
      console.log('Formulario inválido');
    }
  }

  close(){
    this.createPromoService.$promotion.emit(false);
  }

}
