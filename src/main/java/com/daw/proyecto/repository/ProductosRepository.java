package com.daw.proyecto.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.daw.proyecto.entity.Productos;
import java.util.List;

public interface ProductosRepository extends JpaRepository<Productos, Integer> {
    
    // Buscar por nombre (LIKE - búsqueda parcial)
    List<Productos> findByNombreContainingIgnoreCase(String nombre);
    
    // Buscar por categoría
    List<Productos> findByCategoria(String categoria);
    
    // Búsqueda avanzada: por nombre O descripción
    @Query("SELECT p FROM Productos p WHERE LOWER(p.nombre) LIKE LOWER(CONCAT('%', :busqueda, '%')) " +
           "OR LOWER(p.descripcion) LIKE LOWER(CONCAT('%', :busqueda, '%'))")
    List<Productos> buscarPorNombreODescripcion(@Param("busqueda") String busqueda);
}

