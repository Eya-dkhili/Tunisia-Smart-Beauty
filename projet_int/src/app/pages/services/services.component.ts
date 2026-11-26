import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent {

  services = [
    {
      id: 1,
      nom: 'Coiffure',
      description: 'Sublimez votre style avec nos prestations de coiffure adaptées à vos envies.',
      prestations: ['Coupe & brushing', 'Coloration', 'Coiffure événementielle'],
      emoji: '💇‍♀️',
      prix: 'À partir de 25 DT',
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&q=85'
    },
    {
      id: 2,
      nom: 'Soins du visage',
      description: 'Offrez à votre peau un moment de douceur et de soin personnalisé.',
      prestations: ['Nettoyage du visage', 'Soin hydratant', 'Soin éclat'],
      emoji: '🧖‍♀️',
      prix: 'À partir de 40 DT',
      image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=85'
    },
    {
      id: 3,
      nom: 'Onglerie',
      description: 'Prenez soin de vos mains et de vos pieds avec une finition élégante.',
      prestations: ['Manucure', 'Pédicure', 'Pose de vernis'],
      emoji: '💅',
      prix: 'À partir de 20 DT',
      image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=900&q=85'
    },
    {
      id: 4,
      nom: 'Spa & Massage',
      description: 'Évadez-vous du quotidien avec une expérience de détente et de bien-être.',
      prestations: ['Massage relaxant', 'Hammam', 'Rituel bien-être'],
      emoji: '🌸',
      prix: 'À partir de 50 DT',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=900&q=85'
    }
  ];

}