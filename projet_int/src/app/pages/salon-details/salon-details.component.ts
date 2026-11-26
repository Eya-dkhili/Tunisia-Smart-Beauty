
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { SalonService } from '../../services/salon.service';

@Component({
  selector: 'app-salon-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './salon-details.component.html',
  styleUrl: './salon-details.component.css'
})
export class SalonDetailsComponent implements OnInit {

  salon: any = null;
  services: any[] = [];

  chargement = true;
  erreur = '';

  constructor(
    private route: ActivatedRoute,
    private salonService: SalonService
  ) {}

  ngOnInit(): void {

    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.salonService.afficherSalons().subscribe({
      next: (salons) => {

        this.salon = salons.find(s => s.id === id);

        if (!this.salon) {
          this.erreur = 'Salon introuvable';
          this.chargement = false;
          return;
        }

        this.salonService.afficherPrestations(id).subscribe({
          next: (prestations) => {
            this.services = prestations;
            this.chargement = false;
          },
          error: () => {
            this.erreur = 'Impossible de charger les prestations';
            this.chargement = false;
          }
        });

      },
      error: () => {
        this.erreur = 'Impossible de charger les salons';
        this.chargement = false;
      }
    });
  }
}
