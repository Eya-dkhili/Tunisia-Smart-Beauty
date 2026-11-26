
package com.smartbeautyple.smartbeauty.service;

import com.smartbeautyple.smartbeauty.entity.Reservation;
import com.smartbeautyple.smartbeauty.entity.Utilisateur;
import com.smartbeautyple.smartbeauty.entity.Salon;
import com.smartbeautyple.smartbeauty.entity.Prestation;
import com.smartbeautyple.smartbeauty.dto.ReservationDTO;
import com.smartbeautyple.smartbeauty.dto.ReservationRequest;
import com.smartbeautyple.smartbeauty.repository.ReservationRepository;
import com.smartbeautyple.smartbeauty.repository.UtilisateurRepository;
import com.smartbeautyple.smartbeauty.repository.SalonRepository;
import com.smartbeautyple.smartbeauty.repository.PrestationRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final SalonRepository salonRepository;
    private final PrestationRepository prestationRepository;

    public ReservationService(
            ReservationRepository reservationRepository,
            UtilisateurRepository utilisateurRepository,
            SalonRepository salonRepository,
            PrestationRepository prestationRepository) {

        this.reservationRepository = reservationRepository;
        this.utilisateurRepository = utilisateurRepository;
        this.salonRepository = salonRepository;
        this.prestationRepository = prestationRepository;
    }

    
    private String normaliserStatut(String statut) {
        if (statut == null) {
            throw new RuntimeException("Statut obligatoire");
        }

        return statut.replace("\"", "").trim().toUpperCase();
    }

    
    private ReservationDTO convertirEnDTO(Reservation reservation) {

        ReservationDTO dto = new ReservationDTO();

        dto.setId(reservation.getId());

        dto.setClient(
            reservation.getUtilisateur().getPrenom() + " " +
            reservation.getUtilisateur().getNom()
        );

        dto.setEmail(reservation.getUtilisateur().getEmail());
        dto.setSalon(reservation.getSalon().getNom());
        dto.setPrestation(reservation.getPrestation().getNom());
        dto.setPrix(reservation.getPrestation().getPrix());
        dto.setDateReservation(reservation.getDateReservation());
        dto.setHeureReservation(reservation.getHeureReservation());
        dto.setStatut(reservation.getStatut());

        return dto;
    }

    
    public List<ReservationDTO> getAllReservations() {

        return reservationRepository.findAll()
                .stream()
                .map(this::convertirEnDTO)
                .toList();
    }

   
    public ReservationDTO getReservationById(Long id) {

        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() ->
                    new RuntimeException("Réservation introuvable")
                );

        return convertirEnDTO(reservation);
    }

   
    public ReservationDTO ajouterReservation(
            ReservationRequest request, String email) {

        
        if (request == null) {
            throw new RuntimeException(
                "Les données de réservation sont obligatoires"
            );
        }

        
        if (request.getSalonId() == null) {
            throw new RuntimeException(
                "Veuillez sélectionner un salon"
            );
        }

        
        if (request.getPrestationId() == null) {
            throw new RuntimeException(
                "Veuillez sélectionner une prestation"
            );
        }

        
        if (request.getDateReservation() == null
                || request.getHeureReservation() == null) {

            throw new RuntimeException(
                "La date et l'heure sont obligatoires"
            );
        }

       
        if (request.getDateReservation().isBefore(
                java.time.LocalDate.now())) {

            throw new RuntimeException(
                "La date de réservation doit être dans le futur"
            );
        }

        
        if (request.getDateReservation().equals(
                java.time.LocalDate.now())
                && request.getHeureReservation().isBefore(
                    java.time.LocalTime.now())) {

            throw new RuntimeException(
                "L'heure de réservation doit être dans le futur"
            );
        }

       
        Utilisateur utilisateur = utilisateurRepository
                .findByEmail(email.trim().toLowerCase())
                .orElseThrow(() ->
                    new RuntimeException("Utilisateur introuvable")
                );

        
        if (!"CLIENT".equals(utilisateur.getRole())) {
            throw new RuntimeException(
                "Seuls les clients peuvent effectuer une réservation"
            );
        }

        
        Salon salon = salonRepository.findById(request.getSalonId())
                .orElseThrow(() ->
                    new RuntimeException("Salon introuvable")
                );

       
        Prestation prestation = prestationRepository
                .findById(request.getPrestationId())
                .orElseThrow(() ->
                    new RuntimeException("Prestation introuvable")
                );

       
        if (prestation.getSalon() == null
                || !prestation.getSalon().getId().equals(salon.getId())) {

            throw new RuntimeException(
                "Cette prestation n'appartient pas à ce salon"
            );
        }

        
        boolean dejaReservee = reservationRepository
                .existsBySalonIdAndDateReservationAndHeureReservationAndStatutIn(
                    salon.getId(),
                    request.getDateReservation(),
                    request.getHeureReservation(),
                    List.of("EN_ATTENTE", "CONFIRMEE")
                );

        if (dejaReservee) {
            throw new RuntimeException(
                "Ce créneau est déjà réservé pour ce salon"
            );
        }

        
        Reservation reservation = new Reservation();

        reservation.setUtilisateur(utilisateur);
        reservation.setSalon(salon);
        reservation.setPrestation(prestation);
        reservation.setDateReservation(request.getDateReservation());
        reservation.setHeureReservation(request.getHeureReservation());
        reservation.setStatut("EN_ATTENTE");

        Reservation nouvelleReservation =
                reservationRepository.save(reservation);

        return convertirEnDTO(nouvelleReservation);
    }

    
    public ReservationDTO modifierStatut(
            Long id, String nouveauStatut) {

        nouveauStatut = normaliserStatut(nouveauStatut);

        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() ->
                    new RuntimeException("Réservation introuvable")
                );

        if (!nouveauStatut.equals("EN_ATTENTE")
                && !nouveauStatut.equals("CONFIRMEE")
                && !nouveauStatut.equals("REFUSEE")
                && !nouveauStatut.equals("ANNULEE")) {

            throw new RuntimeException("Statut invalide !");
        }

        reservation.setStatut(nouveauStatut);

        return convertirEnDTO(
            reservationRepository.save(reservation)
        );
    }

    
    public void supprimerReservation(Long id) {

        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() ->
                    new RuntimeException("Réservation introuvable")
                );

        reservationRepository.delete(reservation);
    }

    
    public List<ReservationDTO> getMesReservations(String email) {

        return reservationRepository.findByUtilisateurEmail(email)
                .stream()
                .map(this::convertirEnDTO)
                .toList();
    }

    
    public ReservationDTO annulerReservation(Long id, String email) {

        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() ->
                    new RuntimeException("Réservation introuvable")
                );

        
        if (!reservation.getUtilisateur().getEmail()
                .equalsIgnoreCase(email)) {

            throw new RuntimeException(
                "Vous ne pouvez pas annuler cette réservation"
            );
        }

        
        if (!"EN_ATTENTE".equals(reservation.getStatut())
                && !"CONFIRMEE".equals(reservation.getStatut())) {

            throw new RuntimeException(
                "Cette réservation ne peut pas être annulée"
            );
        }

       
        if (reservation.getDateReservation().isBefore(
                java.time.LocalDate.now())) {

            throw new RuntimeException(
                "Impossible d'annuler un rendez-vous passé"
            );
        }

        if (reservation.getDateReservation().equals(
                java.time.LocalDate.now())
                && reservation.getHeureReservation().isBefore(
                    java.time.LocalTime.now())) {

            throw new RuntimeException(
                "Impossible d'annuler un rendez-vous passé"
            );
        }

        
        reservation.setStatut("ANNULEE");

        Reservation reservationModifiee =
                reservationRepository.save(reservation);

        return convertirEnDTO(reservationModifiee);
    }

    
    public List<ReservationDTO> getReservationsProfessionnel(String email) {

        return reservationRepository
                .findBySalon_Utilisateur_Email(email)
                .stream()
                .map(this::convertirEnDTO)
                .toList();
    }

    // Confirmer ou refuser une réservation par le professionnel
    public ReservationDTO traiterReservation(
            Long id, String nouveauStatut, String email) {

        
        nouveauStatut = normaliserStatut(nouveauStatut);

        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() ->
                    new RuntimeException("Réservation introuvable")
                );

        
        if (!reservation.getSalon().getUtilisateur()
                .getEmail().equalsIgnoreCase(email)) {

            throw new RuntimeException(
                "Vous ne pouvez pas modifier cette réservation"
            );
        }

        // Vérifier le statut demandé
        if (!"CONFIRMEE".equals(nouveauStatut)
                && !"REFUSEE".equals(nouveauStatut)) {

            throw new RuntimeException("Statut invalide !");
        }

        // Vérifier que la réservation est encore en attente
        if (!"EN_ATTENTE".equals(reservation.getStatut())) {

            throw new RuntimeException(
                "Cette réservation a déjà été traitée"
            );
        }

        
        reservation.setStatut(nouveauStatut);

        return convertirEnDTO(
            reservationRepository.save(reservation)
        );
    }
}
