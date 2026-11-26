package com.smartbeautyple.smartbeauty.controller;

import com.smartbeautyple.smartbeauty.dto.ReservationDTO;
import com.smartbeautyple.smartbeauty.service.ReservationService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/professionnel/reservations")
@CrossOrigin(origins = "http://localhost:4200")
public class ProfessionnelReservationController {

    private final ReservationService reservationService;

    public ProfessionnelReservationController(
            ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    
    @GetMapping
    public ResponseEntity<List<ReservationDTO>> getMesReservations(
            Authentication authentication) {

        String email = authentication.getName();

        return ResponseEntity.ok(
            reservationService.getReservationsProfessionnel(email)
        );
    }

@PutMapping("/{id}/statut")
public ResponseEntity<ReservationDTO> traiterReservation(
        @PathVariable Long id,
        @RequestBody String nouveauStatut,
        Authentication authentication) {

    String email = authentication.getName();

    ReservationDTO reservation =
            reservationService.traiterReservation(
                id, nouveauStatut, email
            );

    return ResponseEntity.ok(reservation);
}

}
