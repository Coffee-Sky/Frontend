import { CommonModule } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { ModalService } from '../../../../services/modal.service';
import { ApiService } from '../../../../services/api.service';

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

  constructor(private statusAdminService: ModalService, private apiService: ApiService) {}

  ngOnInit(): void {
  }

  actionAdmin() {
    this.apiService.putData('update/change-user-status?userID='+this.adminID, {userID: Number(this.adminID)}).subscribe(
      (response) => {
        this.close();
      },
      (error) => {
        this.error = true;
      }
    );
  }

  close(){
    this.statusAdminService.$status.emit(false);
    window.location.reload();
  }
}
