import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DeleteAdminComponent } from '../delete-admin/delete-admin.component';
import { ModalService } from '../../../../services/modal/modal.service';

@Component({
  selector: 'app-info-admin',
  standalone: true,
  imports: [RouterModule, CommonModule, DeleteAdminComponent],
  templateUrl: './info-admin.component.html',
  styleUrl: './info-admin.component.css'
})
export class InfoAdminComponent implements OnInit{

  deleteAdmin: boolean = false;

  constructor(private deleteAdminService: ModalService){

  }

  Admins = {
    firstname: 'Pepe',
    secondname: '',
    firstlastname: 'Perez',
    secondlastname: '',
    genderID: '',
    identificationnumber: '12345678',
    borncountry: '',
    bornstate: '',
    borncity: '',
    bornDate: '',
    username: 'pepeperez2',
    email: 'pepe@gmail.com'
  }

  ngOnInit(): void {
    this.deleteAdminService.$delete.subscribe((value)=>{this.deleteAdmin = value})
  }

  deleteAdminFunction(){
    this.deleteAdmin = true;
  }

}
