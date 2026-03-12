package com.daw.proyecto.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.daw.proyecto.entity.Pedidos;
import com.daw.proyecto.entity.Usuario;

import java.util.List;

public interface PedidosRepository extends JpaRepository<Pedidos, Integer> {
    List<Pedidos> findByUsuarioOrderByFechaDesc(Usuario usuario);
    
    @Query("SELECT p FROM Pedidos p WHERE p.usuario.id_usuario = :usuarioId ORDER BY p.fecha DESC")
    List<Pedidos> findByUsuarioIdOrderByFechaDesc(@Param("usuarioId") Integer usuarioId);
}
