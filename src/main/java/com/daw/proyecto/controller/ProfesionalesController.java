package com.daw.proyecto.controller;

import com.daw.proyecto.dto.ProfesionalesDTO;
import com.daw.proyecto.service.ProfesionalesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/profesionales")
public class ProfesionalesController {

    @Autowired
    private ProfesionalesService profesionalesService;

    @GetMapping
    public List<ProfesionalesDTO> getAllProfesionales() {
        return profesionalesService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProfesionalesDTO> getProfesionalById(@PathVariable Integer id) {
        return profesionalesService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ProfesionalesDTO createProfesional(@RequestBody ProfesionalesDTO profesionalesDTO) {
        return profesionalesService.save(profesionalesDTO);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProfesionalesDTO> updateProfesional(@PathVariable Integer id, @RequestBody ProfesionalesDTO profesionalesDTO) {
        if (!profesionalesService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        profesionalesDTO.setId_profesional(id);
        ProfesionalesDTO updatedProfesional = profesionalesService.save(profesionalesDTO);
        return ResponseEntity.ok(updatedProfesional);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProfesional(@PathVariable Integer id) {
        if (!profesionalesService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        profesionalesService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
