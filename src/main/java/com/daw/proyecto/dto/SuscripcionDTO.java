package com.daw.proyecto.dto;

import java.util.Date;

public class SuscripcionDTO {

    private Integer id_suscripcion;
    private Integer id_usuario;
    private Integer id_plan;
    private Integer id_promocion;
    private Date fecha_inicio;
    private Date fecha_fin;
    private String estado;

    // Constructor vacío
    public SuscripcionDTO() {
    }

    // Constructor con todos los atributos
    public SuscripcionDTO(Integer id_suscripcion, Integer id_usuario, Integer id_plan, Integer id_promocion, Date fecha_inicio, Date fecha_fin, String estado) {
        this.id_suscripcion = id_suscripcion;
        this.id_usuario = id_usuario;
        this.id_plan = id_plan;
        this.id_promocion = id_promocion;
        this.fecha_inicio = fecha_inicio;
        this.fecha_fin = fecha_fin;
        this.estado = estado;
    }

    // Getters and Setters
    public Integer getId_suscripcion() {
        return id_suscripcion;
    }

    public void setId_suscripcion(Integer id_suscripcion) {
        this.id_suscripcion = id_suscripcion;
    }

    public Integer getId_usuario() {
        return id_usuario;
    }

    public void setId_usuario(Integer id_usuario) {
        this.id_usuario = id_usuario;
    }

    public Integer getId_plan() {
        return id_plan;
    }

    public void setId_plan(Integer id_plan) {
        this.id_plan = id_plan;
    }

    public Integer getId_promocion() {
        return id_promocion;
    }

    public void setId_promocion(Integer id_promocion) {
        this.id_promocion = id_promocion;
    }

    public Date getFecha_inicio() {
        return fecha_inicio;
    }

    public void setFecha_inicio(Date fecha_inicio) {
        this.fecha_inicio = fecha_inicio;
    }

    public Date getFecha_fin() {
        return fecha_fin;
    }

    public void setFecha_fin(Date fecha_fin) {
        this.fecha_fin = fecha_fin;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }
}
