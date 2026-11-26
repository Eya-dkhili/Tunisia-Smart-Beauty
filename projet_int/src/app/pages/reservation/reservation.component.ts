
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SalonService } from '../../services/salon.service';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.css'
})
export class ReservationComponent implements OnInit {

  private apiUrl = 'http://localhost:8081/api/client/reservations';

  salonId: number | null = null;
  prestationId: number | null = null;

  salon: any = null;
  prestation: any = null;

  chargement = true;
  enregistrement = false;

  erreur = '';
  messageErreur = '';

  service = '';
  date = '';
  heure = '';
  nom = '';
  telephone = '';
  email = '';

  confirmation = false;
  reservationEnregistree: any = null;

  constructor(
    private route: ActivatedRoute,
    private salonService: SalonService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {

    this.salonId = Number(this.route.snapshot.paramMap.get('id'));

    this.prestationId = Number(
      this.route.snapshot.queryParamMap.get('prestationId')
    );

    if (!this.salonId || !this.prestationId) {
      this.erreur = 'Informations de réservation introuvables.';
      this.chargement = false;
      return;
    }

    // Charger le salon
    this.salonService.afficherSalons().subscribe({

      next: (salons) => {

        this.salon = salons.find(
          (s: any) => Number(s.id) === this.salonId
        );

        if (!this.salon) {
          this.erreur = 'Salon introuvable.';
          this.chargement = false;
          return;
        }

        // Charger les prestations du salon
        this.salonService.afficherPrestations(this.salonId!).subscribe({

          next: (prestations) => {

            this.prestation = prestations.find(
              (p: any) => Number(p.id) === this.prestationId
            );

            if (!this.prestation) {
              this.erreur = 'Prestation introuvable.';
            } else {
              this.service = this.prestation.nom;
            }

            this.chargement = false;
          },

          error: () => {
            this.erreur = 'Impossible de charger les prestations.';
            this.chargement = false;
          }

        });
      },

      error: () => {
        this.erreur = 'Impossible de charger les salons.';
        this.chargement = false;
      }

    });
  }

  confirmerReservation(): void {

    this.messageErreur = '';
    this.confirmation = false;

    // 1. Vérifier la connexion du client en premier
    const storedUser = localStorage.getItem('utilisateur');

    if (!storedUser) {
      this.messageErreur =
        'Pour effectuer une réservation, veuillez d’abord créer un compte ou vous connecter.';
      return;
    }

    let utilisateur: any;

    try {
      utilisateur = JSON.parse(storedUser);
    } catch {
      this.messageErreur =
        'Session invalide. Veuillez vous reconnecter.';
      return;
    }

    // 2. Vérifier le rôle et le token
    if (utilisateur.role !== 'CLIENT' || !utilisateur.token) {
      this.messageErreur =
        'Connectez-vous avec un compte Client pour réserver.';
      return;
    }

    // 3. Vérifier les champs obligatoires
    if (
      !this.date ||
      !this.heure ||
      !this.nom.trim() ||
      !this.telephone.trim() ||
      !this.email.trim()
    ) {
      this.messageErreur = 'Veuillez remplir tous les champs.';
      return;
    }

    // 4. Vérifier les informations du salon et de la prestation
    if (!this.salonId || !this.prestationId) {
      this.messageErreur =
        'Informations du salon ou de la prestation invalides.';
      return;
    }

    // 5. Préparer les données de réservation
    const request = {
      salonId: this.salonId,
      prestationId: this.prestationId,
      dateReservation: this.date,
      heureReservation: this.heure
    };

    // 6. Préparer les headers avec le token JWT
    const headers = new HttpHeaders({
      Authorization: `Bearer ${utilisateur.token}`,
      'Content-Type': 'application/json'
    });

    this.enregistrement = true;

    // 7. Envoyer la réservation au Backend
    this.http.post<any>(this.apiUrl, request, { headers }).subscribe({

      next: (response) => {

        this.reservationEnregistree = response;

        // Afficher la confirmation après succès du Backend
        this.confirmation = true;

        this.messageErreur = '';
        this.enregistrement = false;
      },

      error: (error) => {

        this.enregistrement = false;

        if (error.status === 401) {
          this.messageErreur =
            'Session expirée. Veuillez vous reconnecter.';
        } else if (error.status === 403) {
          this.messageErreur =
            'Accès refusé. Vérifiez votre compte Client.';
        } else if (error.status === 409) {
          this.messageErreur =
            'Ce créneau est déjà réservé.';
        } else {
          this.messageErreur =
            error.error?.message ||
            error.error?.detail ||
            'Impossible d’enregistrer la réservation. Veuillez réessayer.';
        }

        console.error('Erreur réservation :', error);
      }

    });
  }
}
