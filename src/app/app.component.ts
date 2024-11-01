import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RegisterComponent } from "./components/users/register/register.component";
import { LoginComponent } from "./components/users/login/login.component";
import { HeaderComponent } from "./components/home/header/header.component";
import { PageComponent } from "./components/home/page/page.component";
import { RootHomeComponent } from "./components/users/root/root-home/root-home.component";
import { ProfileComponent } from "./components/users/profile/profile.component";
import { AdminHomeComponent } from "./components/users/admin/admin-home/admin-home.component";
import { InfoCardsComponent } from "./components/users/cards/info-cards/info-cards.component";
import { ListCardsComponent } from "./components/users/cards/list-cards/list-cards.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RegisterComponent, LoginComponent, HeaderComponent, PageComponent, RootHomeComponent, ProfileComponent, AdminHomeComponent, InfoCardsComponent, ListCardsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
}
