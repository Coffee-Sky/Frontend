import { Component } from '@angular/core';
import { ModalService } from '../../../../services/modal.service';

@Component({
  selector: 'app-loading-buy-tickets',
  standalone: true,
  imports: [],
  templateUrl: './loading-buy-tickets.component.html',
  styleUrl: './loading-buy-tickets.component.css'
})
export class LoadingBuyTicketsComponent {
  
    constructor(private loadingBuyTickets: ModalService) { }
  
    ngOnInit(): void {
    }

}
