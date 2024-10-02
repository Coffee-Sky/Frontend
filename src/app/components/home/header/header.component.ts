import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JwtService } from '../../../services/jwt.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  constructor(private jwtService: JwtService) { }

  logout() {
    this.jwtService.removeToken();
    window.location.href = '';
  }

}
