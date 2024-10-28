import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../../../home/header/header.component";
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-list-cards',
  standalone: true,
  imports: [HeaderComponent, CommonModule, RouterModule],
  templateUrl: './list-cards.component.html',
  styleUrl: './list-cards.component.css'
})
export class ListCardsComponent implements OnInit{

  tarjetas= [
    { id: '1', type: 'credit', number: '1234 5678 1234 5678', caducityDate: '12/23', balance: 578000, cvv: '123'},
    { id: '2', type: 'debit', number: '9876 5432 9876 5432', caducityDate: '06/25', balance: 234000, cvv: '456'},
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  navigateToCardInfo(tarjeta: any): void {
    this.router.navigate(['/info-card', tarjeta.id]);
    console.log('Card info:', tarjeta.id);
  }

}
