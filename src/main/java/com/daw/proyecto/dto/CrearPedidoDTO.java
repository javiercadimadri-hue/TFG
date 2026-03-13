package com.daw.proyecto.dto;

import java.util.List;

/**
 * DTO para crear un pedido con todos sus detalles
 */
public class CrearPedidoDTO {
    
    private Integer id_usuario;
    private List<ItemCarritoDTO> items;
    private Double total;
    
    // Constructores
    public CrearPedidoDTO() {}
    
    public CrearPedidoDTO(Integer id_usuario, List<ItemCarritoDTO> items, Double total) {
        this.id_usuario = id_usuario;
        this.items = items;
        this.total = total;
    }
    
    // Getters y Setters
    public Integer getId_usuario() {
        return id_usuario;
    }
    
    public void setId_usuario(Integer id_usuario) {
        this.id_usuario = id_usuario;
    }
    
    public List<ItemCarritoDTO> getItems() {
        return items;
    }
    
    public void setItems(List<ItemCarritoDTO> items) {
        this.items = items;
    }
    
    public Double getTotal() {
        return total;
    }
    
    public void setTotal(Double total) {
        this.total = total;
    }
    
    /**
     * DTO para un item del carrito
     */
    public static class ItemCarritoDTO {
        private Integer id;
        private String nombre;
        private Double precio;
        private Integer cantidad;
        private Boolean esPlan;
        
        public ItemCarritoDTO() {}
        
        public ItemCarritoDTO(Integer id, String nombre, Double precio, Integer cantidad, Boolean esPlan) {
            this.id = id;
            this.nombre = nombre;
            this.precio = precio;
            this.cantidad = cantidad;
            this.esPlan = esPlan;
        }
        
        public Integer getId() {
            return id;
        }
        
        public void setId(Integer id) {
            this.id = id;
        }
        
        public String getNombre() {
            return nombre;
        }
        
        public void setNombre(String nombre) {
            this.nombre = nombre;
        }
        
        public Double getPrecio() {
            return precio;
        }
        
        public void setPrecio(Double precio) {
            this.precio = precio;
        }
        
        public Integer getCantidad() {
            return cantidad;
        }
        
        public void setCantidad(Integer cantidad) {
            this.cantidad = cantidad;
        }
        
        public Boolean getEsPlan() {
            return esPlan;
        }
        
        public void setEsPlan(Boolean esPlan) {
            this.esPlan = esPlan;
        }
    }
}
