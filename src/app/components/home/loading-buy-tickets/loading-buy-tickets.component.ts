import { Component, Input } from '@angular/core';
import { ModalService } from '../../../services/modal.service';

@Component({
  selector: 'app-loading-buy-tickets',
  standalone: true,
  imports: [],
  templateUrl: './loading-buy-tickets.component.html',
  styleUrl: './loading-buy-tickets.component.css'
})
export class LoadingBuyTicketsComponent {

  @Input() title: string = 'Cargando...';
  
    constructor(private loadingBuyTickets: ModalService) { }
  
    ngOnInit(): void {
    }

}
