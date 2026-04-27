package com.daw.proyecto.dto;

import java.math.BigDecimal;

public class Detalle_pedidosDTO {
    private Integer id_detalle;
    private Integer id_pedido;
    private Integer id_producto;
    private Integer cantidad;
    private BigDecimal precio_unitario;
    
    // --- NUEVOS CAMPOS ---
    private String nombreProducto;
    private String imagenProducto;

    public Detalle_pedidosDTO() {}

    // Constructor actualizado
    public Detalle_pedidosDTO(Integer id_detalle, Integer id_pedido, Integer id_producto, 
                             Integer cantidad, BigDecimal precio_unitario, 
                             String nombreProducto, String imagenProducto) {
        this.id_detalle = id_detalle;
        this.id_pedido = id_pedido;
        this.id_producto = id_producto;
        this.cantidad = cantidad;
        this.precio_unitario = precio_unitario;
        this.nombreProducto = nombreProducto;
        this.imagenProducto = imagenProducto;
    }

    // Getters y Setters
    public Integer getId_detalle() { return id_detalle; }
    public void setId_detalle(Integer id_detalle) { this.id_detalle = id_detalle; }
    public Integer getId_pedido() { return id_pedido; }
    public void setId_pedido(Integer id_pedido) { this.id_pedido = id_pedido; }
    public Integer getId_producto() { return id_producto; }
    public void setId_producto(Integer id_producto) { this.id_producto = id_producto; }
    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
    public BigDecimal getPrecio_unitario() { return precio_unitario; }
    public void setPrecio_unitario(BigDecimal precio_unitario) { this.precio_unitario = precio_unitario; }
    public String getNombreProducto() { return nombreProducto; }
    public void setNombreProducto(String nombreProducto) { this.nombreProducto = nombreProducto; }
    public String getImagenProducto() { return imagenProducto; }
    public void setImagenProducto(String imagenProducto) { this.imagenProducto = imagenProducto; }
}