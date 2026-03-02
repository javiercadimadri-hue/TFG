package com.daw.proyecto.controller;

import com.daw.proyecto.dto.CarritoDTO;
import com.daw.proyecto.service.CarritoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/carrito")
@CrossOrigin(origins = "*", maxAge = 3600)
public class CarritoController {
    
    @Autowired
    private CarritoService carritoService;
    
    /**
     * Obtiene el carrito del usuario autenticado
     */
    @GetMapping("/{usuarioId}")
    public ResponseEntity<?> obtenerCarrito(@PathVariable Integer usuarioId) {
        try {
            CarritoDTO carrito = carritoService.obtenerCarrito(usuarioId);
            return ResponseEntity.ok(carrito);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al obtener carrito: " + e.getMessage());
        }
    }
    
    /**
     * Actualiza el carrito del usuario
     */
    @PostMapping("/{usuarioId}/actualizar")
    public ResponseEntity<?> actualizarCarrito(
            @PathVariable Integer usuarioId,
            @RequestBody CarritoDTO carritoDTO) {
        try {
            CarritoDTO actualizado = carritoService.actualizarCarrito(
                usuarioId,
                carritoDTO.getContenido(),
                carritoDTO.getCantidadItems(),
                carritoDTO.getTotal()
            );
            return ResponseEntity.ok(actualizado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al actualizar carrito: " + e.getMessage());
        }
    }
    
    /**
     * Vacía el carrito del usuario
     */
    @PostMapping("/{usuarioId}/vaciar")
    public ResponseEntity<?> vaciarCarrito(@PathVariable Integer usuarioId) {
        try {
            CarritoDTO vaciado = carritoService.vaciarCarrito(usuarioId);
            return ResponseEntity.ok(vaciado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al vaciar carrito: " + e.getMessage());
        }
    }
}
