package com.daw.proyecto.service;

import com.daw.proyecto.entity.Pedidos;
import com.daw.proyecto.entity.Usuario;
import com.daw.proyecto.entity.Productos;
import com.daw.proyecto.entity.Detalle_pedidos;
import com.daw.proyecto.repository.PedidosRepository;
import com.daw.proyecto.repository.UsuarioRepository;
import com.daw.proyecto.repository.ProductosRepository;
import com.daw.proyecto.dto.PedidosDTO;
import com.daw.proyecto.dto.CrearPedidoDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PedidosService {

    @Autowired
    private PedidosRepository pedidosRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private ProductosRepository productosRepository;

    public List<PedidosDTO> findAll() {
        return pedidosRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<PedidosDTO> findById(Integer id) {
        return pedidosRepository.findById(id).map(this::convertToDTO);
    }

    public PedidosDTO save(PedidosDTO pedidosDTO) {
        Pedidos pedidos = convertToEntity(pedidosDTO);
        Pedidos savedPedidos = pedidosRepository.save(pedidos);
        return convertToDTO(savedPedidos);
    }

    public void deleteById(Integer id) {
        pedidosRepository.deleteById(id);
    }
    
    /**
     * Obtiene los pedidos de un usuario ordenados por fecha descendente
     */
    public List<PedidosDTO> getPedidosPorUsuario(Integer usuarioId) {
        return pedidosRepository.findByUsuarioIdOrderByFechaDesc(usuarioId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Crea un nuevo pedido con todos sus detalles
     */
    @Transactional
    public PedidosDTO crearPedidoConDetalles(CrearPedidoDTO crearPedidoDTO) {
        // Obtener usuario
        Usuario usuario = usuarioRepository.findById(crearPedidoDTO.getId_usuario())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        // Crear pedido
        Pedidos pedido = new Pedidos();
        pedido.setUsuario(usuario);
        pedido.setFecha(new Date());
        pedido.setTotal(new BigDecimal(crearPedidoDTO.getTotal()));
        pedido.setEstado("pendiente");
        
        // Guardar pedido
        Pedidos pedidoGuardado = pedidosRepository.save(pedido);
        
        // Crear detalles del pedido
        if (crearPedidoDTO.getItems() != null && !crearPedidoDTO.getItems().isEmpty()) {
            for (CrearPedidoDTO.ItemCarritoDTO item : crearPedidoDTO.getItems()) {
                Productos producto = productosRepository.findById(item.getId())
                        .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + item.getId()));
                
                Detalle_pedidos detalle = new Detalle_pedidos();
                detalle.setPedido(pedidoGuardado);
                detalle.setProducto(producto);
                detalle.setCantidad(item.getCantidad());
                detalle.setPrecio_unitario(new BigDecimal(item.getPrecio()));
                
                pedidoGuardado.getDetalles().add(detalle);
            }
        }
        
        // Guardar con detalles
        Pedidos pedidoFinal = pedidosRepository.save(pedidoGuardado);
        return convertToDTO(pedidoFinal);
    }

    private PedidosDTO convertToDTO(Pedidos pedidos) {
        return new PedidosDTO(
                pedidos.getId_pedido(),
                pedidos.getUsuario().getId_usuario(),
                pedidos.getFecha(),
                pedidos.getTotal(),
                pedidos.getEstado()
        );
    }

    private Pedidos convertToEntity(PedidosDTO pedidosDTO) {
        Pedidos pedidos = new Pedidos();
        pedidos.setId_pedido(pedidosDTO.getId_pedido());
        pedidos.setFecha(pedidosDTO.getFecha());
        pedidos.setTotal(pedidosDTO.getTotal());
        pedidos.setEstado(pedidosDTO.getEstado());

        if (pedidosDTO.getId_usuario() != null) {
            Usuario usuario = usuarioRepository.findById(pedidosDTO.getId_usuario()).orElse(null);
            pedidos.setUsuario(usuario);
        }

        return pedidos;
    }
}

