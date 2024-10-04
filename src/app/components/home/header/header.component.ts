import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JwtService } from '../../../services/jwt.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
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

}
