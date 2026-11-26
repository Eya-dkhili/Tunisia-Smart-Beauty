
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface Reservation {
  id: number;
  client: string;
  email: string;
  salon: string;
  prestation: string;
  prix: number;
  dateReservation: string;
  heureReservation: string;
  statut: string;
}

@Component({
  selector: 'app-espace-client',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './espace-client.component.html',
  styleUrl: './espace-client.component.css'
})
export class EspaceClientComponent implements OnInit {

  private apiUrl = 'http://localhost:8081/api/client/reservations';

  utilisateur: any = null;

  reservations: Reservation[] = [];

  chargement = false;
  annulationEnCours: number | null = null;

  messageErreur = '';
  messageSucces = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.chargerUtilisateur();
    this.chargerReservations();
  }

  // Récupérer les informations du client
  chargerUtilisateur(): void {
    const donnees = localStorage.getItem('utilisateur');

    if (!donnees) {
      this.router.navigate(['/login']);
      return;
    }

    try {
      this.utilisateur = JSON.parse(donnees);

      if (this.utilisateur?.role !== 'CLIENT') {
        this.router.navigate(['/accueil']);
      }
    } catch {
      localStorage.removeItem('utilisateur');
      this.router.navigate(['/login']);
    }
  }

  // Récupérer le token JWT
  private getToken(): string {
    return (
      this.utilisateur?.token ||
      this.utilisateur?.accessToken ||
      this.utilisateur?.jwt ||
      this.utilisateur?.data?.token ||
      ''
    );
  }

  // Préparer les headers HTTP
  private getHeaders(): HttpHeaders {
    const token = this.getToken();

    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Charger les réservations du client
  chargerReservations(): void {
    this.chargement = true;
    this.messageErreur = '';

    this.http.get<Reservation[]>(this.apiUrl, {
      headers: this.getHeaders()
    }).subscribe({
      next: (data) => {
        this.reservations = Array.isArray(data) ? data : [];
        this.chargement = false;
      },
      error: (error) => {
        console.error('Erreur chargement réservations :', error);
        this.messageErreur =
          error.status === 401 || error.status === 403
            ? 'Votre session a expiré. Veuillez vous reconnecter.'
            : 'Impossible de charger vos réservations. Réessayez plus tard.';

        this.chargement = false;
      }
    });
  }

  // Réservations à venir
  get reservationsAVenir(): Reservation[] {
    const aujourdHui = this.getDateAujourdhui();

    return this.reservations.filter(reservation => {
      const statut = reservation.statut?.toUpperCase();

      return (
        reservation.dateReservation >= aujourdHui &&
        (statut === 'EN_ATTENTE' || statut === 'CONFIRMEE')
      );
    }).sort((a, b) => {
      return (
        a.dateReservation.localeCompare(b.dateReservation) ||
        a.heureReservation.localeCompare(b.heureReservation)
      );
    });
  }

  // Historique des réservations
  get historique(): Reservation[] {
    const aujourdHui = this.getDateAujourdhui();

    return this.reservations.filter(reservation => {
      const statut = reservation.statut?.toUpperCase();

      return (
        reservation.dateReservation < aujourdHui ||
        statut === 'ANNULEE' ||
        statut === 'TERMINEE'
      );
    }).sort((a, b) =>
      b.dateReservation.localeCompare(a.dateReservation)
    );
  }

  get totalReservations(): number {
    return this.reservations.length;
  }

  get nombreAVenir(): number {
    return this.reservationsAVenir.length;
  }

  get nombreConfirmees(): number {
    return this.reservations.filter(
      r => r.statut?.toUpperCase() === 'CONFIRMEE'
    ).length;
  }

  get nombreAnnulees(): number {
    return this.reservations.filter(
      r => r.statut?.toUpperCase() === 'ANNULEE'
    ).length;
  }

  // Vérifier si le client peut annuler
  peutAnnuler(reservation: Reservation): boolean {
    const statut = reservation.statut?.toUpperCase();

    return statut === 'EN_ATTENTE' || statut === 'CONFIRMEE';
  }

  // Annuler une réservation
  annulerReservation(reservation: Reservation): void {
    const confirmation = window.confirm(
      'Voulez-vous vraiment annuler cette réservation ?'
    );

    if (!confirmation) {
      return;
    }

    this.annulationEnCours = reservation.id;
    this.messageErreur = '';
    this.messageSucces = '';

    this.http.put(
      `${this.apiUrl}/${reservation.id}/annuler`,
      {},
      { headers: this.getHeaders() }
    ).subscribe({
      next: () => {
        this.messageSucces = 'Votre réservation a été annulée avec succès.';
        this.annulationEnCours = null;
        this.chargerReservations();
      },
      error: (error) => {
        console.error('Erreur annulation :', error);

        this.messageErreur =
          error.error?.message ||
          'Impossible d’annuler cette réservation.';

        this.annulationEnCours = null;
      }
    });
  }

  // Date locale au format YYYY-MM-DD
  private getDateAujourdhui(): string {
    const maintenant = new Date();
    const annee = maintenant.getFullYear();
    const mois = String(maintenant.getMonth() + 1).padStart(2, '0');
    const jour = String(maintenant.getDate()).padStart(2, '0');

    return `${annee}-${mois}-${jour}`;
  }

  // Nom complet du client
  get nomComplet(): string {
    return (
      `${this.utilisateur?.prenom || ''} ${this.utilisateur?.nom || ''}`
    ).trim() || 'Client';
  }

  // Déconnexion
  deconnexion(): void {
    localStorage.removeItem('utilisateur');
    this.router.navigate(['/accueil']);
  }
}
