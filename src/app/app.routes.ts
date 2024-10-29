import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './components/users/register/register.component';
import { LoginComponent } from './components/users/login/login.component';
import { PageComponent } from './components/home/page/page.component';
import { authGuard } from './guards/auth.guard';
import { noAuthGuard } from './guards/no-auth.guard';
import { InfoAdminComponent } from './components/users/root/info-admin/info-admin.component';
import { RootHomeComponent } from './components/users/root/root-home/root-home.component';
import { rootGuard } from './guards/root.guard';
import { InfoFlightComponent } from './components/users/admin/info-flight/info-flight.component';
import { CreationFlightComponent } from './components/users/admin/creation-flight/creation-flight.component';
import { ProfileComponent } from './components/users/profile/profile.component';
import { AdminHomeComponent } from './components/users/admin/admin-home/admin-home.component';
import { adminGuard } from './guards/admin.guard';
import { usersRegisteredGuard } from './guards/users-registered.guard';
import { FlightsComponent } from './components/home/flights/flights.component';
import { ListCardsComponent } from './components/users/cards/list-cards/list-cards.component';
import { InfoCardsComponent } from './components/users/cards/info-cards/info-cards.component';
import { AddCardComponent } from './components/users/cards/add-card/add-card.component';

export const routes: Routes = [
  { path: '', component: PageComponent, canActivate: [authGuard]}, 
  { path: 'login', component: LoginComponent, canActivate: [noAuthGuard]},
  { path: 'register', component: RegisterComponent, canActivate: [noAuthGuard]},
  { path: 'root', component: RootHomeComponent, canActivate: [rootGuard]},
  { path: 'flight/:code', component: InfoFlightComponent, canActivate: [adminGuard]},
  { path: 'creation', component: CreationFlightComponent, canActivate: [adminGuard]},
  { path: 'flights', component: FlightsComponent},
  { path: 'info/:code', component: InfoAdminComponent, canActivate: [rootGuard]},
  { path: 'profile', component: ProfileComponent, canActivate: [usersRegisteredGuard]},
  { path: 'admin', component: AdminHomeComponent, canActivate: [adminGuard]},
  { path: 'cards', component: ListCardsComponent},
  { path: 'add-card', component: AddCardComponent},
  { path: 'info-card/:id', component: InfoCardsComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule {} 