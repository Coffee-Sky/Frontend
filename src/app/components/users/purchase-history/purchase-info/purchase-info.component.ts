import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { HeaderComponent } from '../../../home/header/header.component';

import 'sweetalert2/src/sweetalert2.scss';
import Swal from 'sweetalert2';
import { ApiService } from '../../../../services/api.service';
import { JwtService } from '../../../../services/jwt.service';

interface Flight {
  flightId: number;
  complementaryFlightId: number;
  originCity: string;
  destinationCity: string;
  departure: string;
  quantity: number;
  classType: string;
  price: number;
  purchaseId: number;
}

interface Ticket {
  ticketId: number;
}

interface Passenger {
  id: number;
  ticketId: number;
  firstname: string;
  secondname: string;
  firstlastname: string;
  secondlastname: string;
  documentType: string;
  identificationnumber: string;
  bornDate: string;
  borncountry: string;
  gender: number;
  email: string;
}

interface Purchase {
  isRoundTrip: boolean;
  reservations: Flight[];
  ticketReservationIds: Ticket[];
  passengers: Passenger[];
  status: number;
  id: string;
}

@Component({
  selector: 'app-purchase-info',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent],
  templateUrl: './purchase-info.component.html',
  styleUrl: './purchase-info.component.css'
})
export class PurchaseInfoComponent implements OnInit{

  @Input() flightId: string = '';
  @Input() purchaseStatus: number = 0;
  @Input() purchases: Purchase[] = [];

  selectedPurchase: Purchase = {
    isRoundTrip: false,
    reservations: [],
    ticketReservationIds: [],
    passengers: [],
    status: 0,
    id: ''
  };

  displayedPassengers: Passenger[] = [];

  constructor(private router: Router, private apiService: ApiService, private jwtService: JwtService) { }

  ngOnInit(): void {
    // Filtrar el arreglo purchases para obtener la compra con el flightId
    this.selectedPurchase = this.purchases.find(purchase => purchase.id === this.flightId) || {
      isRoundTrip: false,
      reservations: [],
      ticketReservationIds: [],
      passengers: [],
      status: 0,
      id: ''
    };

    if (this.selectedPurchase) {
      console.log('Compra seleccionada:', this.selectedPurchase);

      const numberToDisplay = this.selectedPurchase.reservations[0].quantity;
      this.displayedPassengers = this.selectedPurchase.passengers.slice(0, numberToDisplay);
      
      console.log('Pasajeros a mostrar:', this.displayedPassengers);
    } else {
      console.warn('No se encontró una compra con el ID proporcionado:', this.flightId);
    }
  }

  goBack(): void {
    window.location.reload();
  }

  cancelPurchase() {

    const dataCancel = {
      clientId: this.jwtService.getCode(),
      originPurchaseId: this.selectedPurchase.reservations[0].purchaseId,
      isRoundTrip: this.selectedPurchase.isRoundTrip,
      returnPurchaseId: this.selectedPurchase.reservations[1] ? this.selectedPurchase.reservations[1].purchaseId : null
    };

    Swal.fire({
      icon: "question",
      title: "Cancelar compra",
      text: "¿Está seguro que desea cancelar la compra de los tiquetes?",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "No",
      confirmButtonColor: "#0F766E",
      cancelButtonColor: "#EF4444"
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.putData('cart/cancel-purchase', dataCancel).subscribe(
          (response) => {
            console.log('Respuesta de cancelación:', response);
            Swal.fire({
              icon: "success",
              title: "Cancelar compra",
              text: "Se ha cancelado la compra exitosamente.",
              showConfirmButton: false,
              timer: 2500,
              timerProgressBar: true
            }).then(() => {
              this.goBack();
            });
          },
          (error) => {
            console.error('Error cancelando la compra:', error);
            Swal.fire({
              icon: "error",
              title: "Cancelar compra",
              text: "Se ha producido un error cancelando la compra. Vuelve a intentarlo.",
              showConfirmButton: false,
              timer: 2500,
              timerProgressBar: true
            }).then(() => {
              this.goBack();
            })
          }
        );
      }
    })
  }

}
