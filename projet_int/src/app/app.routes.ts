
import { Routes } from '@angular/router';

import { SalonsComponent } from './pages/salons/salons.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { SalonDetailsComponent } from './pages/salon-details/salon-details.component';
import { ReservationComponent } from './pages/reservation/reservation.component';
import { ServicesComponent } from './pages/services/services.component';
import { AboutComponent } from './pages/about/about.component';
import { AjouterSalonComponent } from './pages/ajouter-salon/ajouter-salon.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';

import { ProfessionnelReservationsComponent } from './pages/professionnel-reservations/professionnel-reservations.component';

import { adminGuard } from './guards/admin.guard';
import { professionnelGuard } from './guards/professionnel.guard';
import { EspaceClientComponent } from './pages/espace-client/espace-client.component';

export const routes: Routes = [

  { path: '', redirectTo: 'accueil', pathMatch: 'full' },

  { path: 'accueil', component: HomeComponent },

  { path: 'salons', component: SalonsComponent },

  { path: 'login', component: LoginComponent },

  { path: 'register', component: RegisterComponent },

  { path: 'salon-details/:id', component: SalonDetailsComponent },

  { path: 'reservation/:id', component: ReservationComponent },

  { path: 'services', component: ServicesComponent },

  { path: 'about', component: AboutComponent },

  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [adminGuard]
  },

  {
    path: 'ajouter-salon',
    component: AjouterSalonComponent,
    canActivate: [professionnelGuard]
  },

  {
    path: 'mes-reservations',
    component: ProfessionnelReservationsComponent,
    canActivate: [professionnelGuard]
  },
  {
  path: 'espace-client',
  component: EspaceClientComponent
},

  { path: '**', redirectTo: 'accueil' }

];
