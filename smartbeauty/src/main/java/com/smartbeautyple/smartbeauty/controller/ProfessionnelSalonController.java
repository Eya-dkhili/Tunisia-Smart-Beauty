
package com.smartbeautyple.smartbeauty.controller;

import com.smartbeautyple.smartbeauty.entity.Salon;
import com.smartbeautyple.smartbeauty.dto.ModifierSalonRequest;
import com.smartbeautyple.smartbeauty.service.SalonService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/professionnel/salons")
@CrossOrigin(origins = "http://localhost:4200")
public class ProfessionnelSalonController {

    private final SalonService salonService;

    public ProfessionnelSalonController(SalonService salonService) {
        this.salonService = salonService;
    }

    
    @GetMapping
    public ResponseEntity<List<Salon>> getMesSalons(
            Authentication authentication) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                salonService.getMesSalons(email)
        );
    }

    
    @PutMapping("/{id}")
    public ResponseEntity<Salon> modifierSalon(
            @PathVariable Long id,
            @RequestBody ModifierSalonRequest request,
            Authentication authentication) {

        String email = authentication.getName();

        Salon salon = salonService.modifierSalon(
                id,
                email,
                request
        );

        return ResponseEntity.ok(salon);
    }
}
