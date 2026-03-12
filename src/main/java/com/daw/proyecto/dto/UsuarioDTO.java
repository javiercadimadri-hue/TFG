package com.daw.proyecto.dto;

import java.util.Date;

public class UsuarioDTO {

    private Integer id_usuario;
    private String nombre;
    private String email;
    private String contraseña;
    private String teléfono;
    private Date fecha_alta;
    // Cambiado a String para evitar errores de binding desde formularios
    private String rol;
    private String foto;

    // Constructor vacío
    public UsuarioDTO() {
    }

    // Constructor con todos los atributos
    public UsuarioDTO(Integer id_usuario, String nombre, String email, String contraseña, String teléfono, Date fecha_alta, String rol) {
        this.id_usuario = id_usuario;
        this.nombre = nombre;
        this.email = email;
        this.contraseña = contraseña;
        this.teléfono = teléfono;
        this.fecha_alta = fecha_alta;
        this.rol = rol;
    }

    public UsuarioDTO(Integer id_usuario, String nombre, String email, String contraseña, String teléfono, Date fecha_alta, String rol, String foto) {
        this.id_usuario = id_usuario;
        this.nombre = nombre;
        this.email = email;
        this.contraseña = contraseña;
        this.teléfono = teléfono;
        this.fecha_alta = fecha_alta;
        this.rol = rol;
        this.foto = foto;
    }

    // Getters and Setters
    public Integer getId_usuario() {
        return id_usuario;
    }

    public void setId_usuario(Integer id_usuario) {
        this.id_usuario = id_usuario;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getContraseña() {
        return contraseña;
    }

    public void setContraseña(String contraseña) {
        this.contraseña = contraseña;
    }

    public String getTeléfono() {
        return teléfono;
    }

    public void setTeléfono(String teléfono) {
        this.teléfono = teléfono;
    }

    public Date getFecha_alta() {
        return fecha_alta;
    }

    public void setFecha_alta(Date fecha_alta) {
        this.fecha_alta = fecha_alta;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    public String getFoto() {
        return foto;
    }

    public void setFoto(String foto) {
        this.foto = foto;
    }
}
