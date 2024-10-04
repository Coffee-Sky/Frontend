import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CreationAdminComponent } from '../creation-admin/creation-admin.component';
import { InfoAdminComponent } from '../info-admin/info-admin.component';
import { CommonModule } from '@angular/common';
import { CreateAdminService } from '../../../../services/create-admin.service';

@Component({
  selector: 'app-root-home',
  standalone: true,
  imports: [RouterModule, CommonModule, CreationAdminComponent, InfoAdminComponent],
  templateUrl: './root-home.component.html',
  styleUrl: './root-home.component.css'
})

export class RootHomeComponent implements OnInit{
  creationAdmin: boolean = false;
  
  constructor(private createAdminService: CreateAdminService){
  }

  ngOnInit(): void {
    this.createAdminService.$create.subscribe((value)=>{this.creationAdmin = value})
  }

  createAdmin(){
    this.creationAdmin = true;
  }
}
