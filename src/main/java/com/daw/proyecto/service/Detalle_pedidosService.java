package com.daw.proyecto.service;

import com.daw.proyecto.entity.Detalle_pedidos;
import com.daw.proyecto.entity.Pedidos;
import com.daw.proyecto.entity.Productos;
import com.daw.proyecto.repository.Detalle_pedidosRepository;
import com.daw.proyecto.repository.PedidosRepository;
import com.daw.proyecto.repository.ProductosRepository;
import com.daw.proyecto.dto.Detalle_pedidosDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class Detalle_pedidosService {

    @Autowired
    private Detalle_pedidosRepository detalle_pedidosRepository;

    @Autowired
    private PedidosRepository pedidosRepository;

    @Autowired
    private ProductosRepository productosRepository;

    public List<Detalle_pedidosDTO> findByPedidoId(Integer idPedido) {
        return detalle_pedidosRepository.buscarPorPedidoId(idPedido).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<Detalle_pedidosDTO> findAll() {
        return detalle_pedidosRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<Detalle_pedidosDTO> findById(Integer id) {
        return detalle_pedidosRepository.findById(id).map(this::convertToDTO);
    }

    public Detalle_pedidosDTO save(Detalle_pedidosDTO dto) {
        Detalle_pedidos entity = convertToEntity(dto);
        return convertToDTO(detalle_pedidosRepository.save(entity));
    }

    public void deleteById(Integer id) {
        detalle_pedidosRepository.deleteById(id);
    }

    // --- MAPEO DE ENTIDAD A DTO (Aquí se añaden los datos del producto) ---
    private Detalle_pedidosDTO convertToDTO(Detalle_pedidos entity) {
        return new Detalle_pedidosDTO(
                entity.getId_detalle(),
                entity.getPedido().getId_pedido(),
                entity.getProducto().getId_producto(),
                entity.getCantidad(),
                entity.getPrecio_unitario(),
                entity.getProducto().getNombre(), // Sacado de la entidad Productos
                entity.getProducto().getImagen()  // Sacado de la entidad Productos
        );
    }

    private Detalle_pedidos convertToEntity(Detalle_pedidosDTO dto) {
        Detalle_pedidos entity = new Detalle_pedidos();
        entity.setId_detalle(dto.getId_detalle());
        entity.setCantidad(dto.getCantidad());
        entity.setPrecio_unitario(dto.getPrecio_unitario());

        if (dto.getId_pedido() != null) {
            pedidosRepository.findById(dto.getId_pedido()).ifPresent(entity::setPedido);
        }

        if (dto.getId_producto() != null) {
            productosRepository.findById(dto.getId_producto()).ifPresent(entity::setProducto);
        }

        return entity;
    }
}