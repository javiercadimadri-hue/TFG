package com.daw.proyecto.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "Planes")
public class Planes {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_plan;

    @Column(nullable = false, length = 50)
    private String nombre;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal precio;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(nullable = false)
    private Integer duracion;

    // Constructor vacío
    public Planes() {
    }

    // Constructor con todos los atributos
    public Planes(String nombre, BigDecimal precio, String descripcion, Integer duracion) {
        this.nombre = nombre;
        this.precio = precio;
        this.descripcion = descripcion;
        this.duracion = duracion;
    }

    // Getters and Setters
    public Integer getId_plan() {
        return id_plan;
    }

    public void setId_plan(Integer id_plan) {
        this.id_plan = id_plan;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public BigDecimal getPrecio() {
        return precio;
    }

    public void setPrecio(BigDecimal precio) {
        this.precio = precio;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Integer getDuracion() {
        return duracion;
    }

    public void setDuracion(Integer duracion) {
        this.duracion = duracion;
    }
}
