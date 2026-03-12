package com.daw.proyecto.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "Pedidos")
public class Pedidos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_pedido;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @Column(nullable = false)
    private Date fecha;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal total;

    @Column(length = 20)
    private String estado = "pendiente";

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Detalle_pedidos> detalles = new ArrayList<>();

    // Constructor vacío
    public Pedidos() {
    }

    // Constructor con todos los atributos
    public Pedidos(Usuario usuario, Date fecha, BigDecimal total, String estado) {
        this.usuario = usuario;
        this.fecha = fecha;
        this.total = total;
        this.estado = estado;
        this.detalles = new ArrayList<>();
    }

    // Getters and Setters
    public Integer getId_pedido() {
        return id_pedido;
    }

    public void setId_pedido(Integer id_pedido) {
        this.id_pedido = id_pedido;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Date getFecha() {
        return fecha;
    }

    public void setFecha(Date fecha) {
        this.fecha = fecha;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public List<Detalle_pedidos> getDetalles() {
        return detalles;
    }

    public void setDetalles(List<Detalle_pedidos> detalles) {
        this.detalles = detalles;
    }
}
