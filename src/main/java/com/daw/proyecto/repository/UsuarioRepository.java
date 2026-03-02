package com.daw.proyecto.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.daw.proyecto.entity.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

}
