import { Component, Input, OnInit } from '@angular/core';
import { ModalService } from '../../../../services/modal.service';
import { ApiService } from '../../../../services/api.service';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-delete-card',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './delete-card.component.html',
  styleUrl: './delete-card.component.css'
})
export class DeleteCardComponent implements OnInit{

  @Input() cardId: string = '';

  constructor(private deleteCardService: ModalService, private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {
  }

  deleteCard() {
    this.apiService.deleteData('update/delete-card?cardID='+this.cardId).subscribe(
      (response) => {
        window.alert('Tarjeta eliminada correctamente.');
        this.closeModal();
        this.router.navigate(['/cards']);
      },
      (error) => {
        window.alert('Error eliminando la tarjeta. Vuélvalo a intentar.');
        console.error('Error obteniendo las tarjetas del usuario:', error);
      }
    );
  }

  closeModal(){
    this.deleteCardService.$cancel.emit(false);
  }

}
