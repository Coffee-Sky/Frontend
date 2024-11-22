import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../home/header/header.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { JwtService } from '../../../services/jwt.service';
import { SelectCardComponent } from '../cards/select-card/select-card.component';

import 'sweetalert2/src/sweetalert2.scss';
import Swal from 'sweetalert2';
import { LoadingBuyTicketsComponent } from '../../home/loading-buy-tickets/loading-buy-tickets.component';

interface Flight {
  flightId: number;
  complementaryFlightId: number;
  originCity: string;
  destinationCity: string;
  departure: string;
  quantity: number;
  classType: 'economy' | 'business';
  price: number;
  reservation_date: string;
  reservationId: number;
}

interface Ticket {
  ticketId: number;
}

interface Booking {
  isRoundTrip: boolean;
  reservations: Flight[];
  ticketReservationIds: Ticket[];
  id: string;
}

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [HeaderComponent, CommonModule, RouterModule, SelectCardComponent, LoadingBuyTicketsComponent],
  templateUrl: './bookings.component.html',
  styleUrl: './bookings.component.css'
})
export class BookingsComponent implements OnInit{

  timeLeft: number = 24;

  bookings: Booking[] = [];

  viewSelectCard: boolean = false;
  selectedCardId: number = -1;

  flightID: string = '';

  loadingBuyTickets: boolean = false;

  constructor(private apiService: ApiService, private jwtService: JwtService) { }

  ngOnInit(): void {
    this.getBookings();
  }

  getBookings(): void{
    this.apiService.getData('cart/get-reserved-flights?clientId='+this.jwtService.getCode()).subscribe(
      (response: Booking[]) => {
        this.bookings = response;
        console.log('Reservas del usuario:', this.bookings);
      },
      (error) => {
        console.error('Error obteniendo las tarjetas del usuario:', error);
      }
    );
  }

  calculateRemainingTime(reservationDateStr: string, departureDateStr: string): string {
    // Obtener la hora actual en Colombia
    const currentTime = new Date().toLocaleString('en-US', { timeZone: 'America/Bogota' });
    const currentDate = new Date(currentTime);
  
    // Convertir las fechas de cadena a objetos Date
    const reservationDate = new Date(reservationDateStr);
    const departureDate = new Date(departureDateStr);
  
    // Calcular diferencias de tiempo en milisegundos
    const timeSinceReservation = currentDate.getTime() - reservationDate.getTime();
    const timeUntilDeparture = departureDate.getTime() - currentDate.getTime();
    const timeUntil24HoursFromReservation = (24 * 60 * 60 * 1000) - timeSinceReservation;
  
    let remainingTime: number;
  
    if ((departureDate.getTime() - reservationDate.getTime()) > (24 * 60 * 60 * 1000)) {
      // Si el tiempo entre la reserva y la salida es mayor a 24 horas, mostrar el tiempo restante hasta completar 24 horas desde la reserva
      remainingTime = timeUntil24HoursFromReservation;
    } else {
      // Mostrar el menor tiempo entre la salida y las 24 horas desde la reserva
      remainingTime = Math.min(timeUntilDeparture, timeUntil24HoursFromReservation);
    }
  
    // Convertir el tiempo restante a horas, minutos y segundos
    const hours = Math.floor(remainingTime / (1000 * 60 * 60));
    const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
  
    return `${hours} horas y ${minutes} minutos`;
  }

  onCardSelected(cardId: number): void {
    this.selectedCardId = cardId;
    if(this.selectedCardId !== -1){
      Swal.fire({
        icon: "question",
        title: "Comprar tiquetes",
        text: "¿Está seguro que desea comprar los tiquetes con la tarjeta seleccionada?",
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "No",
        confirmButtonColor: "#0F766E",
        cancelButtonColor: "#EF4444"
      }).then((result) => {
        if (result.isConfirmed) {
          this.viewSelectCard = false;
          this.payBooking(this.flightID);
        } else {
          this.selectedCardId = -1;
        }
      })
    } else {
      console.log('No se ha seleccionado una tarjeta');
      this.viewSelectCard = false;
      this.flightID = '';
    }
  }

  uploadPayInfo(booking: Booking): void {

    const returnReservationId = booking.isRoundTrip ? booking.reservations[1].reservationId : null;

    const payInfo = {
      clientId: this.jwtService.getCode(),
      cardId: this.selectedCardId,
      flightId: booking.reservations[0].flightId,
      isRoundTrip: booking.isRoundTrip,
      complementaryFlightId: booking.reservations[0].complementaryFlightId,
      reservationId: booking.reservations[0].reservationId,
      returnReservationId: returnReservationId,
      ticketReservationIds: booking.ticketReservationIds
    }

    console.log('Información para pago:', payInfo);

    this.loadingBuyTickets = true;
    this.apiService.postData('cart/buy-reservation', payInfo).subscribe(
      (response) => {
        console.log('Respuesta del pago:', response);
        Swal.fire({
          icon: "success",
          title: "Realizar pago",
          text: "Se ha realizado el pago de la reserva exitosamente.",
          showConfirmButton: false,
          timer: 2500,
          timerProgressBar: true
        }).then(() => {
          window.location.reload();
        });
      },
      (error) => {
        console.error('Error realizando el pago:', error);
        Swal.fire({
          icon: "error",
          title: "Realizar pago",
          text: "Se ha producido un error pagando la reserva. Vuelve a intentarlo.",
          showConfirmButton: false,
          timer: 2500,
          timerProgressBar: true
        }).then(() => {
          this.viewSelectCard = false;
          this.flightID = '';
        });
      }
    );

  }

  payBooking(flightID: string): void {
    this.flightID = flightID;
    if(this.selectedCardId !== -1){
      this.viewSelectCard = false;

      // Buscar el booking con id igual a this.flightID
      const booking = this.bookings.find(booking => booking.id === this.flightID);

      if (booking) {
        // Realiza las acciones necesarias con el booking encontrado
        console.log('Booking encontrado:', booking);
        this.uploadPayInfo(booking);
        // Aquí puedes agregar la lógica que requieras
      } else {
        console.log('No se encontró un booking con el ID:', this.flightID);
        Swal.fire({
          icon: "error",
          title: "Realizar pago",
          text: "Se ha producido un error pagando la reserva. Vuelve a intentarlo.",
          showConfirmButton: false,
          timer: 2500,
          timerProgressBar: true
        }).then(() => {
          window.location.reload();
        });
      }

    } else {
      console.log('No se ha seleccionado una tarjeta');
      this.viewSelectCard = true;
    }
  }

  // cancelBooking(flightID: number) {
  //   this.bookings = this.bookings.filter(flight => flight[0].flightID !== flightID);
  // }
}
