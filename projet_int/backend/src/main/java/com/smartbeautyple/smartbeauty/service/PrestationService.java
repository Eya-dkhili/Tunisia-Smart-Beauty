
package com.smartbeautyple.smartbeauty.service;

import com.smartbeautyple.smartbeauty.entity.Prestation;
import com.smartbeautyple.smartbeauty.entity.Salon;
import com.smartbeautyple.smartbeauty.repository.PrestationRepository;
import com.smartbeautyple.smartbeauty.repository.SalonRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PrestationService {

    private final PrestationRepository prestationRepository;
    private final SalonRepository salonRepository;

    public PrestationService(
            PrestationRepository prestationRepository,
            SalonRepository salonRepository) {

        this.prestationRepository = prestationRepository;
        this.salonRepository = salonRepository;
    }

    // Afficher les prestations d'un salon
    public List<Prestation> afficherPrestations(Long salonId) {

        if (!salonRepository.existsById(salonId)) {
            throw new RuntimeException("Salon introuvable");
        }

        return prestationRepository.findBySalonId(salonId);
    }

    // Ajouter une prestation à un salon
    public Prestation ajouterPrestation(Long salonId, Prestation prestation) {

        Salon salon = salonRepository.findById(salonId)
                .orElseThrow(() -> new RuntimeException("Salon introuvable"));

        prestation.setSalon(salon);

        return prestationRepository.save(prestation);
    }

    // Supprimer une prestation
    public void supprimerPrestation(Long id) {

        if (!prestationRepository.existsById(id)) {
            throw new RuntimeException("Prestation introuvable");
        }

        prestationRepository.deleteById(id);
    }
}
