package com.daw.proyecto.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.Date;

@Entity
@Table(name = "Promociones")
public class Promociones {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_promocion;

    @Column(nullable = false, unique = true, length = 20)
    private String codigo;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal descuento;

    @Column(name = "fecha_inicio")
    private Date fecha_inicio;

    @Column(name = "fecha_fin")
    private Date fecha_fin;

    // Constructor vacío
    public Promociones() {
    }

    // Constructor con todos los atributos
    public Promociones(String codigo, BigDecimal descuento, Date fecha_inicio, Date fecha_fin) {
        this.codigo = codigo;
        this.descuento = descuento;
        this.fecha_inicio = fecha_inicio;
        this.fecha_fin = fecha_fin;
    }

    // Getters and Setters
    public Integer getId_promocion() {
        return id_promocion;
    }

    public void setId_promocion(Integer id_promocion) {
        this.id_promocion = id_promocion;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public BigDecimal getDescuento() {
        return descuento;
    }

    public void setDescuento(BigDecimal descuento) {
        this.descuento = descuento;
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
}
