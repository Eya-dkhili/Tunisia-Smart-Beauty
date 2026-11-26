
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const professionnelGuard: CanActivateFn = () => {

  const router = inject(Router);

  try {

    const utilisateur = JSON.parse(
      localStorage.getItem('utilisateur') || 'null'
    );

    if (
      utilisateur?.role === 'PROFESSIONNEL' &&
      utilisateur?.token
    ) {
      return true;
    }

    router.navigate(['/accueil']);
    return false;

  } catch {

    localStorage.removeItem('utilisateur');
    router.navigate(['/login']);
    return false;

  }
};
