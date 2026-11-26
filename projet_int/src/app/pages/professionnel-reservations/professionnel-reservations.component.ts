
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import {
  ProfessionnelReservationService,
  ReservationProfessionnel
} from '../../services/professionnel-reservation.service';

@Component({
  selector: 'app-professionnel-reservations',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './professionnel-reservations.component.html',
  styleUrl: './professionnel-reservations.component.css'
})
export class ProfessionnelReservationsComponent implements OnInit {

  reservations: ReservationProfessionnel[] = [];

  chargement = false;
  erreur = '';
  message = '';

  filtre = 'TOUS';

  constructor(
    private reservationService: ProfessionnelReservationService,
    private router: Router
  ) {}

  // INITIALISATION
  ngOnInit(): void {

    const utilisateur = this.getUtilisateur();

    if (
      !utilisateur ||
      utilisateur.role !== 'PROFESSIONNEL' ||
      !utilisateur.token
    ) {
      this.router.navigate(['/login']);
      return;
    }

    this.chargerReservations();
  }

  // UTILISATEUR CONNECTE
  private getUtilisateur(): any {

    try {
      return JSON.parse(
        localStorage.getItem('utilisateur') || 'null'
      );
    } catch {
      return null;
    }
  }

  // CHARGER MES RESERVATIONS
  chargerReservations(): void {

    this.chargement = true;
    this.erreur = '';

    this.reservationService.getMesReservations().subscribe({

      next: (data) => {

        this.reservations = data || [];

        this.chargement = false;

        console.log(
          'Réservations du professionnel :',
          data
        );
      },

      error: (err) => {

        this.chargement = false;

        this.erreur =
          err.error?.message ||
          err.error?.detail ||
          'Impossible de charger les réservations.';

        console.error('Erreur réservations :', err);
      }

    });
  }

  // FILTRER LES RESERVATIONS
  get reservationsFiltrees(): ReservationProfessionnel[] {

    if (this.filtre === 'TOUS') {
      return this.reservations;
    }

    return this.reservations.filter(
      reservation => reservation.statut === this.filtre
    );
  }

  // CHANGER FILTRE
  changerFiltre(statut: string): void {
    this.filtre = statut;
  }

  // COMPTER PAR STATUT
  compter(statut: string): number {

    return this.reservations.filter(
      reservation => reservation.statut === statut
    ).length;
  }

  // CONFIRMER OU REFUSER
  traiterReservation(
    reservation: ReservationProfessionnel,
    nouveauStatut: 'CONFIRMEE' | 'REFUSEE'
  ): void {

    if (reservation.statut !== 'EN_ATTENTE') {
      return;
    }

    const action = nouveauStatut === 'CONFIRMEE'
      ? 'confirmer'
      : 'refuser';

    const confirmation = confirm(
      `Voulez-vous vraiment ${action} cette réservation ?`
    );

    if (!confirmation) {
      return;
    }

    this.erreur = '';
    this.message = '';

    this.reservationService.traiterReservation(
      reservation.id,
      nouveauStatut
    ).subscribe({

      next: (response) => {

        // Mettre à jour la réservation dans la liste
        this.reservations = this.reservations.map(item =>
          item.id === reservation.id ? response : item
        );

        this.message = nouveauStatut === 'CONFIRMEE'
          ? 'Réservation confirmée avec succès !'
          : 'Réservation refusée avec succès !';

        console.log('Réservation traitée :', response);

      },

      error: (err) => {

        this.erreur =
          err.error?.message ||
          err.error?.detail ||
          "Erreur lors du traitement de la réservation.";

        console.error('Erreur traitement réservation :', err);

      }

    });
  }

  // TRADUIRE LE STATUT
  libelleStatut(statut: string): string {

    const statuts: { [key: string]: string } = {
      EN_ATTENTE: 'En attente',
      CONFIRMEE: 'Confirmée',
      REFUSEE: 'Refusée',
      ANNULEE: 'Annulée'
    };

    return statuts[statut] || statut;
  }

  // CLASSE CSS DU STATUT
  classeStatut(statut: string): string {

    switch (statut) {

      case 'EN_ATTENTE':
        return 'pending-status';

      case 'CONFIRMEE':
        return 'confirmed-status';

      case 'REFUSEE':
        return 'refused-status';

      case 'ANNULEE':
        return 'cancelled-status';

      default:
        return '';
    }
  }

  // FORMAT DATE
  formatDate(date: string): string {

    if (!date) {
      return '—';
    }

    return date.split('-').reverse().join('/');
  }

  // FORMAT HEURE
  formatHeure(heure: string): string {

    if (!heure) {
      return '—';
    }

    return heure.substring(0, 5);
  }

}
