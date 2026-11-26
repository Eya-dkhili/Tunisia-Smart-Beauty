
package com.smartbeautyple.smartbeauty.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class ReservationDTO {

    private Long id;
    private String client;
    private String email;
    private String salon;
    private String prestation;
    private Double prix;
    private LocalDate dateReservation;
    private LocalTime heureReservation;
    private String statut;

    public ReservationDTO() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getClient() {
        return client;
    }

    public void setClient(String client) {
        this.client = client;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSalon() {
        return salon;
    }

    public void setSalon(String salon) {
        this.salon = salon;
    }

    public String getPrestation() {
        return prestation;
    }

    public void setPrestation(String prestation) {
        this.prestation = prestation;
    }

    public Double getPrix() {
        return prix;
    }

    public void setPrix(Double prix) {
        this.prix = prix;
    }

    public LocalDate getDateReservation() {
        return dateReservation;
    }

    public void setDateReservation(LocalDate dateReservation) {
        this.dateReservation = dateReservation;
    }

    public LocalTime getHeureReservation() {
        return heureReservation;
    }

    public void setHeureReservation(LocalTime heureReservation) {
        this.heureReservation = heureReservation;
    }

    public String getStatut() {
        return statut;
    }

    public void setStatut(String statut) {
        this.statut = statut;
    }
}
