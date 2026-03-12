package com.daw.proyecto.dto;

public class CarritoDTO {
    
    private Long id;
    private Long usuarioId;
    private String contenido; // JSON con los items
    private Integer cantidadItems;
    private Double total;
    
    // Constructores
    public CarritoDTO() {
    }
    
    public CarritoDTO(Long id, Long usuarioId, String contenido, Integer cantidadItems, Double total) {
        this.id = id;
        this.usuarioId = usuarioId;
        this.contenido = contenido;
        this.cantidadItems = cantidadItems;
        this.total = total;
    }
    
    // Getters y Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getUsuarioId() {
        return usuarioId;
    }
    
    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
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
