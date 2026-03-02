package com.daw.proyecto.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.ui.Model;
import org.springframework.beans.factory.annotation.Autowired;
import com.daw.proyecto.dto.UsuarioDTO;
import com.daw.proyecto.service.UsuarioService;
import com.daw.proyecto.service.ProductosService;
import com.daw.proyecto.service.PlanesService;
import com.daw.proyecto.service.ProfesionalesService;

@Controller
public class ViewController {

    @Autowired
    private ProductosService productosService;

    @Autowired
    private PlanesService planesService;

    @Autowired
    private ProfesionalesService profesionalesService;

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
    public String mostrarCuenta(Model model) {
        return "cuenta";
    }
}
