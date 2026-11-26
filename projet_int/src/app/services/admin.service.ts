import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Utilisateur {
  id: number;
  prenom: string;
  nom: string;
  email: string;
  telephone: string | null;
  role: string;
}

export interface Salon {
  id: number;
  nom: string;
  ville: string;
  adresse: string;
  note: number;
  service: string;
  emoji: string | null;
  image: string;
  professionnelId: number;
  professionnel: string;
  nombrePrestations: number;
}

export interface Reservation {
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

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private apiUrl = 'http://localhost:8081/api/admin';

  constructor(private http: HttpClient) {}

  // Récupérer le JWT de l'utilisateur connecté
  private getHeaders(): HttpHeaders {
    let token: string | null = null;

    const utilisateur = localStorage.getItem('utilisateur');

    if (utilisateur) {
      try {
        token = JSON.parse(utilisateur)?.token ?? null;
      } catch {
        token = null;
      }
    }

    return token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : new HttpHeaders();
  }

  // UTILISATEURS
  getAllUtilisateurs(): Observable<Utilisateur[]> {
    return this.http.get<Utilisateur[]>(
      `${this.apiUrl}/utilisateurs`,
      { headers: this.getHeaders() }
    );
  }

  supprimerUtilisateur(id: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/utilisateurs/${id}`,
      { headers: this.getHeaders() }
    );
  }

  // SALONS
  getAllSalons(): Observable<Salon[]> {
    return this.http.get<Salon[]>(
      `${this.apiUrl}/salons`,
      { headers: this.getHeaders() }
    );
  }

  supprimerSalon(id: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/salons/${id}`,
      { headers: this.getHeaders() }
    );
  }

  // RESERVATIONS
  getAllReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(
      `${this.apiUrl}/reservations`,
      { headers: this.getHeaders() }
    );
  }

  getReservationById(id: number): Observable<Reservation> {
    return this.http.get<Reservation>(
      `${this.apiUrl}/reservations/${id}`,
      { headers: this.getHeaders() }
    );
  }
}