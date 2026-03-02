package com.daw.proyecto.service;

import com.daw.proyecto.entity.Profesionales;
import com.daw.proyecto.repository.ProfesionalesRepository;
import com.daw.proyecto.dto.ProfesionalesDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProfesionalesService {

    @Autowired
    private ProfesionalesRepository profesionalesRepository;

    public List<ProfesionalesDTO> findAll() {
        return profesionalesRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<ProfesionalesDTO> findById(Integer id) {
        return profesionalesRepository.findById(id).map(this::convertToDTO);
    }

    public ProfesionalesDTO save(ProfesionalesDTO profesionalesDTO) {
        Profesionales profesionales = convertToEntity(profesionalesDTO);
        Profesionales savedProfesionales = profesionalesRepository.save(profesionales);
        return convertToDTO(savedProfesionales);
    }

    public void deleteById(Integer id) {
        profesionalesRepository.deleteById(id);
    }

    private ProfesionalesDTO convertToDTO(Profesionales profesionales) {
        return new ProfesionalesDTO(
                profesionales.getId_profesional(),
                profesionales.getNombre(),
                profesionales.getEspecialidad(),
                profesionales.getDescripcion(),
                profesionales.getImagen()
        );
    }

    private Profesionales convertToEntity(ProfesionalesDTO profesionalesDTO) {
        Profesionales profesionales = new Profesionales();
        profesionales.setId_profesional(profesionalesDTO.getId_profesional());
        profesionales.setNombre(profesionalesDTO.getNombre());
        profesionales.setEspecialidad(profesionalesDTO.getEspecialidad());
        profesionales.setDescripcion(profesionalesDTO.getDescripcion());
        profesionales.setImagen(profesionalesDTO.getImagen());
        return profesionales;
    }
}
