package com.daw.proyecto.dto;

import java.math.BigDecimal;
import java.util.Date;

public class PedidosDTO {

    private Integer id_pedido;
    private Integer id_usuario;
    private Date fecha;
    private BigDecimal total;
    private String estado;

    // Constructor vacío
    public PedidosDTO() {
    }

    // Constructor con todos los atributos
    public PedidosDTO(Integer id_pedido, Integer id_usuario, Date fecha, BigDecimal total, String estado) {
        this.id_pedido = id_pedido;
        this.id_usuario = id_usuario;
        this.fecha = fecha;
        this.total = total;
        this.estado = estado;
    }

    // Getters and Setters
    public Integer getId_pedido() {
        return id_pedido;
    }

    public void setId_pedido(Integer id_pedido) {
        this.id_pedido = id_pedido;
    }

    public Integer getId_usuario() {
        return id_usuario;
    }

    public void setId_usuario(Integer id_usuario) {
        this.id_usuario = id_usuario;
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
}
