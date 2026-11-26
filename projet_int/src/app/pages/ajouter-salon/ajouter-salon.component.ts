
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { SalonService } from '../../services/salon.service';

@Component({
  selector: 'app-ajouter-salon',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './ajouter-salon.component.html',
  styleUrl: './ajouter-salon.component.css'
})
export class AjouterSalonComponent implements OnInit {

  // FORMULAIRE SALON
  salon = this.nouveauSalon();

  // MES SALONS
  salons: any[] = [];

  // FORMULAIRE PRESTATION
  prestation = this.nouvellePrestation();

  salonPrestationId: number | null = null;

  // MODIFICATION SALON
  salonEnEditionId: number | null = null;

  // MESSAGES
  message = '';
  erreur = '';

  messagePrestation = '';
  erreurPrestation = '';

  erreurChargementSalons = '';

  // CHARGEMENT
  chargement = false;
  chargementSalons = false;
  chargementPrestation = false;

  constructor(
    private salonService: SalonService,
    private router: Router
  ) {}

  // INITIALISATION
  ngOnInit(): void {

    const utilisateur = this.getUtilisateur();

    if (
      !utilisateur ||
      utilisateur.role !== 'PROFESSIONNEL' ||
      !utilisateur.id ||
      !utilisateur.token
    ) {
      this.router.navigate(['/accueil']);
      return;
    }

    this.chargerMesSalons();
  }

  // FORMULAIRE SALON VIDE
  private nouveauSalon() {

    return {
      nom: '',
      ville: '',
      adresse: '',
      note: 0,
      service: '',
      emoji: '',
      image: ''
    };
  }

  // FORMULAIRE PRESTATION VIDE
  private nouvellePrestation() {

    return {
      nom: '',
      prix: 0,
      dureeMinutes: 30,
      description: ''
    };
  }

  // RECUPERER UTILISATEUR CONNECTE
  private getUtilisateur(): any {

    try {
      return JSON.parse(
        localStorage.getItem('utilisateur') || 'null'
      );

    } catch {
      return null;
    }
  }

  // =====================================
  // GESTION DES SALONS
  // =====================================

  // AFFICHER MES SALONS
  chargerMesSalons(): void {

    this.chargementSalons = true;
    this.erreurChargementSalons = '';

    this.salonService.afficherMesSalons().subscribe({

      next: (data) => {

        this.salons = data || [];

        this.chargementSalons = false;

        console.log('Mes salons :', data);

      },

      error: (err) => {

        this.chargementSalons = false;

        this.erreurChargementSalons =
          err.error?.message ||
          err.error?.detail ||
          'Impossible de charger vos salons.';

        console.error('Erreur chargement salons :', err);

      }

    });
  }

  // ENREGISTRER SALON : AJOUT OU MODIFICATION
  enregistrerSalon(): void {

    if (this.salonEnEditionId !== null) {
      this.modifierSalon();
    } else {
      this.ajouterSalon();
    }
  }

  // AJOUTER UN SALON
  ajouterSalon(): void {

    this.message = '';
    this.erreur = '';

    const utilisateur = this.getUtilisateur();

    if (
      !utilisateur?.id ||
      utilisateur.role !== 'PROFESSIONNEL'
    ) {

      this.erreur =
        'Seuls les professionnels peuvent ajouter un salon.';

      return;
    }

    this.chargement = true;

    this.salonService.ajouterSalon(
      this.salon,
      utilisateur.id
    ).subscribe({

      next: (response) => {

        this.chargement = false;

        this.message = 'Salon ajouté avec succès !';

        console.log('Salon ajouté :', response);

        this.reinitialiserFormulaire();

        this.chargerMesSalons();

      },

      error: (err) => {

        this.chargement = false;

        this.erreur =
          err.error?.message ||
          err.error?.detail ||
          "Erreur lors de l'ajout du salon.";

        console.error('Erreur ajout salon :', err);

      }

    });
  }

  // PREPARER MODIFICATION
  preparerModification(salon: any): void {

    this.message = '';
    this.erreur = '';

    this.salonEnEditionId = salon.id;

    this.salon = {

      nom: salon.nom || '',

      ville: salon.ville || '',

      adresse: salon.adresse || '',

      note: salon.note ?? 0,

      service: salon.service || '',

      emoji: salon.emoji || '',

      image: salon.image || ''

    };

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  // MODIFIER UN SALON
  modifierSalon(): void {

    this.message = '';
    this.erreur = '';

    if (this.salonEnEditionId === null) {
      return;
    }

    const salonId = this.salonEnEditionId;

    // Champs autorisés par ModifierSalonRequest
    const donnees = {

      nom: this.salon.nom,

      ville: this.salon.ville,

      adresse: this.salon.adresse,

      service: this.salon.service,

      emoji: this.salon.emoji,

      image: this.salon.image

    };

    this.chargement = true;

    this.salonService.modifierSalon(
      salonId,
      donnees
    ).subscribe({

      next: (response) => {

        this.chargement = false;

        this.message = 'Salon modifié avec succès !';

        console.log('Salon modifié :', response);

        this.reinitialiserFormulaire();

        this.chargerMesSalons();

      },

      error: (err) => {

        this.chargement = false;

        this.erreur =
          err.error?.message ||
          err.error?.detail ||
          'Erreur lors de la modification du salon.';

        console.error('Erreur modification salon :', err);

      }

    });
  }

  // ANNULER MODIFICATION SALON
  annulerModification(): void {

    this.reinitialiserFormulaire();

    this.message = '';
    this.erreur = '';

  }

  // REINITIALISER FORMULAIRE SALON
  private reinitialiserFormulaire(): void {

    this.salon = this.nouveauSalon();

    this.salonEnEditionId = null;

  }

  // =====================================
  // GESTION DES PRESTATIONS
  // =====================================

  // OUVRIR FORMULAIRE PRESTATION
  ouvrirFormulairePrestation(salonId: number): void {

    this.salonPrestationId = salonId;

    this.prestation = this.nouvellePrestation();

    this.messagePrestation = '';
    this.erreurPrestation = '';

  }

  // FERMER FORMULAIRE PRESTATION
  fermerFormulairePrestation(): void {

    this.salonPrestationId = null;

    this.prestation = this.nouvellePrestation();

    this.messagePrestation = '';
    this.erreurPrestation = '';

  }

  // AJOUTER UNE PRESTATION
  ajouterPrestation(): void {

    this.messagePrestation = '';
    this.erreurPrestation = '';

    if (this.salonPrestationId === null) {
      return;
    }

    const salonId = this.salonPrestationId;

    const donnees = {

      nom: this.prestation.nom,

      prix: Number(this.prestation.prix),

      dureeMinutes: Number(this.prestation.dureeMinutes),

      description: this.prestation.description

    };

    this.chargementPrestation = true;

    this.salonService.ajouterPrestation(
      salonId,
      donnees
    ).subscribe({

      next: (response) => {

        this.chargementPrestation = false;

        this.messagePrestation =
          'Prestation ajoutée avec succès !';

        console.log('Prestation ajoutée :', response);

        this.salonPrestationId = null;

        this.prestation = this.nouvellePrestation();

        this.chargerMesSalons();

      },

      error: (err) => {

        this.chargementPrestation = false;

        this.erreurPrestation =
          err.error?.message ||
          err.error?.detail ||
          "Erreur lors de l'ajout de la prestation.";

        console.error('Erreur ajout prestation :', err);

      }

    });
  }

  // SUPPRIMER UNE PRESTATION
  supprimerPrestation(
    prestationId: number,
    salonId: number
  ): void {

    const confirmation = confirm(
      'Voulez-vous vraiment supprimer cette prestation ?'
    );

    if (!confirmation) {
      return;
    }

    this.messagePrestation = '';
    this.erreurPrestation = '';

    this.salonService
      .supprimerPrestation(prestationId)
      .subscribe({

        next: (response) => {

          this.messagePrestation =
            response?.message ||
            'Prestation supprimée avec succès !';

          this.chargerMesSalons();

        },

        error: (err) => {

          if (err.status === 409) {

            this.erreurPrestation =
              err.error?.message ||
              err.error?.detail ||
              'Cette prestation possède des réservations et ne peut pas être supprimée.';

          } else {

            this.erreurPrestation =
              err.error?.message ||
              err.error?.detail ||
              'Erreur lors de la suppression de la prestation.';

          }

          console.error('Erreur suppression prestation :', err);

        }

      });
  }

}
