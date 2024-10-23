import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CreationAdminComponent } from '../creation-admin/creation-admin.component';
import { InfoAdminComponent } from '../info-admin/info-admin.component';
import { CommonModule } from '@angular/common';
import { PasswordRootComponent } from '../password-root/password-root.component';
import { StatusAdminComponent } from '../status-admin/status-admin.component';
import { ApiService } from '../../../../services/api.service';
import { JwtService } from '../../../../services/jwt.service';
import { ModalService } from '../../../../services/modal.service';

interface Admins {
  userID: number;
  firstname: string;
  secondname: string;
  firstlastname: string;
  secondlastname: string;
  username: string;
  email: string;
  statusID: number;
}

@Component({
  selector: 'app-root-home',
  standalone: true,
  imports: [RouterModule, CommonModule, CreationAdminComponent, InfoAdminComponent, PasswordRootComponent, StatusAdminComponent],
  templateUrl: './root-home.component.html',
  styleUrl: './root-home.component.css'
})

export class RootHomeComponent implements OnInit{
  creationAdmin: boolean = false;
  changePassword: boolean = false;
  statusAdmin: boolean = false;

  admins: Admins[] = [];
  
  constructor(private createAdminService: ModalService, 
              private passwordService: ModalService, 
              private statusAdminService: ModalService,
              private apiService: ApiService,
              private jwtService: JwtService
            ){}

  ngOnInit(): void {
    this.createAdminService.$create.subscribe((value)=>{this.creationAdmin = value})
    this.passwordService.$password.subscribe((value)=>{this.changePassword = value})
    this.statusAdminService.$status.subscribe((value)=>{this.statusAdmin = value})
    this.getAdmins();
  }

  createAdmin(){
    this.creationAdmin = true;
  }

  changePasswordRoot(){
    this.changePassword = true;
  }

  deleteAdminFunction(id: number){
    this.apiService.putData("update/delete-admin?userID="+id, {}).subscribe(
      (response) => {
        console.log(response);
        this.getAdmins();
      },
      (error) => {
        console.error('Error eliminando el administrador:', error);
      }
    )
  }

  getAdmins() {
    this.apiService.getData("data/get-admins").subscribe(
      (response) => {
        this.admins = response;
        console.log(this.admins);
      },
      (error) => {
        console.error('Error obteniendo los administradores:', error);
      }
    )
  }

  logout() {
    this.jwtService.removeToken();
    window.location.href = '';
  }

}
