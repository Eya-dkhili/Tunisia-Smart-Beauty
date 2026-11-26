
package com.smartbeautyple.smartbeauty.service;

import com.smartbeautyple.smartbeauty.entity.Prestation;
import com.smartbeautyple.smartbeauty.entity.Salon;

import com.smartbeautyple.smartbeauty.repository.PrestationRepository;
import com.smartbeautyple.smartbeauty.repository.SalonRepository;
import com.smartbeautyple.smartbeauty.repository.ReservationRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class PrestationService {

    private final PrestationRepository prestationRepository;
    private final SalonRepository salonRepository;
    private final ReservationRepository reservationRepository;

    public PrestationService(
            PrestationRepository prestationRepository,
            SalonRepository salonRepository,
            ReservationRepository reservationRepository) {

        this.prestationRepository = prestationRepository;
        this.salonRepository = salonRepository;
        this.reservationRepository = reservationRepository;
    }

    
    public List<Prestation> afficherPrestations(Long salonId) {

        if (!salonRepository.existsById(salonId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Salon introuvable"
            );
        }

        return prestationRepository.findBySalonId(salonId);
    }

    
    public Prestation ajouterPrestation(
            Long salonId,
            Prestation prestation,
            String email) {

        Salon salon = salonRepository
                .findByIdAndUtilisateur_Email(salonId, email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Salon introuvable ou accès non autorisé"
                ));

        prestation.setId(null);
        prestation.setSalon(salon);

        return prestationRepository.save(prestation);
    }

    
    @Transactional
    public void supprimerPrestation(Long id, String email) {

        Prestation prestation = prestationRepository
                .findByIdAndSalon_Utilisateur_Email(id, email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Prestation introuvable ou accès non autorisé"
                ));


        if (reservationRepository.existsByPrestation_Id(id)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Impossible de supprimer cette prestation car elle possède des réservations."
            );
        }

        prestationRepository.delete(prestation);
    }
}
