
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  utilisateur = JSON.parse(
    localStorage.getItem('utilisateur') || 'null'
  );

  lienAjouterSalon = '/login';

  constructor(private router: Router) {

    if (this.utilisateur?.role === 'PROFESSIONNEL') {
      this.lienAjouterSalon = '/ajouter-salon';
    }

  }

  get estClient(): boolean {
    return this.utilisateur?.role === 'CLIENT';
  }

  get estProfessionnel(): boolean {
    return this.utilisateur?.role === 'PROFESSIONNEL';
  }

  get estAdmin(): boolean {
    return this.utilisateur?.role === 'ADMIN';
  }

  deconnexion(): void {

    localStorage.removeItem('utilisateur');

    this.utilisateur = null;

    this.lienAjouterSalon = '/login';

    this.router.navigate(['/accueil']);
  }
}
