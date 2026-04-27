package com.daw.proyecto.service;

import com.daw.proyecto.entity.Rol;
import com.daw.proyecto.entity.Usuario;
import com.daw.proyecto.repository.UsuarioRepository;
import com.daw.proyecto.dto.UsuarioDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<UsuarioDTO> findAll() {
        return usuarioRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<UsuarioDTO> findById(Integer id) {
        return usuarioRepository.findById(id).map(this::convertToDTO);
    }

    public UsuarioDTO save(UsuarioDTO usuarioDTO) {
    // 1. Convertimos el DTO a la Entidad
    // (Asegúrate de que convertToEntity maneja la conversión de String a Enum, ver abajo)
    Usuario usuario = convertToEntity(usuarioDTO);
    
    // Limpiar espacios en blanco de campos importantes
    if (usuario.getNombre() != null) {
        usuario.setNombre(usuario.getNombre().trim());
    }
    if (usuario.getEmail() != null) {
        usuario.setEmail(usuario.getEmail().trim());
    }
    // Ojo: La contraseña no deberías hacer trim() si ya viene hasheada o si el usuario puso espacios a propósito, 
    // pero si es texto plano está bien.
    if (usuario.getContraseña() != null) {
        usuario.setContraseña(usuario.getContraseña().trim());
    }
    
    // Si la fecha de alta es null, asignar la fecha actual
    if (usuario.getFecha_alta() == null) {
        usuario.setFecha_alta(new Date());
    }

    // --- AQUÍ ESTÁ EL CAMBIO ---
    // Como 'rol' ahora es un Enum, no tiene .isEmpty(). Solo comprobamos si es null.
    if (usuario.getRol() == null) {
        // Asignamos el valor del Enum directamente
        usuario.setRol(Rol.USER_ROLE); 
    }
    // ---------------------------

    Usuario savedUsuario = usuarioRepository.save(usuario);
    return convertToDTO(savedUsuario);
}

    public void deleteById(Integer id) {
        usuarioRepository.deleteById(id);
    }

    public Optional<UsuarioDTO> findByEmail(String email) {
        // Obtener todos los usuarios y buscar por email (case-insensitive)
        List<Usuario> usuarios = usuarioRepository.findAll();
        return usuarios.stream()
                .filter(u -> u.getEmail().trim().equalsIgnoreCase(email.trim()))
                .findFirst()
                .map(this::convertToDTO);
    }

    public boolean existsByEmail(String email) {
        List<Usuario> usuarios = usuarioRepository.findAll();
        return usuarios.stream().anyMatch(u -> u.getEmail().trim().equalsIgnoreCase(email.trim()));
    }

    private UsuarioDTO convertToDTO(Usuario usuario) {
        UsuarioDTO dto = new UsuarioDTO(
                usuario.getId_usuario(),
                usuario.getNombre(),
                usuario.getEmail(),
                usuario.getContraseña(),
                usuario.getTeléfono(),
                usuario.getFecha_alta(),
                // Devolver el valor legible ('cliente' / 'admin') al DTO
                (usuario.getRol() != null ? usuario.getRol().getValor() : null),
                usuario.getFotoFilename()
        );
        dto.setPlan(usuario.getPlan());
        dto.setFechaExpiracionPlan(usuario.getFechaExpiracionPlan());
        return dto;
    }

    private Usuario convertToEntity(UsuarioDTO usuarioDTO) {
        Usuario usuario = new Usuario();
        usuario.setId_usuario(usuarioDTO.getId_usuario());
        usuario.setNombre(usuarioDTO.getNombre());
        usuario.setEmail(usuarioDTO.getEmail());
        usuario.setContraseña(usuarioDTO.getContraseña());
        usuario.setTeléfono(usuarioDTO.getTeléfono());
        usuario.setFecha_alta(usuarioDTO.getFecha_alta());
        // Convertir el rol desde el texto recibido (ej. 'cliente' o 'admin') al Enum
        usuario.setRol(Rol.fromValor(usuarioDTO.getRol()));
        usuario.setFotoFilename(usuarioDTO.getFoto());
        usuario.setPlan(usuarioDTO.getPlan());
        usuario.setFechaExpiracionPlan(usuarioDTO.getFechaExpiracionPlan());
        return usuario;
    }
}
