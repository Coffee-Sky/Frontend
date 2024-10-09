import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CreationAdminComponent } from '../creation-admin/creation-admin.component';
import { InfoAdminComponent } from '../info-admin/info-admin.component';
import { CommonModule } from '@angular/common';
import { CreateAdminService } from '../../../../services/modal/create-admin.service';
import { PasswordRootService } from '../../../../services/modal/password-root.service';
import { PasswordRootComponent } from '../password-root/password-root.component';
import { DeleteAdminComponent } from '../delete-admin/delete-admin.component';
import { DeleteAdminService } from '../../../../services/modal/delete-admin.service';
import { ApiService } from '../../../../services/api.service';
import { JwtService } from '../../../../services/jwt.service';

interface Admins {
  userID: number;
  firstname: string;
  secondname: string;
  firstlastname: string;
  secondlastname: string;
  username: string;
  email: string;
  statusName: number;
}

@Component({
  selector: 'app-root-home',
  standalone: true,
  imports: [RouterModule, CommonModule, CreationAdminComponent, InfoAdminComponent, PasswordRootComponent, DeleteAdminComponent],
  templateUrl: './root-home.component.html',
  styleUrl: './root-home.component.css'
})

export class RootHomeComponent implements OnInit{
  creationAdmin: boolean = false;
  changePassword: boolean = false;
  deleteAdmin: boolean = false;

  admins: Admins[] = [];
  
  constructor(private createAdminService: CreateAdminService, 
              private passwordService: PasswordRootService, 
              private deleteAdminService: DeleteAdminService,
              private apiService: ApiService,
              private jwtService: JwtService
            ){}

  ngOnInit(): void {
    this.createAdminService.$create.subscribe((value)=>{this.creationAdmin = value})
    this.passwordService.$password.subscribe((value)=>{this.changePassword = value})
    this.deleteAdminService.$delete.subscribe((value)=>{this.deleteAdmin = value})
    this.getAdmins();
  }

  createAdmin(){
    this.creationAdmin = true;
  }

  changePasswordRoot(){
    this.changePassword = true;
  }

  deleteAdminFunction(){
    this.deleteAdmin = true;
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
