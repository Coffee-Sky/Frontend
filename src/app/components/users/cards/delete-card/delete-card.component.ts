import { Component, Input, OnInit } from '@angular/core';
import { ModalService } from '../../../../services/modal.service';
import { ApiService } from '../../../../services/api.service';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import 'sweetalert2/src/sweetalert2.scss';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-delete-card',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './delete-card.component.html',
  styleUrl: './delete-card.component.css'
})
export class DeleteCardComponent implements OnInit{

  @Input() cardId: string = '';

  isLoading: boolean = false;

  constructor(private deleteCardService: ModalService, private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {
  }

  deleteCard() {
    this.isLoading = true;
    this.apiService.deleteData('update/delete-card?cardID='+this.cardId).subscribe(
      (response) => {
        // window.alert('Tarjeta eliminada correctamente.');
        // this.closeModal();
        // this.router.navigate(['/cards']);
        Swal.fire({
          icon: "success",
          title: "Eliminar tarjeta",
          text: "Tarjeta eliminada correctamente.",
          confirmButtonColor: "#0F766E",
          showConfirmButton: false,
          timer: 2500,
          timerProgressBar: true
        }).then(() => {
          this.closeModal();
          this.router.navigate(['/cards']);
        });
      },
      (error) => {
        // window.alert('Error eliminando la tarjeta. Vuélvalo a intentar.');
        Swal.fire({
          icon: "error",
          title: "Eliminar tarjeta",
          text: "Error eliminando la tarjeta. Vuélvalo a intentar.",
          confirmButtonColor: "#0F766E",
          showConfirmButton: false,
          timer: 2500,
          timerProgressBar: true
        })
        console.error('Error obteniendo las tarjetas del usuario:', error);
      }
    );
  }

  closeModal(){
    this.deleteCardService.$cancel.emit(false);
  }

}
