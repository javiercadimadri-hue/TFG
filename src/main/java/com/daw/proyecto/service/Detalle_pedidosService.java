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

    public List<Detalle_pedidosDTO> findAll() {
        return detalle_pedidosRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<Detalle_pedidosDTO> findById(Integer id) {
        return detalle_pedidosRepository.findById(id).map(this::convertToDTO);
    }

    public List<Detalle_pedidosDTO> findByPedidoId(Integer idPedido) {
        return detalle_pedidosRepository.findByPedidoId(idPedido).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Detalle_pedidosDTO save(Detalle_pedidosDTO detalle_pedidosDTO) {
        Detalle_pedidos detalle_pedidos = convertToEntity(detalle_pedidosDTO);
        Detalle_pedidos savedDetalle_pedidos = detalle_pedidosRepository.save(detalle_pedidos);
        return convertToDTO(savedDetalle_pedidos);
    }

    public void deleteById(Integer id) {
        detalle_pedidosRepository.deleteById(id);
    }

    private Detalle_pedidosDTO convertToDTO(Detalle_pedidos detalle_pedidos) {
        return new Detalle_pedidosDTO(
                detalle_pedidos.getId_detalle(),
                detalle_pedidos.getPedido().getId_pedido(),
                detalle_pedidos.getProducto().getId_producto(),
                detalle_pedidos.getCantidad(),
                detalle_pedidos.getPrecio_unitario()
        );
    }

    private Detalle_pedidos convertToEntity(Detalle_pedidosDTO detalle_pedidosDTO) {
        Detalle_pedidos detalle_pedidos = new Detalle_pedidos();
        detalle_pedidos.setId_detalle(detalle_pedidosDTO.getId_detalle());
        detalle_pedidos.setCantidad(detalle_pedidosDTO.getCantidad());
        detalle_pedidos.setPrecio_unitario(detalle_pedidosDTO.getPrecio_unitario());

        if (detalle_pedidosDTO.getId_pedido() != null) {
            Pedidos pedido = pedidosRepository.findById(detalle_pedidosDTO.getId_pedido()).orElse(null);
            detalle_pedidos.setPedido(pedido);
        }

        if (detalle_pedidosDTO.getId_producto() != null) {
            Productos producto = productosRepository.findById(detalle_pedidosDTO.getId_producto()).orElse(null);
            detalle_pedidos.setProducto(producto);
        }

        return detalle_pedidos;
    }
}
