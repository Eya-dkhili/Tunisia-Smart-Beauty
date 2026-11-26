
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalonService {

  private apiUrl = 'http://localhost:8081/api/salons';

  private professionnelApiUrl =
    'http://localhost:8081/api/professionnel/salons';

  private prestationApiUrl =
    'http://localhost:8081/api/prestations';

  constructor(private http: HttpClient) {}

  // RECUPERER LE TOKEN JWT
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

  // AFFICHER TOUS LES SALONS
  afficherSalons(): Observable<any[]> {

    return this.http.get<any[]>(this.apiUrl);
  }

  // AJOUTER UN SALON
  ajouterSalon(
    salon: any,
    utilisateurId: number
  ): Observable<any> {

    return this.http.post<any>(
      `${this.apiUrl}/ajouter/${utilisateurId}`,
      salon,
      { headers: this.getHeaders() }
    );
  }

  // AFFICHER LES SALONS DU PROFESSIONNEL CONNECTE
  afficherMesSalons(): Observable<any[]> {

    return this.http.get<any[]>(
      this.professionnelApiUrl,
      { headers: this.getHeaders() }
    );
  }

  // MODIFIER UN SALON
  modifierSalon(
    id: number,
    salon: any
  ): Observable<any> {

    return this.http.put<any>(
      `${this.professionnelApiUrl}/${id}`,
      salon,
      { headers: this.getHeaders() }
    );
  }

  // AFFICHER LES PRESTATIONS D'UN SALON
  afficherPrestations(salonId: number): Observable<any[]> {

    return this.http.get<any[]>(
      `${this.prestationApiUrl}/salon/${salonId}`,
      { headers: this.getHeaders() }
    );
  }

  // AJOUTER UNE PRESTATION
  ajouterPrestation(
    salonId: number,
    prestation: any
  ): Observable<any> {

    return this.http.post<any>(
      `${this.prestationApiUrl}/ajouter/${salonId}`,
      prestation,
      { headers: this.getHeaders() }
    );
  }

  // SUPPRIMER UNE PRESTATION
  supprimerPrestation(id: number): Observable<any> {

    return this.http.delete<any>(
      `${this.prestationApiUrl}/${id}`,
      { headers: this.getHeaders() }
    );
  }

}
