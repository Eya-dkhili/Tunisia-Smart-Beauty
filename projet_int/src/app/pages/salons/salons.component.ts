import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SalonService } from '../../services/salon.service';

@Component({
  selector: 'app-salons',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './salons.component.html',
  styleUrl: './salons.component.css'
})
export class SalonsComponent implements OnInit {

  recherche = '';
  ville = '';

  salons: any[] = [];

  constructor(private salonService: SalonService) {}

  ngOnInit(): void {
    this.salonService.afficherSalons().subscribe({
      next: (data) => {
        this.salons = data;
        console.log('Salons récupérés :', data);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des salons :', err);
      }
    });
  }

  get salonsFiltres() {
    return this.salons.filter(salon =>
      salon.nom.toLowerCase().includes(this.recherche.toLowerCase()) &&
      (this.ville === '' || salon.ville === this.ville)
    );
  }
}
