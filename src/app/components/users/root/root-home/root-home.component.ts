import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CreationAdminComponent } from '../creation-admin/creation-admin.component';
import { InfoAdminComponent } from '../info-admin/info-admin.component';
import { CommonModule } from '@angular/common';
import { CreateAdminService } from '../../../../services/create-admin.service';
import { PasswordRootService } from '../../../../services/password-root.service';
import { PasswordRootComponent } from '../password-root/password-root.component';
import { DeleteAdminComponent } from '../delete-admin/delete-admin.component';
import { DeleteAdminService } from '../../../../services/delete-admin.service';

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
  
  constructor(private createAdminService: CreateAdminService, private passwordService: PasswordRootService, private deleteAdminService: DeleteAdminService){
  }

  ngOnInit(): void {
    this.createAdminService.$create.subscribe((value)=>{this.creationAdmin = value})
    this.passwordService.$password.subscribe((value)=>{this.changePassword = value})
    this.deleteAdminService.$delete.subscribe((value)=>{this.deleteAdmin = value})
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

}
