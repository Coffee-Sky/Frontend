import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RegisterComponent } from "./components/users/register/register.component";
import { LoginComponent } from "./components/users/login/login.component";
import { HeaderComponent } from "./components/home/header/header.component";
import { PageComponent } from "./components/home/page/page.component";
import { RootHomeComponent } from "./components/users/root/root-home/root-home.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RegisterComponent, LoginComponent, HeaderComponent, PageComponent, RootHomeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
}
