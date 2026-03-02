package com.daw.proyecto.service;

import com.daw.proyecto.dto.CarritoDTO;
import com.daw.proyecto.entity.Carrito;
import com.daw.proyecto.entity.Usuario;
import com.daw.proyecto.repository.CarritoRepository;
import com.daw.proyecto.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class CarritoService {
    
    @Autowired
    private CarritoRepository carritoRepository;
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    /**
     * Obtiene o crea el carrito de un usuario
     */
    public Carrito obtenerOCrearCarrito(Integer usuarioId) {
        Optional<Usuario> usuario = usuarioRepository.findById(usuarioId);
        
        if (!usuario.isPresent()) {
            throw new RuntimeException("Usuario no encontrado");
        }
        
        Usuario u = usuario.get();
        Optional<Carrito> carrito = carritoRepository.findByUsuario(u);
        
        if (carrito.isPresent()) {
            return carrito.get();
        }
        
        // Crear nuevo carrito
        Carrito nuevoCarrito = new Carrito(u);
        return carritoRepository.save(nuevoCarrito);
    }
    
    /**
     * Obtiene el carrito de un usuario
     */
    public CarritoDTO obtenerCarrito(Integer usuarioId) {
        Carrito carrito = obtenerOCrearCarrito(usuarioId);
        return convertirADTO(carrito);
    }
    
    /**
     * Actualiza el carrito de un usuario
     */
    public CarritoDTO actualizarCarrito(Integer usuarioId, String contenido, Integer cantidadItems, Double total) {
        Carrito carrito = obtenerOCrearCarrito(usuarioId);
        carrito.setContenido(contenido);
        carrito.setCantidadItems(cantidadItems);
        carrito.setTotal(total);
        
        Carrito actualizado = carritoRepository.save(carrito);
        return convertirADTO(actualizado);
    }
    
    /**
     * Vacía el carrito de un usuario
     */
    public CarritoDTO vaciarCarrito(Integer usuarioId) {
        Carrito carrito = obtenerOCrearCarrito(usuarioId);
        carrito.setContenido("[]");
        carrito.setCantidadItems(0);
        carrito.setTotal(0.0);
        
        Carrito actualizado = carritoRepository.save(carrito);
        return convertirADTO(actualizado);
    }
    
    /**
     * Convierte entidad Carrito a DTO
     */
    private CarritoDTO convertirADTO(Carrito carrito) {
        return new CarritoDTO(
            carrito.getId(),
            carrito.getUsuario().getId_usuario().longValue(),
            carrito.getContenido(),
            carrito.getCantidadItems(),
            carrito.getTotal()
        );
    }
}
