
package com.smartbeautyple.smartbeauty.controller;

import com.smartbeautyple.smartbeauty.entity.Prestation;
import com.smartbeautyple.smartbeauty.service.PrestationService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/prestations")
@CrossOrigin(origins = "http://localhost:4200")
public class PrestationController {

    private final PrestationService prestationService;

    public PrestationController(PrestationService prestationService) {
        this.prestationService = prestationService;
    }

    
    @GetMapping("/salon/{salonId}")
    public List<Prestation> afficherPrestations(
            @PathVariable Long salonId) {

        return prestationService.afficherPrestations(salonId);
    }

    
    @PostMapping("/ajouter/{salonId}")
    public Prestation ajouterPrestation(
            @PathVariable Long salonId,
            @RequestBody Prestation prestation,
            Authentication authentication) {

        String email = authentication.getName();

        return prestationService.ajouterPrestation(
                salonId,
                prestation,
                email
        );
    }

    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> supprimerPrestation(
            @PathVariable Long id,
            Authentication authentication) {

        String email = authentication.getName();

        prestationService.supprimerPrestation(id, email);

        return ResponseEntity.ok(Map.of(
                "message", "Prestation supprimée avec succès"
        ));
    }
}
