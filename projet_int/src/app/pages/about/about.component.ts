import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {

  objectifs = [
    {
      icon: '🔎',
      titre: 'Faciliter la recherche',
      description: 'Aider les utilisateurs à trouver facilement les salons et les prestations selon leurs besoins.'
    },
    {
      icon: '📅',
      titre: 'Simplifier la réservation',
      description: 'Permettre aux clients de consulter les services et de réserver leurs rendez-vous en quelques clics.'
    },
    {
      icon: '🤝',
      titre: 'Accompagner les professionnels',
      description: 'Offrir aux salons une plateforme pour présenter leurs services et gérer leurs rendez-vous.'
    }
  ];

  avantages = [
    {
      icon: '📍',
      titre: 'Recherche par localisation',
      description: 'Découvrez des salons dans différentes villes de Tunisie.'
    },
    {
      icon: '⭐',
      titre: 'Avis et évaluations',
      description: 'Consultez les évaluations pour mieux choisir votre salon.'
    },
    {
      icon: '💗',
      titre: 'Expérience simple',
      description: 'Une interface intuitive pour organiser vos moments de beauté.'
    },
    {
      icon: '📱',
      titre: 'Accessible partout',
      description: 'Consultez la plateforme depuis votre ordinateur ou votre mobile.'
    }
  ];

}