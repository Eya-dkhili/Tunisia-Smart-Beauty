
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = () => {

  const router = inject(Router);

  const utilisateurStocke = localStorage.getItem('utilisateur');

  // Vérifier la connexion
  if (!utilisateurStocke) {
    router.navigate(['/login']);
    return false;
  }

  try {
    const utilisateur = JSON.parse(utilisateurStocke);

    // Vérifier le rôle et le token
    if (
      utilisateur.role === 'ADMIN' &&
      utilisateur.token
    ) {
      return true;
    }

    // Refuser l'accès aux autres rôles
    router.navigate(['/accueil']);
    return false;

  } catch {
    localStorage.removeItem('utilisateur');
    router.navigate(['/login']);
    return false;
  }
};
