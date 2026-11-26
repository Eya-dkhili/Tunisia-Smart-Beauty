
package com.smartbeautyple.smartbeauty.repository;

import com.smartbeautyple.smartbeauty.entity.Salon;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SalonRepository extends JpaRepository<Salon, Long> {

    
    List<Salon> findByUtilisateur_Email(String email);


    Optional<Salon> findByIdAndUtilisateur_Email(
            Long id,
            String email
    );
}
