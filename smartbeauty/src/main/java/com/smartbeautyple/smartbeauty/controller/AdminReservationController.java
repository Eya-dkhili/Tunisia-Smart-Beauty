
package com.smartbeautyple.smartbeauty.controller;

import com.smartbeautyple.smartbeauty.dto.ReservationDTO;
import com.smartbeautyple.smartbeauty.service.ReservationService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/reservations")
@CrossOrigin(origins = "http://localhost:4200")
public class AdminReservationController {

    private final ReservationService reservationService;

    public AdminReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    
    @GetMapping
    public ResponseEntity<List<ReservationDTO>> getAllReservations() {
        return ResponseEntity.ok(
                reservationService.getAllReservations()
        );
    }

    
    @GetMapping("/{id}")
    public ResponseEntity<ReservationDTO> getReservationById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                reservationService.getReservationById(id)
        );
    }
}
