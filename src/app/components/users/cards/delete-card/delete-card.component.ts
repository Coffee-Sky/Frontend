import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../../../services/modal.service';

@Component({
  selector: 'app-delete-card',
  standalone: true,
  imports: [],
  templateUrl: './delete-card.component.html',
  styleUrl: './delete-card.component.css'
})
export class DeleteCardComponent implements OnInit{

  constructor(private deleteCardService: ModalService) { }

  ngOnInit(): void {
  }

  closeModal(){
    this.deleteCardService.$cancel.emit(false);
  }

}
