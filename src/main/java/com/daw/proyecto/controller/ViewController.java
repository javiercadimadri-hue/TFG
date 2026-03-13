package com.daw.proyecto.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.ui.Model;
import org.springframework.beans.factory.annotation.Autowired;
import com.daw.proyecto.dto.UsuarioDTO;
import com.daw.proyecto.dto.PedidosDTO;
import com.daw.proyecto.dto.Detalle_pedidosDTO;
import com.daw.proyecto.service.UsuarioService;
import com.daw.proyecto.service.ProductosService;
import com.daw.proyecto.service.PlanesService;
import com.daw.proyecto.service.ProfesionalesService;
import com.daw.proyecto.service.PedidosService;
import com.daw.proyecto.service.Detalle_pedidosService;
import com.daw.proyecto.service.JwtService;
import com.daw.proyecto.repository.ProductosRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.Cookie;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import java.util.HashMap;
import java.math.BigDecimal;

@Controller
public class ViewController {

    @Autowired
    private ProductosService productosService;

    @Autowired
    private PlanesService planesService;

    @Autowired
    private ProfesionalesService profesionalesService;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private PedidosService pedidosService;

    @Autowired
    private Detalle_pedidosService detalle_pedidosService;

    @Autowired
    private ProductosRepository productoRepository;

    // Obtener el usuario autenticado desde la cookie con JWT
    private UsuarioDTO getUsuarioAutenticado(HttpServletRequest request) {
        try {
            // Primero intentar leer de la cookie
            String token = null;
            Cookie[] cookies = request.getCookies();
            
            if (cookies != null) {
                for (Cookie cookie : cookies) {
                    if ("authToken".equals(cookie.getName())) {
                        token = cookie.getValue();
                        break;
                    }
                }
            }
            
            // Si no está en cookie, intentar del header Authorization
            if (token == null) {
                String authHeader = request.getHeader("Authorization");
                if (authHeader != null && authHeader.startsWith("Bearer ")) {
                    token = authHeader.substring(7);
                }
            }
            
            // Si encontramos token, extraer usuario
            if (token != null && !token.isEmpty()) {
                Integer userId = jwtService.getUserIdFromToken(token);
                if (userId != null) {
                    var usuario = usuarioService.findById(userId).orElse(null);
                    System.out.println("✓ Usuario extraído: " + (usuario != null ? usuario.getNombre() : "null") +
                                     " - Plan: " + (usuario != null ? usuario.getPlan() : "null"));
                    return usuario;
                }
            }
        } catch (Exception e) {
            System.err.println("✗ Error extrayendo usuario autenticado: " + e.getMessage());
            e.printStackTrace();
        }
        return null;
    }

    // Página inicial
    @GetMapping("/")
    public String index(Model model) {
        return "index";
    }

    // Mostrar formulario de registro - Ruta actualizada
    @GetMapping("/registro")
    public String mostrarRegistro(Model model) {
        model.addAttribute("usuarioDTO", new UsuarioDTO());
        return "registro";
    }

    // Mostrar formulario de login - Ruta actualizada
    @GetMapping("/login")
    public String mostrarLogin(Model model) {
        model.addAttribute("usuarioDTO", new UsuarioDTO());
        return "login";
    }

    // Redireccionar /inicio a /cuenta (página del usuario autenticado)
    @GetMapping("/inicio")
    public String redireccionarInicio() {
        return "redirect:/cuenta";
    }

    // Página del carrito
    @GetMapping("/carrito")
    public String mostrarCarrito(Model model) {
        return "carrito";
    }

    // Página de catálogo de productos
    @GetMapping("/productos")
    public String mostrarProductos(Model model) {
        model.addAttribute("productos", productosService.findAll());
        return "productos";
    }

    // Página de gimnasio
    @GetMapping("/gimnasio")
    public String mostrarGimnasio(Model model) {
        model.addAttribute("planes", planesService.findAll());
        return "gimnasio";
    }

    // Página de tienda
    @GetMapping("/tienda")
    public String mostrarTienda(Model model) {
        model.addAttribute("productos", productosService.findAll());
        return "tienda";
    }

    // Página de profesionales
    @GetMapping("/profesionales")
    public String mostrarProfesionales(Model model) {
        model.addAttribute("profesionales", profesionalesService.findAll());
        return "profesionales";
    }

    // Página de cuenta del usuario
    @GetMapping("/cuenta")
    public String mostrarCuenta(Model model, HttpServletRequest request) {
        System.out.println("\n=== Iniciando carga de página /cuenta ===");
        
        // Leer userId desde cookie
        Integer userId = null;
        Cookie[] cookies = request.getCookies();
        
        System.out.println("Cookies recibidas: " + (cookies != null ? cookies.length : 0));
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                System.out.println("  - Cookie: " + cookie.getName() + " = " + cookie.getValue().substring(0, Math.min(30, cookie.getValue().length())));
                if ("userId".equals(cookie.getName())) {
                    try {
                        userId = Integer.parseInt(cookie.getValue());
                        System.out.println("✓ UserId encontrado en cookie: " + userId);
                    } catch (NumberFormatException e) {
                        System.out.println("✗ Error parseando userId: " + e.getMessage());
                    }
                    break;
                }
            }
        }
        
        if (userId == null) {
            System.out.println("✗ No se encontró userId en cookie, intentando extraer del token...");
            
            // Fallback: intentar extraer del token en el header
            String token = null;
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7);
                System.out.println("✓ Token encontrado en header");
            }
            
            if (token == null && cookies != null) {
                for (Cookie cookie : cookies) {
                    if ("authToken".equals(cookie.getName())) {
                        token = cookie.getValue();
                        System.out.println("✓ Token encontrado en cookie");
                        break;
                    }
                }
            }
            
            if (token != null) {
                try {
                    userId = jwtService.getUserIdFromToken(token);
                    System.out.println("✓ UserId extraído del token: " + userId);
                } catch (Exception e) {
                    System.out.println("✗ Error extrayendo userId del token: " + e.getMessage());
                }
            }
        }
        
        if (userId == null) {
            System.out.println("✗ No se pudo obtener userId, redirigiendo a login");
            return "redirect:/login";
        }
        
        try {
            // Obtener usuario desde BD usando el userId
            var usuarioOpt = usuarioService.findById(userId);
            if (usuarioOpt.isPresent()) {
                UsuarioDTO usuario = usuarioOpt.get();
                System.out.println("✓ Usuario encontrado: " + usuario.getNombre());
                System.out.println("  - ID: " + usuario.getId_usuario());
                System.out.println("  - Plan (desde BD): " + usuario.getPlan());
                System.out.println("  - Fecha expiracion (desde BD): " + usuario.getFechaExpiracionPlan());
                System.out.println("  - Foto: " + usuario.getFoto());
                
                // Pasar datos a Thymeleaf
                model.addAttribute("usuario", usuario);
                model.addAttribute("plan", usuario.getPlan() != null ? usuario.getPlan() : "Ninguno");
                model.addAttribute("fechaExpiracion", usuario.getFechaExpiracionPlan());
                model.addAttribute("fotoFilename", usuario.getFoto());
                
                // Obtener historial de pedidos del usuario
                List<PedidosDTO> pedidos = pedidosService.getPedidosPorUsuario(userId);
                List<Map<String, Object>> pedidosConDetalles = new ArrayList<>();
                
                for (PedidosDTO pedido : pedidos) {
                    Map<String, Object> pedidoInfo = new HashMap<>();
                    pedidoInfo.put("id_pedido", pedido.getId_pedido());
                    pedidoInfo.put("fecha", pedido.getFecha());
                    pedidoInfo.put("total", pedido.getTotal());
                    pedidoInfo.put("estado", pedido.getEstado());
                    
                    // Obtener detalles del pedido
                    List<Detalle_pedidosDTO> detalles = detalle_pedidosService.findByPedidoId(pedido.getId_pedido());
                    List<Map<String, Object>> detallesConFotos = new ArrayList<>();
                    
                    for (Detalle_pedidosDTO detalle : detalles) {
                        Map<String, Object> detalleInfo = new HashMap<>();
                        detalleInfo.put("id_detalle", detalle.getId_detalle());
                        detalleInfo.put("id_producto", detalle.getId_producto());
                        detalleInfo.put("cantidad", detalle.getCantidad());
                        detalleInfo.put("precio_unitario", detalle.getPrecio_unitario());
                        // Calcular subtotal: precio_unitario * cantidad
                        BigDecimal subtotal = detalle.getPrecio_unitario().multiply(BigDecimal.valueOf(detalle.getCantidad()));
                        detalleInfo.put("subtotal", subtotal);
                        
                        // Obtener información del producto/plan
                        productoRepository.findById(detalle.getId_producto()).ifPresent(producto -> {
                            detalleInfo.put("nombre", producto.getNombre());
                            detalleInfo.put("descripcion", producto.getDescripcion());
                            detalleInfo.put("categoria", producto.getCategoria());
                            
                            // Foto del producto/plan
                            String imagen = producto.getImagen();
                            if (imagen != null && !imagen.isBlank()) {
                                // Si es un path relativo, asegurarnos de que empiece con '/'
                                if (!imagen.startsWith("http") && !imagen.startsWith("/")) {
                                    imagen = "/" + imagen;
                                }
                            }
                            detalleInfo.put("imagen", imagen);
                        });
                        
                        detallesConFotos.add(detalleInfo);
                    }
                    
                    pedidoInfo.put("detalles", detallesConFotos);
                    pedidosConDetalles.add(pedidoInfo);
                }
                
                model.addAttribute("pedidos", pedidosConDetalles);
                System.out.println("✓ Historial de pedidos añadido al Model: " + pedidosConDetalles.size() + " pedidos");
            } else {
                System.out.println("✗ Usuario no encontrado en BD con userId: " + userId);
                return "redirect:/login";
            }
        } catch (Exception e) {
            System.out.println("✗ Error cargando usuario: " + e.getMessage());
            e.printStackTrace();
            return "redirect:/login";
        }
        
        System.out.println("=== Página /cuenta renderizada exitosamente ===\n");
        return "cuenta";
    }
}

