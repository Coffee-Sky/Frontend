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

export const routes: Routes = [
  { path: '', component: PageComponent, canActivate: [authGuard] }, 
  { path: 'login', component: LoginComponent, canActivate: [noAuthGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [noAuthGuard] },
  { path: 'root', component: RootHomeComponent, canActivate: [rootGuard]},
  { path: 'info-vuelo', component: InfoFlightComponent},
  { path: 'creation', component: CreationFlightComponent}
  { path: 'info/:code', component: InfoAdminComponent},
  { path: 'profile', component: ProfileComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule {} 