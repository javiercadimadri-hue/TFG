package com.daw.proyecto.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.daw.proyecto.entity.Detalle_pedidos;

import java.util.List;

public interface Detalle_pedidosRepository extends JpaRepository<Detalle_pedidos, Integer> {
    
    // Usamos JPQL para evitar el lío de los guiones bajos en los nombres de métodos
    @Query("SELECT d FROM Detalle_pedidos d WHERE d.pedido.id_pedido = :idPedido")
    List<Detalle_pedidos> buscarPorPedidoId(@Param("idPedido") Integer idPedido);

    @Modifying
    @Query("DELETE FROM Detalle_pedidos d WHERE d.producto.id_producto = :productoId")
    void deleteByProductoId(@Param("productoId") Integer productoId);
}