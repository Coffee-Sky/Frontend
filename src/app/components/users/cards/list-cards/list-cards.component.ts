import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../../../home/header/header.component";
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { JwtService } from '../../../../services/jwt.service';
import { error } from 'console';

interface Card {
  cardId: number;
  type: string;
  cardNumber: string;
  expirationDate: string;
  cvv: string;
  balance: number;
}

@Component({
  selector: 'app-list-cards',
  standalone: true,
  imports: [HeaderComponent, CommonModule, RouterModule],
  templateUrl: './list-cards.component.html',
  styleUrl: './list-cards.component.css'
})
export class ListCardsComponent implements OnInit{

  code: string = '';

  cards: Card[] = [];

  tarjetas= [
    { id: '1', type: 'credit', number: '1234 5678 1234 5678', caducityDate: '12/23', balance: 578000, cvv: '123'},
    { id: '2', type: 'debit', number: '9876 5432 9876 5432', caducityDate: '06/25', balance: 234000, cvv: '456'},
  ];

  constructor(private router: Router, private apiService: ApiService, private jwtService: JwtService) { }

  ngOnInit(): void {
    this.code = this.jwtService.getCode() ?? '';
    this.getCardList();
  }

  getCardList() {
    this.apiService.getData('data/get-user-cards?userID='+this.code).subscribe(
      (response: Card[]) => {
        this.cards = response;
        console.log('Tarjetas del usuario:', this.cards);
      },
      (error) => {
        console.log('Error obteniendo las tarjetas del usuario:', error);
      }
    );
  }

  navigateToCardInfo(tarjeta: any): void {
    this.router.navigate(['/info-card', tarjeta.id]);
    console.log('Card info:', tarjeta.id);
  }

}
