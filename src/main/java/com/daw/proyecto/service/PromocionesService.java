package com.daw.proyecto.service;

import com.daw.proyecto.entity.Promociones;
import com.daw.proyecto.repository.PromocionesRepository;
import com.daw.proyecto.dto.PromocionesDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PromocionesService {

    @Autowired
    private PromocionesRepository promocionesRepository;

    public List<PromocionesDTO> findAll() {
        return promocionesRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<PromocionesDTO> findById(Integer id) {
        return promocionesRepository.findById(id).map(this::convertToDTO);
    }

    public PromocionesDTO save(PromocionesDTO promocionesDTO) {
        Promociones promociones = convertToEntity(promocionesDTO);
        Promociones savedPromociones = promocionesRepository.save(promociones);
        return convertToDTO(savedPromociones);
    }

    public void deleteById(Integer id) {
        promocionesRepository.deleteById(id);
    }

    private PromocionesDTO convertToDTO(Promociones promociones) {
        return new PromocionesDTO(
                promociones.getId_promocion(),
                promociones.getCodigo(),
                promociones.getDescuento(),
                promociones.getFecha_inicio(),
                promociones.getFecha_fin()
        );
    }

    private Promociones convertToEntity(PromocionesDTO promocionesDTO) {
        Promociones promociones = new Promociones();
        promociones.setId_promocion(promocionesDTO.getId_promocion());
        promociones.setCodigo(promocionesDTO.getCodigo());
        promociones.setDescuento(promocionesDTO.getDescuento());
        promociones.setFecha_inicio(promocionesDTO.getFecha_inicio());
        promociones.setFecha_fin(promocionesDTO.getFecha_fin());
        return promociones;
    }
}
