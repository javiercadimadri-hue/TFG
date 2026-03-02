package com.daw.proyecto.controller;

import com.daw.proyecto.dto.ProductosDTO;
import com.daw.proyecto.service.ProductosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/productos")
public class ProductosController {

    @Autowired
    private ProductosService productosService;

    @GetMapping
    public List<ProductosDTO> getAllProductos() {
        System.out.println(">>> GET /api/productos");
        List<ProductosDTO> productos = productosService.findAll();
        System.out.println(">>> Total productos devueltos: " + productos.size());
        for (ProductosDTO p : productos) {
            System.out.println("    - " + p.getId_producto() + ": " + p.getNombre() + " $" + p.getPrecio());
        }
        return productos;
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductosDTO> getProductoById(@PathVariable Integer id) {
        return productosService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ProductosDTO createProducto(@RequestBody ProductosDTO productosDTO) {
        return productosService.save(productosDTO);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductosDTO> updateProducto(@PathVariable Integer id, @RequestBody ProductosDTO productosDTO) {
        if (!productosService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        productosDTO.setId_producto(id);
        ProductosDTO updatedProducto = productosService.save(productosDTO);
        return ResponseEntity.ok(updatedProducto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProducto(@PathVariable Integer id) {
        if (!productosService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        productosService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Búsqueda por nombre
    @GetMapping("/buscar/nombre")
    public List<ProductosDTO> buscarPorNombre(@RequestParam String nombre) {
        return productosService.buscarPorNombre(nombre);
    }

    // Búsqueda por categoría
    @GetMapping("/buscar/categoria")
    public List<ProductosDTO> buscarPorCategoria(@RequestParam String categoria) {
        return productosService.buscarPorCategoria(categoria);
    }

    // Búsqueda avanzada (nombre + descripción)
    @GetMapping("/buscar")
    public List<ProductosDTO> buscar(@RequestParam String q) {
        return productosService.buscarPorNombreODescripcion(q);
    }

    // Subir imagen del producto
    @PostMapping("/{id}/imagen")
    public ResponseEntity<?> subirImagen(@PathVariable Integer id, @RequestParam("file") MultipartFile file) {
        try {
            var productoOpt = productosService.findById(id);
            if (productoOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            if (file == null || file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "No file provided"));
            }

            String uploadsDir = System.getProperty("user.dir") + File.separator + "uploads" + File.separator;
            File dir = new File(uploadsDir);
            if (!dir.exists()) dir.mkdirs();

            ProductosDTO productoDTO = productoOpt.get();

            // Eliminar la imagen anterior si existe
            if (productoDTO.getImagen() != null && !productoDTO.getImagen().isEmpty()) {
                Path oldFilePath = Paths.get(uploadsDir + productoDTO.getImagen());
                Files.deleteIfExists(oldFilePath);
            }

            // Generar un nombre aleatorio para la nueva imagen
            String original = file.getOriginalFilename();
            String ext = "";
            if (original != null && original.contains(".")) {
                ext = original.substring(original.lastIndexOf('.'));
            }
            String filename = UUID.randomUUID().toString() + ext;
            Path target = Paths.get(uploadsDir + filename);
            try {
                Files.copy(file.getInputStream(), target);
            } catch (Exception e) {
                System.err.println("Error al guardar la imagen: " + e.getMessage());
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "No se pudo guardar la imagen"));
            }

            // Actualizar el producto con la nueva imagen
            productoDTO.setImagen(filename);
            productosService.save(productoDTO);

            return ResponseEntity.ok(Map.of("imagenUrl", "/api/productos/" + id + "/imagen"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }

    // Servir imagen del producto
    @GetMapping("/{id}/imagen")
    public ResponseEntity<Resource> servirImagen(@PathVariable Integer id) {
        try {
            var productoOpt = productosService.findById(id);
            if (productoOpt.isEmpty()) return ResponseEntity.notFound().build();

            ProductosDTO productoDTO = productoOpt.get();
            String filename = productoDTO.getImagen();

            if (filename == null || filename.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            // Intentar cargar la imagen del producto desde la carpeta uploads
            if (filename != null && !filename.isEmpty()) {
                Path uploadsPath = Paths.get(System.getProperty("user.dir") + File.separator + "uploads" + File.separator + filename);
                if (Files.exists(uploadsPath)) {
                    Resource resource = new UrlResource(uploadsPath.toUri());
                    return ResponseEntity.ok()
                            .contentType(MediaType.IMAGE_JPEG)
                            .body(resource);
                }
            }

            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
