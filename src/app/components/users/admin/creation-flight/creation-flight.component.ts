import { CommonModule, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { time } from 'console';

@Component({
  selector: 'app-creation-flight',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './creation-flight.component.html',
  styleUrl: './creation-flight.component.css'
})
export class CreationFlightComponent implements OnInit{
  minDate: string;

  constructor() {
    const today = new Date();
    this.minDate = formatDate(today, 'yyyy-MM-dd', 'en'); // El día actual permitido
  }

  ngOnInit(): void {
    
  }

  creationForm = new FormGroup({
    origin: new FormControl('', [Validators.required]),
    departureDate: new FormControl('', [Validators.required, this.dateValidator.bind(this)]),
    departureTime: new FormControl('', [Validators.required]),
    type: new FormControl('', [Validators.required]),
    destination: new FormControl('', [Validators.required]),
    duration: new FormControl('', [Validators.required]),
    arrivalDateDestination: new FormControl('', [Validators.required]),
    arrivalTimeDestination: new FormControl('', [Validators.required]),
    departureDateDestination: new FormControl('', [Validators.required]),
    departureTimeDestination: new FormControl('', [Validators.required]),
    arrivalDateOrigin: new FormControl('', [Validators.required]),
    arrivalTimeOrigin: new FormControl('', [Validators.required]),
    priceFirstClass: new FormControl('', [Validators.required]),
    priceEconomy: new FormControl('', [Validators.required]),

  });

  dateValidator(control: any) {
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today ? null : { invalidDate: true };
  }


  save() {
    if (this.creationForm.valid) {
      console.log(this.creationForm.value);
    } else {
      console.log("Error");
    }
  }
}

// import { CommonModule, formatDate } from '@angular/common';
// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
// import { RouterModule } from '@angular/router';

// @Component({
//   selector: 'app-creation-flight',
//   standalone: true,
//   imports: [ReactiveFormsModule, RouterModule, CommonModule],
//   templateUrl: './creation-flight.component.html',
//   styleUrl: './creation-flight.component.css'
// })
// export class CreationFlightComponent implements OnInit {
//   minDate: string;
//   creationForm: FormGroup;

//   constructor(private fb: FormBuilder) {
//     const today = new Date();
//     this.minDate = formatDate(today, 'yyyy-MM-dd', 'en');

//     this.creationForm = this.fb.group({
//       origin: ['', ],
//       departureDate: ['', [Validators.required, this.dateValidator()]],
//       departureTime: ['', ],
//       type: ['', ],
//       destination: ['', ],
//       duration: ['', ],
//       arrivalDateDestination: ['', [Validators.required]],
//       arrivalTimeDestination: ['', ],
//       departureDateDestination: ['', [Validators.required]],
//       departureTimeDestination: ['', ],
//       arrivalDateOrigin: ['', [Validators.required]],
//       arrivalTimeOrigin: ['', ],
//       priceFirstClass: ['', ],
//       priceEconomy: ['', ],
//     });
//   }

//   ngOnInit(): void {
//     // Aplicar validadores después de la inicialización del formulario
//     this.creationForm.get('arrivalDateDestination')?.addValidators(this.afterDepartureDateValidator());
//     this.creationForm.get('departureDateDestination')?.addValidators(this.afterDepartureDateValidator());
//     this.creationForm.get('arrivalDateOrigin')?.addValidators(this.afterDepartureDateValidator());
//     this.creationForm.get('departureTime')?.addValidators(this.departureTimeValidator());

//     // Actualizar validaciones cuando cambie la fecha de salida o el tipo
//     this.creationForm.get('departureDate')?.valueChanges.subscribe(() => {
//       this.creationForm.get('arrivalDateDestination')?.updateValueAndValidity();
//       this.creationForm.get('departureDateDestination')?.updateValueAndValidity();
//       this.creationForm.get('arrivalDateOrigin')?.updateValueAndValidity();
//     });

//     this.creationForm.get('type')?.valueChanges.subscribe(() => {
//       this.creationForm.get('departureTime')?.updateValueAndValidity();
//     });
//   }

//   dateValidator(): ValidatorFn {
//     return (control: AbstractControl): {[key: string]: any} | null => {
//       const selectedDate = new Date(control.value);
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);
//       return selectedDate >= today ? null : { invalidDate: true };
//     };
//   }

//   afterDepartureDateValidator(): ValidatorFn {
//     return (control: AbstractControl): {[key: string]: any} | null => {
//       if (!control.parent) return null;
//       const selectedDate = new Date(control.value);
//       const departureDateControl = control.parent.get('departureDate');
//       if (!departureDateControl) return null;
//       const departureDate = new Date(departureDateControl.value);

//       if (isNaN(selectedDate.getTime()) || isNaN(departureDate.getTime())) {
//         return null; // Si alguna de las fechas no es válida, no validamos
//       }

//       return selectedDate >= departureDate ? null : { dateBeforeDeparture: true };
//     };
//   }

//   departureTimeValidator(): ValidatorFn {
//     return (control: AbstractControl): {[key: string]: any} | null => {
//       if (!control.parent) return null;
//       if (!control.value) return null;

//       const [hours, minutes] = control.value.split(':').map(Number);
//       const selectedTime = new Date();
//       selectedTime.setHours(hours, minutes, 0, 0);

//       const now = new Date();
//       const minTime = new Date(now);
      
//       const typeControl = control.parent.get('type');
//       const type = typeControl?.value;
//       if (type === '2') {
//         minTime.setHours(now.getHours() + 3, now.getMinutes() + 30, 0, 0);
//       } else {
//         minTime.setHours(now.getHours() + 1, now.getMinutes() + 30, 0, 0);
//       }

//       if (selectedTime < minTime) {
//         return { invalidDepartureTime: true };
//       }

//       return null;
//     };
//   }

//   save() {
//     if (this.creationForm.valid) {
//       console.log(this.creationForm.value);
//     } else {
//       console.log("Error");
//       console.log(this.creationForm.errors);
//       Object.keys(this.creationForm.controls).forEach(key => {
//         const control = this.creationForm.get(key);
//         if (control?.errors) {
//           console.log(key, control.errors);
//         }
//       });
//     }
//   }
// }