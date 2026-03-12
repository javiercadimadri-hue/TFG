package com.daw.proyecto.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "Profesionales")
public class Profesionales {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_profesional;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(length = 100)
    private String especialidad;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(length = 255)
    private String imagen;

    // Constructor vacío
    public Profesionales() {
    }

    // Constructor con todos los atributos
    public Profesionales(String nombre, String especialidad, String descripcion, String imagen) {
        this.nombre = nombre;
        this.especialidad = especialidad;
        this.descripcion = descripcion;
        this.imagen = imagen;
    }

    // Getters and Setters
    public Integer getId_profesional() {
        return id_profesional;
    }

    public void setId_profesional(Integer id_profesional) {
        this.id_profesional = id_profesional;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getEspecialidad() {
        return especialidad;
    }

    public void setEspecialidad(String especialidad) {
        this.especialidad = especialidad;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getImagen() {
        return imagen;
    }

    public void setImagen(String imagen) {
        this.imagen = imagen;
    }
}
