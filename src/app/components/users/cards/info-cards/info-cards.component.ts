import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../home/header/header.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../../../services/modal.service';
import { DeleteCardComponent } from '../delete-card/delete-card.component';

@Component({
  selector: 'app-info-cards',
  standalone: true,
  imports: [HeaderComponent, CommonModule, ReactiveFormsModule, DeleteCardComponent],
  templateUrl: './info-cards.component.html',
  styleUrl: './info-cards.component.css'
})
export class InfoCardsComponent implements OnInit {

  isEditing: boolean = false;
  originalValues: any;
  editCardForm!: FormGroup;
  deleteCard: boolean = false;

  streetTypes = ['Autopista', 'Avenida', 'Calle', 'Carrera', 'Circular', 'Circunvalar', 'Diagonal', 'Manzana', 'Pasaje', 'Peatonal', 'Transversal', 'Vereda', 'Vía', 'Zona', 'Otro'];

  constructor(private fb: FormBuilder, private cdRef: ChangeDetectorRef, private deleteCardService: ModalService) { }

  ngOnInit(): void {
    this.deleteCardService.$cancel.subscribe((value)=>{this.deleteCard = value})
    this.editCardForm = this.fb.group({
      type: ['', Validators.required],
      number: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
      caducityDate: ['', Validators.required],
      balance: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      firstname: ['', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/)]],
      secondname: ['', Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/)],
      firstlastname: ['', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/)]],
      secondlastname: ['', Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/)],
      phone: ['', [Validators.required, Validators.pattern(/^\d{7,15}$/)]],
      country: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      neighborhood: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9\sÁÉÍÓÚáéíóúÑñ]+$/)]],
      streetType: ['', Validators.required],
      streetName: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9\sÁÉÍÓÚáéíóúÑñ]+$/)]],
      streetNumber1: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9]{1,5}$/)]],
      streetNumber2: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9]{1,5}$/)]],
      postalCode: ['', [Validators.required, Validators.pattern(/^\d{4,10}$/)]],
    });
    this.originalValues = this.editCardForm.getRawValue();
  }

  toggleEdit() {
    this.isEditing = true;
    this.cdRef.detectChanges();
  }

  deleteCardFunction(){
    this.deleteCard = true;
  }

  save() {
    if (this.editCardForm.valid) {
      console.log(this.editCardForm.value);
      this.isEditing = false;
    } else {
      console.log('Formulario invalido');
    }
  }

  cancel() {
    this.isEditing = false;
    this.editCardForm.reset(this.originalValues);
  }

}
