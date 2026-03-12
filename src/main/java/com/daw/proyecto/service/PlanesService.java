package com.daw.proyecto.service;

import com.daw.proyecto.entity.Planes;
import com.daw.proyecto.repository.PlanesRepository;
import com.daw.proyecto.dto.PlanesDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PlanesService {

    @Autowired
    private PlanesRepository planesRepository;

    public List<PlanesDTO> findAll() {
        return planesRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<PlanesDTO> findById(Integer id) {
        return planesRepository.findById(id).map(this::convertToDTO);
    }

    public PlanesDTO save(PlanesDTO planesDTO) {
        Planes planes = convertToEntity(planesDTO);
        Planes savedPlanes = planesRepository.save(planes);
        return convertToDTO(savedPlanes);
    }

    public void deleteById(Integer id) {
        planesRepository.deleteById(id);
    }

    private PlanesDTO convertToDTO(Planes planes) {
        return new PlanesDTO(
                planes.getId_plan(),
                planes.getNombre(),
                planes.getPrecio(),
                planes.getDescripcion(),
                planes.getDuracion()
        );
    }

    private Planes convertToEntity(PlanesDTO planesDTO) {
        Planes planes = new Planes();
        planes.setId_plan(planesDTO.getId_plan());
        planes.setNombre(planesDTO.getNombre());
        planes.setPrecio(planesDTO.getPrecio());
        planes.setDescripcion(planesDTO.getDescripcion());
        planes.setDuracion(planesDTO.getDuracion());
        return planes;
    }
}
