package com.daw.proyecto.entity;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Convert;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.OneToOne;
import jakarta.persistence.CascadeType;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.util.Date;

@Entity
@Table(name = "Usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_usuario;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(name = "contrasena", nullable = false, length = 255)
    private String contraseña;

    @Column(length = 20)
    private String teléfono;

    @Column(name = "fecha_alta", nullable = false)
    private Date fecha_alta;

    @Column(name = "fecha_expiracion_plan")
    private Date fechaExpiracionPlan;

    @Column(name = "plan", length = 100)
    private String plan;

    // --- CAMBIO PRINCIPAL AQUÍ ---
    @Convert(converter = RolConverter.class)
    @Column(length = 20)
    private Rol rol;
    
    @Column(name = "foto_filename", length = 255)
    private String fotoFilename;

    @OneToOne(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private Carrito carrito;

    // Constructor vacío
    public Usuario() {
        
    }

    public Usuario(String nombre, String email, String contraseña, String teléfono, Date fecha_alta, Rol rol,
            String fotoFilename, Carrito carrito) {
        this.nombre = nombre;
        this.email = email;
        this.contraseña = contraseña;
        this.teléfono = teléfono;
        this.fecha_alta = fecha_alta;
        this.rol = rol;
        this.fotoFilename = fotoFilename;
        this.carrito = carrito;
    }

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

    public Date getFechaExpiracionPlan() {
        return fechaExpiracionPlan;
    }

    public void setFechaExpiracionPlan(Date fechaExpiracionPlan) {
        this.fechaExpiracionPlan = fechaExpiracionPlan;
    }

    public String getPlan() {
        return plan;
    }

    public void setPlan(String plan) {
        this.plan = plan;
    }

    public Rol getRol() {
        return rol;
    }

    public void setRol(Rol rol) {
        this.rol = rol;
    }

    public String getFotoFilename() {
        return fotoFilename;
    }

    public void setFotoFilename(String fotoFilename) {
        this.fotoFilename = fotoFilename;
    }

    public Carrito getCarrito() {
        return carrito;
    }

    public void setCarrito(Carrito carrito) {
        this.carrito = carrito;
    }

    
}
