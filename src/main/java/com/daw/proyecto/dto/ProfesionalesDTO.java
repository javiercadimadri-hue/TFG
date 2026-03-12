package com.daw.proyecto.dto;

public class ProfesionalesDTO {

    private Integer id_profesional;
    private String nombre;
    private String especialidad;
    private String descripcion;
    private String imagen;

    // Constructor vacío
    public ProfesionalesDTO() {
    }

    // Constructor con todos los atributos
    public ProfesionalesDTO(Integer id_profesional, String nombre, String especialidad, String descripcion, String imagen) {
        this.id_profesional = id_profesional;
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
