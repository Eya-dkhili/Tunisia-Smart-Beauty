
package com.smartbeautyple.smartbeauty.controller;

import com.smartbeautyple.smartbeauty.dto.ReservationDTO;
import com.smartbeautyple.smartbeauty.dto.ReservationRequest;
import com.smartbeautyple.smartbeauty.service.ReservationService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/client/reservations")
@CrossOrigin(origins = "http://localhost:4200")
public class ClientReservationController {

    private final ReservationService reservationService;

    public ClientReservationController(
            ReservationService reservationService) {

        this.reservationService = reservationService;
    }

    
    @PostMapping
    public ResponseEntity<ReservationDTO> ajouterReservation(
            @RequestBody ReservationRequest request,
            Authentication authentication) {

        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }

        String email = authentication.getName();

        ReservationDTO reservation =
                reservationService.ajouterReservation(request, email);

        return ResponseEntity.status(201).body(reservation);
    }


    @GetMapping
    public ResponseEntity<List<ReservationDTO>> getMesReservations(
            Authentication authentication) {

        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }

        String email = authentication.getName();

        return ResponseEntity.ok(
                reservationService.getMesReservations(email)
        );
    }

    
    @PutMapping("/{id}/annuler")
    public ResponseEntity<ReservationDTO> annulerReservation(
            @PathVariable Long id,
            Authentication authentication) {

        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }

        String email = authentication.getName();

        return ResponseEntity.ok(
                reservationService.annulerReservation(id, email)
        );
    }
}
