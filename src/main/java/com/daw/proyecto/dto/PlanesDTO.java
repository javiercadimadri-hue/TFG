package com.daw.proyecto.dto;

import java.math.BigDecimal;

public class PlanesDTO {

    private Integer id_plan;
    private String nombre;
    private BigDecimal precio;
    private String descripcion;
    private Integer duracion;

    // Constructor vacío
    public PlanesDTO() {
    }

    // Constructor con todos los atributos
    public PlanesDTO(Integer id_plan, String nombre, BigDecimal precio, String descripcion, Integer duracion) {
        this.id_plan = id_plan;
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
