import { Component, OnInit } from '@angular/core';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { DeleteAdminService } from '../../../../services/modal/delete-admin.service';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../../../services/modal/modal.service';
import { ApiService } from '../../../../services/api.service';

interface Role {
  roleID: number;
  name: string;
}

interface Admin {
  userID: number;
  firstname: string;
  secondname: string;
  firstlastname: string;
  secondlastname: string;
  identificationnumber: string;
  bornDate: string;
  borncountry: string;
  bornstate: string;
  borncity: string;
  genderID: number;
  image: string;
  username: string;
  email: string;
  role: Role;
  statusID: number;
}

interface Gender {
  genderID: number;
  name: string;
}

@Component({
  selector: 'app-info-admin',
  standalone: true,
  imports: [RouterModule, CommonModule, DeleteAdminComponent],
  templateUrl: './info-admin.component.html',
  styleUrl: './info-admin.component.css'
})
export class InfoAdminComponent implements OnInit{

  deleteAdmin: boolean = false;
  code: string = '3';
  genders: Gender[] = [];
  genderName: string = '';

  infoAdmin: Admin = {
    userID: 0,
    firstname: '',
    secondname: '',
    firstlastname: '',
    secondlastname: '',
    identificationnumber: '',
    bornDate: '',
    borncountry: '',
    bornstate: '',
    borncity: '',
    genderID: 0,
    image: '',
    username: '',
    email: '',
    role: {
      roleID: 0,
      name: ''
    },
    statusID: 0
  };

  constructor(private deleteAdminService: ModalService, private apiService: ApiService, private route: ActivatedRoute, private router: Router){

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      if(params.get('code') ){
        this.code = params.get('code') ?? '';
      }
      else {
        this.router.navigate(['root']);
      }
    });
    this.getInfo();
    this.getGenders();
    this.deleteAdminService.$delete.subscribe((value)=>{this.deleteAdmin = value})
  }

  getInfo(){ 
    this.apiService.getData('data/get-user-info?userID='+ this.code).subscribe(
      (response) => {
        this.infoAdmin = response;
      },
      (error) => {

      }
    )
  }

  getGenders() {
    this.apiService.getData('sign-up/get-genders').subscribe(
      (response: Gender[]) => {
        this.genders = response;

        const gender = this.genders.find(g => g.genderID === this.infoAdmin.genderID);
        this.genderName = gender ? gender.name : 'Género no encontrado';
      },
      (error) => {
        console.log(error);
      }
    )
  }

  deleteAdminFunction(){
    this.deleteAdmin = true;
  }

}
