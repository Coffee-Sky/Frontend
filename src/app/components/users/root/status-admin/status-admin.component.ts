import { CommonModule } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { ModalService } from '../../../../services/modal.service';
import { ApiService } from '../../../../services/api.service';

import 'sweetalert2/src/sweetalert2.scss';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-status-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status-admin.component.html',
  styleUrl: './status-admin.component.css'
})
export class StatusAdminComponent implements OnInit{

  @Input() adminID: string = '';
  @Input() adminName: string = '';
  @Input() status: number = 0;

  error: boolean = false;

  isLoading: boolean = false;

  constructor(private statusAdminService: ModalService, private apiService: ApiService) {}

  ngOnInit(): void {
  }

  actionAdmin() {
    this.error = true;
    this.apiService.putData('update/change-user-status?userID='+this.adminID, {userID: Number(this.adminID)}).subscribe(
      (response) => {
        Swal.fire({
          icon: "success",
          title: "Estado administrador",
          text: "Se ha cambiado el estado del administrador.",
          showConfirmButton: false,
          timer: 2500,
          timerProgressBar: true
        }).then(() => {
          this.close();
          window.location.reload();
        });
      },
      (error) => {
        this.error = true;
      }
    );
  }

  close(){
    this.statusAdminService.$status.emit(false);
  }
}
