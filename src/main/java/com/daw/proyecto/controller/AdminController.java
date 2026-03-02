package com.daw.proyecto.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AdminController {

    // Mapea /admin a la página estática /admin.html
    @GetMapping("/admin")
    public String admin() {
        // Renderiza la plantilla Thymeleaf templates/admin.html
        return "admin";
    }
}
