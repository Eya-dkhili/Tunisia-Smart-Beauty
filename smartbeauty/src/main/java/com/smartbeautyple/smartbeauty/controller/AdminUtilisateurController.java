
package com.smartbeautyple.smartbeauty.controller;

import com.smartbeautyple.smartbeauty.entity.Utilisateur;
import com.smartbeautyple.smartbeauty.repository.UtilisateurRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/utilisateurs")
@CrossOrigin(origins = "http://localhost:4200")
public class AdminUtilisateurController {

    private final UtilisateurRepository utilisateurRepository;

    public AdminUtilisateurController(
            UtilisateurRepository utilisateurRepository) {
        this.utilisateurRepository = utilisateurRepository;
    }

    
    private boolean estAdmin(Utilisateur utilisateur) {
        return utilisateur.getRole() != null
                && utilisateur.getRole().equalsIgnoreCase("ADMIN");
    }

   
    @GetMapping
    public List<Map<String, Object>> getAllUtilisateurs() {

        return utilisateurRepository.findAll()
                .stream()
                .filter(utilisateur -> !estAdmin(utilisateur))
                .map(this::convertirEnResponse)
                .toList();
    }

    
    @GetMapping("/{id}")
    public Map<String, Object> getUtilisateurById(
            @PathVariable Long id) {

        Utilisateur utilisateur = utilisateurRepository
                .findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Utilisateur introuvable"
                ));

        if (estAdmin(utilisateur)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Utilisateur introuvable"
            );
        }

        return convertirEnResponse(utilisateur);
    }

   
    @DeleteMapping("/{id}")
    public ResponseEntity<?> supprimerUtilisateur(
            @PathVariable Long id) {

        Utilisateur utilisateur = utilisateurRepository
                .findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Utilisateur introuvable"
                ));

        if (estAdmin(utilisateur)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "La suppression d'un compte administrateur est interdite."
            );
        }

        utilisateurRepository.delete(utilisateur);

        return ResponseEntity.ok(Map.of(
                "message", "Utilisateur supprimé avec succès"
        ));
    }

    
    private Map<String, Object> convertirEnResponse(
            Utilisateur utilisateur) {

        Map<String, Object> response = new HashMap<>();

        response.put("id", utilisateur.getId());
        response.put("prenom", utilisateur.getPrenom());
        response.put("nom", utilisateur.getNom());
        response.put("email", utilisateur.getEmail());
        response.put("telephone", utilisateur.getTelephone());
        response.put("role", utilisateur.getRole());

        return response;
    }
}
