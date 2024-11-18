import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../../../home/header/header.component";
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { JwtService } from '../../../../services/jwt.service';

import 'sweetalert2/src/sweetalert2.scss';
import Swal from 'sweetalert2';

interface Card {
  cardId: number;
  type: string;
  cardNumber: string;
  expirationDate: string;
  cvv: string;
  balance: number;
}

@Component({
  selector: 'app-select-card',
  standalone: true,
  imports: [HeaderComponent, CommonModule, RouterModule],
  templateUrl: './select-card.component.html',
  styleUrl: './select-card.component.css'
})
export class SelectCardComponent implements OnInit {
  code: string = '';
  cards: Card[] = [];
  selectedCardId: number = -1; 

  constructor(private router: Router, private apiService: ApiService, private jwtService: JwtService) {}

  ngOnInit(): void {
    this.code = this.jwtService.getCode() ?? '';
    this.getCardList();
  }

  getCardList(): void {
    this.apiService.getData('data/get-user-cards?userID=' + this.code).subscribe(
      (response: Card[]) => {
        this.cards = response;
      },
      (error) => {
        console.error('Error obteniendo las tarjetas del usuario:', error);
      }
    );
  }

  selectCard(cardId: number): void {
    this.selectedCardId = cardId;
  }

  confirmSelection(): void {
    if (this.selectedCardId !== -1) {
      console.log('Tarjeta seleccionada:', this.selectedCardId);
    } else {
      console.warn('No se ha seleccionado ninguna tarjeta.');
      Swal.fire({
        icon: "error",
        title: "Seleccionar tarjeta",
        text: "No se ha seleccionado ninguna tarjeta.",
        confirmButtonColor: "#0F766E",
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true
      })
    }
  }
}
