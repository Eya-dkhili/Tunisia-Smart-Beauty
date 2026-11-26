
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import {
  AdminService,
  Utilisateur,
  Salon,
  Reservation
} from '../../services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {

  constructor(
    private adminService: AdminService,
    private router: Router
  ) {}

  // MENU
  activeMenu = 'Dashboard';

  menus = [
    { name: 'Dashboard', icon: '⌂' },
    { name: 'Utilisateurs', icon: '♙' },
    { name: 'Salons', icon: '✿' },
    { name: 'Réservations', icon: '▦' },
    { name: 'Sécurité', icon: '♢' }
  ];

  // INFORMATIONS ADMIN
  adminNom = 'Administrateur';
  adminEmail = '';

  // UTILISATEURS
  users: Utilisateur[] = [];
  chargementUtilisateurs = false;
  erreurUtilisateurs = '';

  // SALONS
  salons: Salon[] = [];
  chargementSalons = false;
  erreurSalons = '';

  // RESERVATIONS
  reservations: Reservation[] = [];
  chargementReservations = false;
  erreurReservations = '';

  // DETAILS RESERVATION
  reservationSelectionnee: Reservation | null = null;
  chargementDetails = false;
  erreurDetails = '';

  // ROLES ET PERMISSIONS
  roles = [
    {
      name: 'ADMIN',
      description: 'Administration de la plateforme.',
      permissions: [
        'Consulter les utilisateurs',
        'Supprimer les utilisateurs',
        'Consulter les salons',
        'Supprimer les salons',
        'Consulter toutes les réservations'
      ]
    },
    {
      name: 'PROFESSIONNEL',
      description: 'Gestion de son salon et de ses activités.',
      permissions: [
        'Gérer son salon',
        'Gérer ses prestations et tarifs',
        'Consulter ses réservations',
        'Confirmer ou refuser les réservations'
      ]
    },
    {
      name: 'CLIENT',
      description: 'Accès aux services de beauté.',
      permissions: [
        'Consulter les salons',
        'Consulter les prestations',
        'Effectuer une réservation',
        'Consulter et annuler ses réservations'
      ]
    }
  ];

  // INITIALISATION
  ngOnInit(): void {
    this.chargerInformationsAdmin();
    this.chargerUtilisateurs();
    this.chargerSalons();
    this.chargerReservations();
  }

  // INFORMATIONS ADMIN CONNECTE
  chargerInformationsAdmin(): void {
    const donnees = localStorage.getItem('utilisateur');

    if (donnees) {
      try {
        const utilisateur = JSON.parse(donnees);

        this.adminNom =
          `${utilisateur.prenom || ''} ${utilisateur.nom || ''}`.trim()
          || 'Administrateur';

        this.adminEmail = utilisateur.email || '';

      } catch (error) {
        console.error('Erreur lecture utilisateur :', error);
      }
    }
  }

  // CHANGER MENU
  changeMenu(menu: string): void {
    this.activeMenu = menu;

    if (menu === 'Utilisateurs' && this.users.length === 0) {
      this.chargerUtilisateurs();
    }

    if (menu === 'Salons' && this.salons.length === 0) {
      this.chargerSalons();
    }

    if (menu === 'Réservations' && this.reservations.length === 0) {
      this.chargerReservations();
    }
  }

  // =====================================
  // UTILISATEURS
  // =====================================

  chargerUtilisateurs(): void {
    this.chargementUtilisateurs = true;
    this.erreurUtilisateurs = '';

    this.adminService.getAllUtilisateurs().subscribe({

      next: (data) => {
        this.users = data;
        this.chargementUtilisateurs = false;

        console.log('Utilisateurs chargés :', data);
      },

      error: (error) => {
        this.chargementUtilisateurs = false;
        this.erreurUtilisateurs =
          error.error?.message ||
          'Impossible de charger les utilisateurs.';

        console.error('Erreur utilisateurs :', error);
      }

    });
  }

  supprimerUtilisateur(id: number): void {

    const confirmation = confirm(
      'Voulez-vous vraiment supprimer cet utilisateur ?'
    );

    if (!confirmation) {
      return;
    }

    this.adminService.supprimerUtilisateur(id).subscribe({

      next: (response) => {
        alert(
          response.message ||
          'Utilisateur supprimé avec succès.'
        );

        this.chargerUtilisateurs();
      },

      error: (error) => {
        console.error('Erreur suppression utilisateur :', error);

        alert(
          error.error?.message ||
          'Impossible de supprimer cet utilisateur.'
        );
      }

    });
  }

  // =====================================
  // SALONS
  // =====================================

  chargerSalons(): void {
    this.chargementSalons = true;
    this.erreurSalons = '';

    this.adminService.getAllSalons().subscribe({

      next: (data) => {
        this.salons = data;
        this.chargementSalons = false;

        console.log('Salons chargés :', data);
      },

      error: (error) => {
        this.chargementSalons = false;
        this.erreurSalons =
          error.error?.message ||
          'Impossible de charger les salons.';

        console.error('Erreur salons :', error);
      }

    });
  }

  supprimerSalon(id: number): void {

    const confirmation = confirm(
      'Voulez-vous vraiment supprimer ce salon ?'
    );

    if (!confirmation) {
      return;
    }

    this.adminService.supprimerSalon(id).subscribe({

      next: (response) => {
        alert(
          response.message ||
          'Salon supprimé avec succès.'
        );

        this.chargerSalons();
      },

      error: (error) => {
        console.error('Erreur suppression salon :', error);

        alert(
          error.error?.message ||
          'Impossible de supprimer ce salon.'
        );
      }

    });
  }

  // =====================================
  // RESERVATIONS
  // =====================================

  chargerReservations(): void {
    this.chargementReservations = true;
    this.erreurReservations = '';

    this.adminService.getAllReservations().subscribe({

      next: (data) => {
        this.reservations = data;
        this.chargementReservations = false;

        console.log('Réservations chargées :', data);
      },

      error: (error) => {
        this.chargementReservations = false;
        this.erreurReservations =
          error.error?.message ||
          'Impossible de charger les réservations.';

        console.error('Erreur réservations :', error);
      }

    });
  }

  // CONSULTER DETAILS RESERVATION
  voirDetailsReservation(id: number): void {

    this.chargementDetails = true;
    this.erreurDetails = '';
    this.reservationSelectionnee = null;

    this.adminService.getReservationById(id).subscribe({

      next: (data) => {
        this.reservationSelectionnee = data;
        this.chargementDetails = false;
      },

      error: (error) => {
        this.chargementDetails = false;

        this.erreurDetails =
          error.error?.message ||
          'Impossible de charger les détails.';

        console.error('Erreur détails réservation :', error);
      }

    });
  }

  fermerDetailsReservation(): void {
    this.reservationSelectionnee = null;
    this.erreurDetails = '';
  }

  // COMPTER LES RESERVATIONS PAR STATUT
  countReservations(statut: string): number {

    return this.reservations.filter(
      reservation => reservation.statut === statut
    ).length;

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
        return 'active-status';

      case 'REFUSEE':
      case 'ANNULEE':
        return 'blocked-status';

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

  // DECONNEXION
  deconnexion(): void {

    const confirmation = confirm(
      'Voulez-vous vraiment vous déconnecter ?'
    );

    if (!confirmation) {
      return;
    }

    localStorage.removeItem('utilisateur');
    this.router.navigate(['/login']);
  }

}
