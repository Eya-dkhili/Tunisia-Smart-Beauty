
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  email = '';
  password = '';
  afficherPassword = false;

  messageErreur = '';
  chargement = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  connecter() {

    this.messageErreur = '';
    this.chargement = true;

    this.authService.connecter(
      this.email,
      this.password
    ).subscribe({

   next: (response) => {
  console.log('Connexion réussie :', response);

  this.chargement = false;

  localStorage.setItem('utilisateur', JSON.stringify(response));

  if (response.role === 'ADMIN') {
    this.router.navigate(['/admin']);
  }
  else if (response.role === 'PROFESSIONNEL') {
    this.router.navigate(['/ajouter-salon']);
  }
  else {
    this.router.navigate(['/accueil']);
  }
},

      error: (error) => {

        console.error('Erreur connexion :', error);

        this.chargement = false;

        this.messageErreur =
          error.error?.message ||
          'Email ou mot de passe incorrect';

      }

    });

  }
}
