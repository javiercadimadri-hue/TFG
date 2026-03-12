package com.daw.proyecto.entity;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "Suscripciones")
public class Suscripcion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_suscripcion;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "id_plan", nullable = false)
    private Planes plan;

    @ManyToOne
    @JoinColumn(name = "id_promocion")
    private Promociones promocion;


    @Column(name = "fecha_inicio", nullable = false)
    private Date fecha_inicio;


    @Column(name = "fecha_fin", nullable = false)
    private Date fecha_fin;

    @Column(length = 20)
    private String estado = "activa";

    // Constructor vacío
    public Suscripcion() {
    }

    // Constructor principal
    public Suscripcion(Usuario usuario, Planes plan, Promociones promocion, Date fecha_inicio, Date fecha_fin, String estado) {
        this.usuario = usuario;
        this.plan = plan;
        this.promocion = promocion;
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

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Planes getPlan() {
        return plan;
    }

    public void setPlan(Planes plan) {
        this.plan = plan;
    }

    public Promociones getPromocion() {
        return promocion;
    }

    public void setPromocion(Promociones promocion) {
        this.promocion = promocion;
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
