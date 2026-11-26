
package com.smartbeautyple.smartbeauty.controller;

import com.smartbeautyple.smartbeauty.entity.Salon;
import com.smartbeautyple.smartbeauty.service.SalonService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/salons")
@CrossOrigin(origins = "http://localhost:4200")
public class SalonController {

    private final SalonService salonService;

    public SalonController(SalonService salonService) {
        this.salonService = salonService;
    }

   
    @GetMapping
    public List<Salon> afficherSalons() {
        return salonService.afficherSalons();
    }

    
    @PostMapping("/ajouter/{utilisateurId}")
    public Salon ajouterSalon(
            @RequestBody Salon salon,
            @PathVariable Long utilisateurId) {

        return salonService.ajouterSalon(salon, utilisateurId);
    }
}
