package com.daw.proyecto.service;

import com.daw.proyecto.entity.Productos;
import com.daw.proyecto.repository.Detalle_pedidosRepository;
import com.daw.proyecto.repository.ProductosRepository;
import com.daw.proyecto.dto.ProductosDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductosService {

    @Autowired
    private ProductosRepository productosRepository;

    @Autowired
    private Detalle_pedidosRepository detallePedidosRepository;

    public List<ProductosDTO> findAll() {
        return productosRepository.findAll().stream()
                .filter(producto -> producto.getVisible() == null || producto.getVisible())
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<ProductosDTO> findById(Integer id) {
        return productosRepository.findById(id).map(this::convertToDTO);
    }

    public ProductosDTO save(ProductosDTO productosDTO) {
        Productos productos = convertToEntity(productosDTO);
        Productos savedProductos = productosRepository.save(productos);
        return convertToDTO(savedProductos);
    }

    @Transactional
    public void deleteById(Integer id) {
        detallePedidosRepository.deleteByProductoId(id);
        productosRepository.deleteById(id);
    }

    // Búsqueda por nombre
    public List<ProductosDTO> buscarPorNombre(String nombre) {
        return productosRepository.findByNombreContainingIgnoreCase(nombre).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Búsqueda por categoría
    public List<ProductosDTO> buscarPorCategoria(String categoria) {
        return productosRepository.findByCategoria(categoria).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Búsqueda avanzada (nombre O descripción)
    public List<ProductosDTO> buscarPorNombreODescripcion(String busqueda) {
        return productosRepository.buscarPorNombreODescripcion(busqueda).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private ProductosDTO convertToDTO(Productos productos) {
        return new ProductosDTO(
                productos.getId_producto(),
                productos.getNombre(),
                productos.getDescripcion(),
                productos.getPrecio() != null ? productos.getPrecio().doubleValue() : 0.0,
                productos.getStock(),
                productos.getCategoria(),
                productos.getImagen(),
                productos.getVisible()
        );
    }

    private Productos convertToEntity(ProductosDTO productosDTO) {
        Productos productos = new Productos();
        productos.setId_producto(productosDTO.getId_producto());
        productos.setNombre(productosDTO.getNombre());
        productos.setDescripcion(productosDTO.getDescripcion());
        productos.setPrecio(productosDTO.getPrecio() != null ? new java.math.BigDecimal(productosDTO.getPrecio()) : null);
        productos.setStock(productosDTO.getStock());
        productos.setCategoria(productosDTO.getCategoria());
        productos.setImagen(productosDTO.getImagen());
        productos.setVisible(productosDTO.getVisible() != null ? productosDTO.getVisible() : true);
        return productos;
    }
}
