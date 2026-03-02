package com.daw.proyecto.controller;

import com.daw.proyecto.dto.SuscripcionDTO;
import com.daw.proyecto.service.SuscripcionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suscripciones")
public class SuscripcionController {

    @Autowired
    private SuscripcionService suscripcionService;

    @GetMapping
    public List<SuscripcionDTO> getAllSuscripciones() {
        return suscripcionService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<SuscripcionDTO> getSuscripcionById(@PathVariable Integer id) {
        return suscripcionService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public SuscripcionDTO createSuscripcion(@RequestBody SuscripcionDTO suscripcionDTO) {
        return suscripcionService.save(suscripcionDTO);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SuscripcionDTO> updateSuscripcion(@PathVariable Integer id, @RequestBody SuscripcionDTO suscripcionDTO) {
        if (!suscripcionService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        suscripcionDTO.setId_suscripcion(id);
        SuscripcionDTO updatedSuscripcion = suscripcionService.save(suscripcionDTO);
        return ResponseEntity.ok(updatedSuscripcion);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSuscripcion(@PathVariable Integer id) {
        if (!suscripcionService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        suscripcionService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
