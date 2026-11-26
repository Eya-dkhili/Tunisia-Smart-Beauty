
package com.smartbeautyple.smartbeauty.repository;

import com.smartbeautyple.smartbeauty.entity.Reservation;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface ReservationRepository
        extends JpaRepository<Reservation, Long> {

    
    List<Reservation> findByUtilisateurEmail(String email);


    List<Reservation> findBySalon_Utilisateur_Email(String email);

    
    boolean existsBySalonIdAndDateReservationAndHeureReservationAndStatutIn(
            Long salonId,
            LocalDate dateReservation,
            LocalTime heureReservation,
            List<String> statuts
    );

    
    boolean existsBySalon_Id(Long salonId);

   
    boolean existsByPrestation_Salon_Id(Long salonId);

    
    boolean existsByPrestation_Id(Long prestationId);

}
