
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReservationProfessionnel {
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
export class ProfessionnelReservationService {

  private apiUrl =
    'http://localhost:8081/api/professionnel/reservations';

  constructor(private http: HttpClient) {}

  // RECUPERER LE JWT
  private getHeaders(): HttpHeaders {

    try {
      const utilisateur = JSON.parse(
        localStorage.getItem('utilisateur') || '{}'
      );

      const token = utilisateur?.token;

      return token
        ? new HttpHeaders({
            Authorization: `Bearer ${token}`
          })
        : new HttpHeaders();

    } catch {
      return new HttpHeaders();
    }
  }

  // AFFICHER LES RESERVATIONS DU PROFESSIONNEL
  getMesReservations(): Observable<ReservationProfessionnel[]> {

    return this.http.get<ReservationProfessionnel[]>(
      this.apiUrl,
      { headers: this.getHeaders() }
    );
  }

  // CONFIRMER OU REFUSER UNE RESERVATION
  traiterReservation(
    id: number,
    nouveauStatut: 'CONFIRMEE' | 'REFUSEE'
  ): Observable<ReservationProfessionnel> {

    return this.http.put<ReservationProfessionnel>(
      `${this.apiUrl}/${id}/statut`,
      JSON.stringify(nouveauStatut),
      {
        headers: this.getHeaders().set(
          'Content-Type',
          'application/json'
        )
      }
    );
  }

}
