package com.smartbeautyple.smartbeauty.controller;

import com.smartbeautyple.smartbeauty.entity.Salon;
import com.smartbeautyple.smartbeauty.repository.SalonRepository;
import com.smartbeautyple.smartbeauty.repository.ReservationRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/salons")
@CrossOrigin(origins = "http://localhost:4200")
public class AdminSalonController {

    private final SalonRepository salonRepository;
    private final ReservationRepository reservationRepository;

    public AdminSalonController(
            SalonRepository salonRepository,
            ReservationRepository reservationRepository) {

        this.salonRepository = salonRepository;
        this.reservationRepository = reservationRepository;
    }

    
    @GetMapping
    public List<Map<String, Object>> getAllSalons() {

        return salonRepository.findAll()
                .stream()
                .map(this::convertirEnResponse)
                .toList();
    }

    
    @GetMapping("/{id}")
    public Map<String, Object> getSalonById(
            @PathVariable Long id) {

        Salon salon = salonRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Salon introuvable"
                ));

        return convertirEnResponse(salon);
    }

    
    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> supprimerSalon(
            @PathVariable Long id) {

        Salon salon = salonRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Salon introuvable"
                ));


        boolean hasReservations =
                reservationRepository.existsBySalon_Id(id)
                || reservationRepository.existsByPrestation_Salon_Id(id);

       
        if (hasReservations) {

            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of(
                            "message",
                            "Impossible de supprimer ce salon car il possède des réservations. Les données historiques doivent être conservées."
                    ));
        }

      
        salonRepository.delete(salon);

        return ResponseEntity.ok(Map.of(
                "message", "Salon supprimé avec succès"
        ));
    }

    
    private Map<String, Object> convertirEnResponse(Salon salon) {

        Map<String, Object> response = new HashMap<>();

        response.put("id", salon.getId());
        response.put("nom", salon.getNom());
        response.put("ville", salon.getVille());
        response.put("adresse", salon.getAdresse());
        response.put("note", salon.getNote());
        response.put("service", salon.getService());
        response.put("emoji", salon.getEmoji());
        response.put("image", salon.getImage());

        if (salon.getUtilisateur() != null) {

            response.put(
                    "professionnelId",
                    salon.getUtilisateur().getId()
            );

            response.put(
                    "professionnel",
                    salon.getUtilisateur().getPrenom()
                    + " "
                    + salon.getUtilisateur().getNom()
            );
        }

        response.put(
                "nombrePrestations",
                salon.getPrestations().size()
        );

        return response;
    }
}
