
package com.smartbeautyple.smartbeauty.service;

import com.smartbeautyple.smartbeauty.entity.Salon;
import com.smartbeautyple.smartbeauty.entity.Utilisateur;
import com.smartbeautyple.smartbeauty.dto.ModifierSalonRequest;

import com.smartbeautyple.smartbeauty.repository.SalonRepository;
import com.smartbeautyple.smartbeauty.repository.UtilisateurRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

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

    
    public List<Salon> afficherSalons() {
        return salonRepository.findAll();
    }

   
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

    
    public List<Salon> getMesSalons(String email) {
        return salonRepository.findByUtilisateur_Email(email);
    }

   
    @Transactional
    public Salon modifierSalon(
            Long salonId,
            String email,
            ModifierSalonRequest request) {

        Salon salon = salonRepository
                .findByIdAndUtilisateur_Email(salonId, email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Salon introuvable ou accès non autorisé"
                ));

        
        if (request.getNom() != null) {
            salon.setNom(request.getNom());
        }

        if (request.getVille() != null) {
            salon.setVille(request.getVille());
        }

        if (request.getAdresse() != null) {
            salon.setAdresse(request.getAdresse());
        }

        if (request.getService() != null) {
            salon.setService(request.getService());
        }

        if (request.getEmoji() != null) {
            salon.setEmoji(request.getEmoji());
        }

        if (request.getImage() != null) {
            salon.setImage(request.getImage());
        }

      

        return salonRepository.save(salon);
    }
}
