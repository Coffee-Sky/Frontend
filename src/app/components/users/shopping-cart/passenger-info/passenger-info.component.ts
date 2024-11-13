import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { HeaderComponent } from '../../../home/header/header.component';


@Component({
  selector: 'app-passenger-info',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent],
  templateUrl: './passenger-info.component.html',
  styleUrl: './passenger-info.component.css'
})
export class PassengerInfoComponent implements OnInit{

  @Input() numberOfPassengers: number = 3;
  passengerForm: FormGroup;
  maxDate: string = new Date().toISOString().split('T')[0];

  constructor(private fb: FormBuilder) {
    this.passengerForm = this.fb.group({
      passengers: this.fb.array([])
    });
  }

  ngOnInit() {
    this.createPassengerForms();
  }

  get passengers() {
    return this.passengerForm.get('passengers') as FormArray;
  }

  get hasAdult(): boolean {
    return this.passengers.controls.some(control => 
      !this.isChild(control.get('bornDate')?.value)
    );
  }

  get hasDuplicateDocuments(): boolean {
    const documents = this.passengers.controls
      .map(control => control.get('identificationnumber')?.value)
      .filter(doc => doc);
    return documents.length !== new Set(documents).size;
  }

  createPassengerForms() {
    for (let i = 0; i < this.numberOfPassengers; i++) {
      this.passengers.push(this.createPassengerForm());
    }
  }

  createPassengerForm(): FormGroup {
    return this.fb.group({
      firstname: ['', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/)]],
      secondname: ['', Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/)],
      firstlastname: ['', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/)]],
      secondlastname: ['', Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/)],
      genderID: ['', Validators.required],
      identificationnumber: ['', Validators.required],
      bornDate: ['', Validators.required],
      borncountry: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(/^[a-z]([a-z0-9.-]+)?@[a-z0-9]+.[a-z]{2,3}(.([a-z]{2}))?$/)]],
    });
  }

  isChild(bornDate: string): boolean {
    if (!bornDate) return false;
    
    const today = new Date();
    const birth = new Date(bornDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age < 18;
  }

  save() {
    if (this.passengerForm.valid && this.hasAdult && !this.hasDuplicateDocuments) {
      console.log(this.passengerForm.value);
      // Aquí puedes manejar el envío del formulario
    }
  }

}
// import { CommonModule } from '@angular/common';
// import { Component, Input, OnInit } from '@angular/core';
// import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
// import { HeaderComponent } from '../../../home/header/header.component';


// @Component({
//   selector: 'app-passenger-info',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule, HeaderComponent],
//   templateUrl: './passenger-info.component.html',
//   styleUrl: './passenger-info.component.css'
// })
// export class PassengerInfoComponent implements OnInit{

//   @Input() numberOfPassengers: number = 3;
//   passengerForm: FormGroup;
//   maxDate: string = new Date().toISOString().split('T')[0];

//   constructor(private fb: FormBuilder) {
//     this.passengerForm = this.fb.group({
//       passengers: this.fb.array([])
//     });
//   }

//   ngOnInit() {
//     this.createPassengerForms();
//   }

//   get passengers() {
//     return this.passengerForm.get('passengers') as FormArray;
//   }

//   get hasAdult(): boolean {
//     return this.passengers.controls.some(control => 
//       !this.isChild(control.get('bornDate')?.value)
//     );
//   }

//   get hasDuplicateDocuments(): boolean {
//     const documents = this.passengers.controls
//       .map(control => control.get('identificationnumber')?.value)
//       .filter(doc => doc);
//     return documents.length !== new Set(documents).size;
//   }

//   createPassengerForms() {
//     for (let i = 0; i < this.numberOfPassengers; i++) {
//       this.passengers.push(this.createPassengerForm());
//     }
//   }

//   createPassengerForm(): FormGroup {
//     return this.fb.group({
//       firstName: ['', Validators.required],
//       lastName: ['', Validators.required],
//       bornDate: ['', Validators.required],
//       birthCountry: ['', Validators.required],
//       identificationnumber: ['', Validators.required],
//       gender: ['', Validators.required],
//       email: ['', [Validators.required, Validators.email]]
//     });
//   }

//   isChild(bornDate: string): boolean {
//     if (!bornDate) return false;
    
//     const today = new Date();
//     const birth = new Date(bornDate);
//     let age = today.getFullYear() - birth.getFullYear();
//     const monthDiff = today.getMonth() - birth.getMonth();
    
//     if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
//       age--;
//     }
    
//     return age < 18;
//   }

//   save() {
//     if (this.passengerForm.valid && this.hasAdult && !this.hasDuplicateDocuments) {
//       console.log(this.passengerForm.value);
//       // Aquí puedes manejar el envío del formulario
//     }
//   }
// }
