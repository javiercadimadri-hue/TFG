package com.daw.proyecto.service;

import com.daw.proyecto.entity.Suscripcion;
import com.daw.proyecto.entity.Usuario;
import com.daw.proyecto.entity.Planes;
import com.daw.proyecto.entity.Promociones;
import com.daw.proyecto.repository.SuscripcionRepository;
import com.daw.proyecto.repository.UsuarioRepository;
import com.daw.proyecto.repository.PlanesRepository;
import com.daw.proyecto.repository.PromocionesRepository;
import com.daw.proyecto.dto.SuscripcionDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SuscripcionService {

    @Autowired
    private SuscripcionRepository suscripcionRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PlanesRepository planesRepository;

    @Autowired
    private PromocionesRepository promocionesRepository;

    public List<SuscripcionDTO> findAll() {
        return suscripcionRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<SuscripcionDTO> findById(Integer id) {
        return suscripcionRepository.findById(id).map(this::convertToDTO);
    }

    public SuscripcionDTO save(SuscripcionDTO suscripcionDTO) {
        Suscripcion suscripcion = convertToEntity(suscripcionDTO);
        Suscripcion savedSuscripcion = suscripcionRepository.save(suscripcion);
        return convertToDTO(savedSuscripcion);
    }

    public void deleteById(Integer id) {
        suscripcionRepository.deleteById(id);
    }

    private SuscripcionDTO convertToDTO(Suscripcion suscripcion) {
        return new SuscripcionDTO(
                suscripcion.getId_suscripcion(),
                suscripcion.getUsuario().getId_usuario(),
                suscripcion.getPlan().getId_plan(),
                suscripcion.getPromocion() != null ? suscripcion.getPromocion().getId_promocion() : null,
                suscripcion.getFecha_inicio(),
                suscripcion.getFecha_fin(),
                suscripcion.getEstado()
        );
    }

    private Suscripcion convertToEntity(SuscripcionDTO suscripcionDTO) {
        Suscripcion suscripcion = new Suscripcion();
        suscripcion.setId_suscripcion(suscripcionDTO.getId_suscripcion());
        suscripcion.setFecha_inicio(suscripcionDTO.getFecha_inicio());
        suscripcion.setFecha_fin(suscripcionDTO.getFecha_fin());
        suscripcion.setEstado(suscripcionDTO.getEstado());

        if (suscripcionDTO.getId_usuario() != null) {
            Usuario usuario = usuarioRepository.findById(suscripcionDTO.getId_usuario()).orElse(null);
            suscripcion.setUsuario(usuario);
        }

        if (suscripcionDTO.getId_plan() != null) {
            Planes plan = planesRepository.findById(suscripcionDTO.getId_plan()).orElse(null);
            suscripcion.setPlan(plan);
        }

        if (suscripcionDTO.getId_promocion() != null) {
            Promociones promocion = promocionesRepository.findById(suscripcionDTO.getId_promocion()).orElse(null);
            suscripcion.setPromocion(promocion);
        }

        return suscripcion;
    }
}
