
package com.smartbeautyple.smartbeauty.controller;

import com.smartbeautyple.smartbeauty.dto.RegisterRequest;
import com.smartbeautyple.smartbeauty.dto.LoginRequest;
import com.smartbeautyple.smartbeauty.entity.Utilisateur;
import com.smartbeautyple.smartbeauty.service.AuthService;
import com.smartbeautyple.smartbeauty.security.JwtService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;

    public AuthController(AuthService authService,
                          JwtService jwtService) {
        this.authService = authService;
        this.jwtService = jwtService;
    }

    // INSCRIPTION
    @PostMapping("/inscription")
    public ResponseEntity<?> inscrire(
            @Valid @RequestBody RegisterRequest request) {

        Utilisateur nouveauUtilisateur =
                authService.inscrire(request);

        return ResponseEntity.ok(Map.of(
            "message", "Inscription réussie !",
            "id", nouveauUtilisateur.getId(),
            "prenom", nouveauUtilisateur.getPrenom(),
            "email", nouveauUtilisateur.getEmail(),
            "role", nouveauUtilisateur.getRole()
        ));
    }

    // CONNEXION
    @PostMapping("/connexion")
    public ResponseEntity<?> connecter(
            @Valid @RequestBody LoginRequest request) {

        Utilisateur utilisateur = authService.connecter(
            request.getEmail(),
            request.getMotDePasse()
        );

        String token = jwtService.generateToken(
            utilisateur.getEmail(),
            utilisateur.getRole()
        );

        return ResponseEntity.ok(Map.of(
            "message", "Connexion réussie !",
            "id", utilisateur.getId(),
            "prenom", utilisateur.getPrenom(),
            "nom", utilisateur.getNom(),
            "email", utilisateur.getEmail(),
            "role", utilisateur.getRole(),
            "token", token
        ));
    }
}
