import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8081/api/auth';

  constructor(private http: HttpClient) {}

  // Connexion
  connecter(email: string, motDePasse: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/connexion`,
      {
        email: email,
        motDePasse: motDePasse
      }
    );
  }

  // Inscription
  inscrire(data: {
  prenom: string;
  nom: string;
  email: string;
  telephone?: string;
  motDePasse: string;
  role: string;
}): Observable<any> {
  return this.http.post<any>(
    `${this.apiUrl}/inscription`,
    data
  );
}

}
