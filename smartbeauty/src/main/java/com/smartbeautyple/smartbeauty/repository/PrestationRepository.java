
package com.smartbeautyple.smartbeauty.repository;

import com.smartbeautyple.smartbeauty.entity.Prestation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PrestationRepository
        extends JpaRepository<Prestation, Long> {

    
    List<Prestation> findBySalonId(Long salonId);

    
    Optional<Prestation> findByIdAndSalon_Utilisateur_Email(
            Long id,
            String email
    );
    

}
