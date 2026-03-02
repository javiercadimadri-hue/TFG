package com.daw.proyecto.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "carritos")
public class Carrito {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "usuario_id", nullable = false, unique = true)
    @JsonBackReference
    private Usuario usuario;
    
    @Column(name = "contenido", columnDefinition = "TEXT")
    private String contenido; // JSON con los items del carrito
    
    @Column(name = "cantidad_items")
    private Integer cantidadItems = 0;
    
    @Column(name = "total")
    private Double total = 0.0;
    
    // Constructores
    public Carrito() {
    }
    
    public Carrito(Usuario usuario) {
        this.usuario = usuario;
        this.contenido = "[]";
        this.cantidadItems = 0;
        this.total = 0.0;
    }
    
    // Getters y Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Usuario getUsuario() {
        return usuario;
    }
    
    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
    
    public String getContenido() {
        return contenido;
    }
    
    public void setContenido(String contenido) {
        this.contenido = contenido;
    }
    
    public Integer getCantidadItems() {
        return cantidadItems;
    }
    
    public void setCantidadItems(Integer cantidadItems) {
        this.cantidadItems = cantidadItems;
    }
    
    public Double getTotal() {
        return total;
    }
    
    public void setTotal(Double total) {
        this.total = total;
    }
}
