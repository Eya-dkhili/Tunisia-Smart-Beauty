
package com.smartbeautyple.smartbeauty.service;

import com.smartbeautyple.smartbeauty.dto.RegisterRequest;
import com.smartbeautyple.smartbeauty.entity.Utilisateur;
import com.smartbeautyple.smartbeauty.repository.UtilisateurRepository;

import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
public class AuthService {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UtilisateurRepository utilisateurRepository,
                       PasswordEncoder passwordEncoder) {

        this.utilisateurRepository = utilisateurRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // INSCRIPTION
    public Utilisateur inscrire(RegisterRequest request) {

        String email = request.getEmail().trim().toLowerCase();

        if (utilisateurRepository.existsByEmail(email)) {
            throw new RuntimeException(
                "Cette adresse email existe déjà !"
            );
        }

        Utilisateur utilisateur = new Utilisateur();

        utilisateur.setPrenom(request.getPrenom().trim());
        utilisateur.setNom(request.getNom().trim());
        utilisateur.setEmail(email);
        utilisateur.setTelephone(request.getTelephone());

        utilisateur.setMotDePasse(
            passwordEncoder.encode(request.getMotDePasse())
        );

        String role = request.getRole();

        if (role == null || role.trim().isEmpty()) {
            role = "CLIENT";
        }

        role = role.trim().toUpperCase();

        if (!role.equals("CLIENT") && !role.equals("PROFESSIONNEL")) {
            throw new RuntimeException("Type de compte invalide !");
        }

        utilisateur.setRole(role);

        return utilisateurRepository.save(utilisateur);
    }

    // CONNEXION
    public Utilisateur connecter(String email, String motDePasse) {

        String emailNormalise = email.trim().toLowerCase();

        Utilisateur utilisateur = utilisateurRepository
            .findByEmail(emailNormalise)
            .orElseThrow(() ->
                new RuntimeException(
                    "Email incorrect"
                )
            );

        if (!passwordEncoder.matches(
                motDePasse,
                utilisateur.getMotDePasse())) {

            throw new RuntimeException(
                "mot de passe incorrect"
            );
        }

        return utilisateur;
    }
}
