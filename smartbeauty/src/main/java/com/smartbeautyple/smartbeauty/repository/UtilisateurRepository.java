package com.smartbeautyple.smartbeauty.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.smartbeautyple.smartbeauty.entity.Utilisateur;

import java.util.Optional;

public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {

    Optional<Utilisateur> findByEmail(String email);

    boolean existsByEmail(String email);
}