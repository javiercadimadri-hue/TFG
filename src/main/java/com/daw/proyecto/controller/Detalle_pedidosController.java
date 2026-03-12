package com.daw.proyecto.controller;

import com.daw.proyecto.dto.Detalle_pedidosDTO;
import com.daw.proyecto.service.Detalle_pedidosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/detalle-pedidos")
public class Detalle_pedidosController {

    @Autowired
    private Detalle_pedidosService detalle_pedidosService;

    @GetMapping
    public List<Detalle_pedidosDTO> getAllDetallePedidos() {
        return detalle_pedidosService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Detalle_pedidosDTO> getDetallePedidoById(@PathVariable Integer id) {
        return detalle_pedidosService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Detalle_pedidosDTO createDetallePedido(@RequestBody Detalle_pedidosDTO detalle_pedidosDTO) {
        return detalle_pedidosService.save(detalle_pedidosDTO);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Detalle_pedidosDTO> updateDetallePedido(@PathVariable Integer id, @RequestBody Detalle_pedidosDTO detalle_pedidosDTO) {
        if (!detalle_pedidosService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        detalle_pedidosDTO.setId_detalle(id);
        Detalle_pedidosDTO updatedDetallePedido = detalle_pedidosService.save(detalle_pedidosDTO);
        return ResponseEntity.ok(updatedDetallePedido);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDetallePedido(@PathVariable Integer id) {
        if (!detalle_pedidosService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        detalle_pedidosService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
