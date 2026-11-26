
package com.smartbeautyple.smartbeauty.controller;

import com.smartbeautyple.smartbeauty.entity.Prestation;
import com.smartbeautyple.smartbeauty.service.PrestationService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prestations")
@CrossOrigin(origins = "http://localhost:4200")
public class PrestationController {

    private final PrestationService prestationService;

    public PrestationController(PrestationService prestationService) {
        this.prestationService = prestationService;
    }

    // Afficher les prestations d'un salon
    @GetMapping("/salon/{salonId}")
    public List<Prestation> afficherPrestations(
            @PathVariable Long salonId) {

        return prestationService.afficherPrestations(salonId);
    }

    // Ajouter une prestation
    @PostMapping("/ajouter/{salonId}")
    public Prestation ajouterPrestation(
            @PathVariable Long salonId,
            @RequestBody Prestation prestation) {

        return prestationService.ajouterPrestation(salonId, prestation);
    }

    // Supprimer une prestation
    @DeleteMapping("/{id}")
    public void supprimerPrestation(@PathVariable Long id) {
        prestationService.supprimerPrestation(id);
    }
}
