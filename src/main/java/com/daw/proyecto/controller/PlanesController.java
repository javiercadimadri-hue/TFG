package com.daw.proyecto.controller;

import com.daw.proyecto.dto.PlanesDTO;
import com.daw.proyecto.service.PlanesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/planes")
public class PlanesController {

    @Autowired
    private PlanesService planesService;

    @GetMapping
    public List<PlanesDTO> getAllPlanes() {
        return planesService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlanesDTO> getPlanById(@PathVariable Integer id) {
        return planesService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public PlanesDTO createPlan(@RequestBody PlanesDTO planesDTO) {
        return planesService.save(planesDTO);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PlanesDTO> updatePlan(@PathVariable Integer id, @RequestBody PlanesDTO planesDTO) {
        if (!planesService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        planesDTO.setId_plan(id);
        PlanesDTO updatedPlan = planesService.save(planesDTO);
        return ResponseEntity.ok(updatedPlan);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlan(@PathVariable Integer id) {
        if (!planesService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        planesService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
