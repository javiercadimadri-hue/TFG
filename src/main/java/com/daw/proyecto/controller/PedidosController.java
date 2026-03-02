package com.daw.proyecto.controller;

import com.daw.proyecto.dto.PedidosDTO;
import com.daw.proyecto.dto.CrearPedidoDTO;
import com.daw.proyecto.service.PedidosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "*", maxAge = 3600)
public class PedidosController {

    @Autowired
    private PedidosService pedidosService;

    /**
     * Crea un nuevo pedido con todos sus detalles
     */
    @PostMapping("/crear")
    public ResponseEntity<?> crearPedidoConDetalles(@RequestBody CrearPedidoDTO crearPedidoDTO) {
        try {
            System.out.println(">>> POST /api/pedidos/crear");
            System.out.println(">>> Datos recibidos: " + crearPedidoDTO.getId_usuario() + ", Total: " + crearPedidoDTO.getTotal());
            PedidosDTO pedido = pedidosService.crearPedidoConDetalles(crearPedidoDTO);
            return ResponseEntity.ok(pedido);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error al crear pedido: " + e.getMessage());
        }
    }
    
    /**
     * Obtiene los pedidos de un usuario
     */
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<PedidosDTO>> getPedidosPorUsuario(@PathVariable Integer usuarioId) {
        List<PedidosDTO> pedidos = pedidosService.getPedidosPorUsuario(usuarioId);
        return ResponseEntity.ok(pedidos);
    }

    @GetMapping
    public List<PedidosDTO> getAllPedidos() {
        return pedidosService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PedidosDTO> getPedidoById(@PathVariable Integer id) {
        return pedidosService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public PedidosDTO createPedido(@RequestBody PedidosDTO pedidosDTO) {
        return pedidosService.save(pedidosDTO);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PedidosDTO> updatePedido(@PathVariable Integer id, @RequestBody PedidosDTO pedidosDTO) {
        if (!pedidosService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        pedidosDTO.setId_pedido(id);
        PedidosDTO updatedPedido = pedidosService.save(pedidosDTO);
        return ResponseEntity.ok(updatedPedido);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePedido(@PathVariable Integer id) {
        if (!pedidosService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        pedidosService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
