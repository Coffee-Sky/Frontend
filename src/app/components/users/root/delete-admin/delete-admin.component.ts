import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../../../services/modal.service';

@Component({
  selector: 'app-delete-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-admin.component.html',
  styleUrl: './delete-admin.component.css'
})
export class DeleteAdminComponent implements OnInit{
  constructor(private deleteAdminService: ModalService){

  }

  ngOnInit(): void {
    
  }

  close(){
    this.deleteAdminService.$delete.emit(false);
  }
}
