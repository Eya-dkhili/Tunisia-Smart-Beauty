
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  nom = '';
  prenom = '';
  email = '';
  telephone = '';
  password = '';
  confirmPassword = '';
  role = 'CLIENT';

  afficherPassword = false;
  afficherConfirmation = false;

  messageErreur = '';
  inscriptionReussie = false;
  chargement = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  inscrire() {

    this.messageErreur = '';
    this.inscriptionReussie = false;

    if (this.password !== this.confirmPassword) {
      this.messageErreur = 'Les mots de passe ne correspondent pas.';
      return;
    }

    this.chargement = true;

    this.authService.inscrire({
      nom: this.nom,
      prenom: this.prenom,
      email: this.email,
      telephone: this.telephone,
      motDePasse: this.password,
      role: this.role
    }).subscribe({

      next: (response) => {
        console.log('Inscription réussie :', response);

        this.chargement = false;
        this.inscriptionReussie = true;

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },

      error: (error) => {
        console.error('Erreur inscription :', error);

        this.chargement = false;

        this.messageErreur =
          error.error?.message ||
          'Une erreur est survenue lors de l’inscription.';
      }
    });
  }
}
