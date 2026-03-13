package com.daw.proyecto.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.daw.proyecto.entity.Detalle_pedidos;
import java.util.List;

public interface Detalle_pedidosRepository extends JpaRepository<Detalle_pedidos, Integer> {
    // Obtener todos los detalles de un pedido específico
    @Query("SELECT dp FROM Detalle_pedidos dp WHERE dp.pedido.id_pedido = :id_pedido")
    List<Detalle_pedidos> findByPedidoId(@Param("id_pedido") Integer id_pedido);
}
