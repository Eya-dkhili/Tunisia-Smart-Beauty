
package com.smartbeautyple.smartbeauty.service;

import com.smartbeautyple.smartbeauty.entity.Salon;
import com.smartbeautyple.smartbeauty.entity.Utilisateur;
import com.smartbeautyple.smartbeauty.repository.SalonRepository;
import com.smartbeautyple.smartbeauty.repository.UtilisateurRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SalonService {

    private final SalonRepository salonRepository;
    private final UtilisateurRepository utilisateurRepository;

    public SalonService(
            SalonRepository salonRepository,
            UtilisateurRepository utilisateurRepository) {

        this.salonRepository = salonRepository;
        this.utilisateurRepository = utilisateurRepository;
    }

    // Afficher tous les salons
    public List<Salon> afficherSalons() {
        return salonRepository.findAll();
    }

    // Ajouter un salon
    public Salon ajouterSalon(Salon salon, Long utilisateurId) {

        Utilisateur utilisateur = utilisateurRepository.findById(utilisateurId)
                .orElseThrow(() ->
                        new RuntimeException("Utilisateur introuvable"));

        if (!"PROFESSIONNEL".equals(utilisateur.getRole())) {
            throw new RuntimeException(
                    "Seuls les professionnels peuvent ajouter un salon");
        }

        salon.setUtilisateur(utilisateur);

        return salonRepository.save(salon);
    }
}
