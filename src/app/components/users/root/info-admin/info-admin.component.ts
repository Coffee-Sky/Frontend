import { Component, OnInit } from '@angular/core';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../../../services/modal.service';
import { ApiService } from '../../../../services/api.service';
import { StatusAdminComponent } from '../status-admin/status-admin.component';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

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
  imports: [RouterModule, CommonModule, StatusAdminComponent],
  templateUrl: './info-admin.component.html',
  styleUrl: './info-admin.component.css'
})
export class InfoAdminComponent implements OnInit {

  statusAdmin: boolean = false;
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

  constructor(
    private statusAdminService: ModalService,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.code = params.get('code') ?? '';
      if (!this.code) this.router.navigate(['root']);
    });

    this.loadInfoAndGenders();
    this.statusAdminService.$status.subscribe(value => this.statusAdmin = value);
  }

  // Encadenar las llamadas a los servicios
  loadInfoAndGenders() {
    this.getInfo().pipe(
      switchMap(() => this.getGenders())
    ).subscribe();
  }

  // Retorna un observable con la información del admin
  getInfo() {
    return this.apiService.getData(`data/get-user-info?userID=${this.code}`).pipe(
      switchMap((response: Admin) => {
        this.infoAdmin = response;
        return of(response);  // Retornamos un observable con los datos del admin
      })
    );
  }

  // Retorna un observable con la lista de géneros
  getGenders() {
    return this.apiService.getData('sign-up/get-genders').pipe(
      switchMap((response: Gender[]) => {
        this.genders = response;

        const gender = this.genders.find(g => g.genderID === this.infoAdmin.genderID);
        this.genderName = gender ? gender.name : 'Género no encontrado';
        return of(response);  // Retornamos un observable vacío
      })
    );
  }

  deleteAdminFunction() {
    this.statusAdmin = true;
  }
}
