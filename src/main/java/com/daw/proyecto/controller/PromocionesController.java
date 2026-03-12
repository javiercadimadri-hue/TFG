package com.daw.proyecto.controller;

import com.daw.proyecto.dto.PromocionesDTO;
import com.daw.proyecto.service.PromocionesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/promociones")
public class PromocionesController {

    @Autowired
    private PromocionesService promocionesService;

    @GetMapping
    public List<PromocionesDTO> getAllPromociones() {
        return promocionesService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PromocionesDTO> getPromocionById(@PathVariable Integer id) {
        return promocionesService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public PromocionesDTO createPromocion(@RequestBody PromocionesDTO promocionesDTO) {
        return promocionesService.save(promocionesDTO);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PromocionesDTO> updatePromocion(@PathVariable Integer id, @RequestBody PromocionesDTO promocionesDTO) {
        if (!promocionesService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        promocionesDTO.setId_promocion(id);
        PromocionesDTO updatedPromocion = promocionesService.save(promocionesDTO);
        return ResponseEntity.ok(updatedPromocion);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePromocion(@PathVariable Integer id) {
        if (!promocionesService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        promocionesService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
