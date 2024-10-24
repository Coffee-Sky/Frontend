import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JwtService } from '../../../services/jwt.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  constructor(public jwtService: JwtService) { }

  ngOnInit(): void {
  }

  logout() {
    this.jwtService.removeToken();
    window.location.href = '';
  }

  searchForm = new FormGroup({
    search: new FormControl('', Validators.required),
  });

  save() {
    if (this.searchForm.valid) {
      console.log(this.searchForm.value);
    } else {
      console.log('Error');
    }
  }

}
