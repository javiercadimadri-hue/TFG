package com.daw.proyecto.controller;

import com.daw.proyecto.dto.UsuarioDTO;
import com.daw.proyecto.service.UsuarioService;
import com.daw.proyecto.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Obtener todos los usuarios
    @GetMapping
    public List<UsuarioDTO> getAllUsuarios() {
        return usuarioService.findAll();
    }

    // Obtener usuario por ID
    @GetMapping("/{id}")
    public ResponseEntity<UsuarioDTO> getUsuarioById(@PathVariable Integer id) {
        return usuarioService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Crear usuario (desde panel admin)
    @PostMapping
    public ResponseEntity<?> createUsuario(@RequestBody UsuarioDTO usuarioDTO) {
        try {
            Map<String, String> response = new HashMap<>();

            // Limpiar espacios en blanco
            if (usuarioDTO.getNombre() != null) usuarioDTO.setNombre(usuarioDTO.getNombre().trim());
            if (usuarioDTO.getEmail() != null) usuarioDTO.setEmail(usuarioDTO.getEmail().trim());
            if (usuarioDTO.getContraseña() != null) usuarioDTO.setContraseña(usuarioDTO.getContraseña().trim());
            if (usuarioDTO.getTeléfono() != null) usuarioDTO.setTeléfono(usuarioDTO.getTeléfono().trim());

            // Validar que el email no esté registrado
            if (usuarioService.existsByEmail(usuarioDTO.getEmail())) {
                response.put("error", "El email ya está registrado en el sistema.");
                return ResponseEntity.badRequest().body(response);
            }

            // Validar que la contraseña tenga mínimo 6 caracteres
            if (usuarioDTO.getContraseña() == null || usuarioDTO.getContraseña().length() < 6) {
                response.put("error", "La contraseña debe tener mínimo 6 caracteres.");
                return ResponseEntity.badRequest().body(response);
            }

            // Encriptar la contraseña
            usuarioDTO.setContraseña(passwordEncoder.encode(usuarioDTO.getContraseña()));

            // Asignar imagen predeterminada si no se proporciona
            if (usuarioDTO.getFoto() == null || usuarioDTO.getFoto().isEmpty()) {
                usuarioDTO.setFoto("default-profile.jpg");
            }

            // Asignar rol por defecto si no se proporciona
            if (usuarioDTO.getRol() == null || usuarioDTO.getRol().isEmpty()) {
                usuarioDTO.setRol("USER_ROLE");
            }

            // Asegurar que no tiene plan por defecto
            usuarioDTO.setPlan(null);
            usuarioDTO.setFechaExpiracionPlan(null);

            // Guardar el usuario en la base de datos
            UsuarioDTO usuarioGuardado = usuarioService.save(usuarioDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(usuarioGuardado);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Error creando usuario: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Crear usuario (registro)
    @PostMapping("/registro")
    public ResponseEntity<?> registroUsuario(@RequestBody UsuarioDTO usuarioDTO) {
        try {
            Map<String, String> response = new HashMap<>();

            // Limpiar espacios en blanco
            if (usuarioDTO.getNombre() != null) usuarioDTO.setNombre(usuarioDTO.getNombre().trim());
            if (usuarioDTO.getEmail() != null) usuarioDTO.setEmail(usuarioDTO.getEmail().trim());
            if (usuarioDTO.getContraseña() != null) usuarioDTO.setContraseña(usuarioDTO.getContraseña().trim());
            if (usuarioDTO.getTeléfono() != null) usuarioDTO.setTeléfono(usuarioDTO.getTeléfono().trim());

            // Validar que el email no esté registrado
            if (usuarioService.existsByEmail(usuarioDTO.getEmail())) {
                response.put("error", "El email ya está registrado en el sistema.");
                return ResponseEntity.badRequest().body(response);
            }

            // Validar que la contraseña tenga mínimo 6 caracteres
            if (usuarioDTO.getContraseña() == null || usuarioDTO.getContraseña().length() < 6) {
                response.put("error", "La contraseña debe tener mínimo 6 caracteres.");
                return ResponseEntity.badRequest().body(response);
            }

            // Encriptar la contraseña
            usuarioDTO.setContraseña(passwordEncoder.encode(usuarioDTO.getContraseña()));

            // Asignar imagen predeterminada si no se proporciona
            if (usuarioDTO.getFoto() == null || usuarioDTO.getFoto().isEmpty()) {
                usuarioDTO.setFoto("default-profile.jpg");
            }

            // Asegurar que no tiene plan por defecto
            usuarioDTO.setPlan(null);
            usuarioDTO.setFechaExpiracionPlan(null);

            // Guardar el usuario en la base de datos
            UsuarioDTO usuarioGuardado = usuarioService.save(usuarioDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(usuarioGuardado);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Error en el registro: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String email = credentials.get("email");
            String password = credentials.get("password");
            
            email = email != null ? email.trim() : "";
            password = password != null ? password.trim() : "";
            
            System.out.println(">>> LOGIN - Email: '" + email + "'");
            
            if (email.isEmpty() || password.isEmpty()) {
                response.put("error", "Credenciales incorrectas");
                return ResponseEntity.badRequest().body(response);
            }
            
            var usuarioOptional = usuarioService.findByEmail(email);
            
            if (usuarioOptional.isPresent()) {
                UsuarioDTO usuario = usuarioOptional.get();
                String passwordEncriptada = usuario.getContraseña();
                
                System.out.println(">>> Usuario encontrado. Email: " + usuario.getEmail());
                
                // Comparer la contraseña ingresada con la encriptada
                if (passwordEncoder.matches(password, passwordEncriptada)) {
                    System.out.println(">>> LOGIN EXITOSO");
                    System.out.println(">>> Foto del usuario: " + usuario.getFoto());
                    
                    // Generar JWT
                    String token = jwtService.generateToken(usuario.getId_usuario(), usuario.getEmail());
                    
                    // Crear respuesta personalizada con el token
                    Map<String, Object> usuarioResponse = new HashMap<>();
                    usuarioResponse.put("id_usuario", usuario.getId_usuario());
                    usuarioResponse.put("nombre", usuario.getNombre());
                    usuarioResponse.put("email", usuario.getEmail());
                    usuarioResponse.put("teléfono", usuario.getTeléfono());
                    usuarioResponse.put("rol", usuario.getRol());
                    usuarioResponse.put("foto", usuario.getFoto());
                    usuarioResponse.put("plan", usuario.getPlan());
                    if (usuario.getFechaExpiracionPlan() != null) {
                        usuarioResponse.put("fecha_expiracion_plan", usuario.getFechaExpiracionPlan().getTime());
                    }
                    
                    response.put("success", true);
                    response.put("mensaje", "Login exitoso");
                    response.put("token", token);
                    response.put("usuario", usuarioResponse);
                    return ResponseEntity.ok(response);
                } else {
                    System.out.println(">>> CONTRASEÑA INCORRECTA");
                    response.put("error", "Credenciales incorrectas");
                    return ResponseEntity.badRequest().body(response);
                }
            } else {
                System.out.println(">>> USUARIO NO ENCONTRADO");
                response.put("error", "Credenciales incorrectas");
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            System.err.println(">>> ERROR EN LOGIN: " + e.getMessage());
            e.printStackTrace();
            response.put("error", "Error en el servidor: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Actualizar usuario
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUsuario(@PathVariable Integer id, @RequestBody UsuarioDTO usuarioDTO) {
        if (!usuarioService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        Map<String, String> response = new HashMap<>();
        
        try {
            // Limpiar espacios en blanco
            if (usuarioDTO.getNombre() != null) usuarioDTO.setNombre(usuarioDTO.getNombre().trim());
            if (usuarioDTO.getEmail() != null) usuarioDTO.setEmail(usuarioDTO.getEmail().trim());
            if (usuarioDTO.getContraseña() != null) usuarioDTO.setContraseña(usuarioDTO.getContraseña().trim());
            if (usuarioDTO.getTeléfono() != null) usuarioDTO.setTeléfono(usuarioDTO.getTeléfono().trim());
            
            // Si la contraseña se proporciona, validar y encriptarla
            if (usuarioDTO.getContraseña() != null && !usuarioDTO.getContraseña().isEmpty()) {
                // Validar que la contraseña tenga mínimo 6 caracteres
                if (usuarioDTO.getContraseña().length() < 6) {
                    response.put("error", "La contraseña debe tener mínimo 6 caracteres.");
                    return ResponseEntity.badRequest().body(response);
                }
                usuarioDTO.setContraseña(passwordEncoder.encode(usuarioDTO.getContraseña()));
            } else {
                // Si no se proporciona contraseña nueva, mantener la actual
                var usuarioActual = usuarioService.findById(id).get();
                usuarioDTO.setContraseña(usuarioActual.getContraseña());
            }
            
            usuarioDTO.setId_usuario(id);
            UsuarioDTO updatedUsuario = usuarioService.save(usuarioDTO);
            return ResponseEntity.ok(updatedUsuario);
        } catch (Exception e) {
            response.put("error", "Error actualizando usuario: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Eliminar usuario
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUsuario(@PathVariable Integer id) {
        if (!usuarioService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        usuarioService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Subir o actualizar foto de perfil
    @PostMapping("/{id}/foto")
    public ResponseEntity<?> subirFoto(@PathVariable Integer id, @RequestParam("file") MultipartFile file) {
        try {
            var usuarioOpt = usuarioService.findById(id);
            if (usuarioOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            if (file == null || file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "No file provided"));
            }

            String uploadsDir = System.getProperty("user.dir") + File.separator + "uploads" + File.separator;
            File dir = new File(uploadsDir);
            if (!dir.exists()) dir.mkdirs();

            UsuarioDTO usuarioDTO = usuarioOpt.get();

            // Eliminar la imagen anterior si existe
            if (usuarioDTO.getFoto() != null && !usuarioDTO.getFoto().isEmpty()) {
                Path oldFilePath = Paths.get(uploadsDir + usuarioDTO.getFoto());
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

            // Actualizar el usuario con la nueva imagen
                usuarioDTO.setFoto(filename);
                // Rellenar campos nulos con los actuales
                var usuarioActualOpt = usuarioService.findById(id);
                if (usuarioActualOpt.isPresent()) {
                    UsuarioDTO usuarioActual = usuarioActualOpt.get();
                    if (usuarioDTO.getNombre() == null) usuarioDTO.setNombre(usuarioActual.getNombre());
                    if (usuarioDTO.getEmail() == null) usuarioDTO.setEmail(usuarioActual.getEmail());
                    if (usuarioDTO.getContraseña() == null) usuarioDTO.setContraseña(usuarioActual.getContraseña());
                    if (usuarioDTO.getTeléfono() == null) usuarioDTO.setTeléfono(usuarioActual.getTeléfono());
                    if (usuarioDTO.getFecha_alta() == null) usuarioDTO.setFecha_alta(usuarioActual.getFecha_alta());
                    if (usuarioDTO.getRol() == null) usuarioDTO.setRol(usuarioActual.getRol());
                    if (usuarioDTO.getPlan() == null) usuarioDTO.setPlan(usuarioActual.getPlan());
                    if (usuarioDTO.getFechaExpiracionPlan() == null) usuarioDTO.setFechaExpiracionPlan(usuarioActual.getFechaExpiracionPlan());
                }
                usuarioService.save(usuarioDTO);

            return ResponseEntity.ok(Map.of("fotoUrl", "/api/usuarios/" + id + "/foto"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }

    // Servir foto de perfil
    @GetMapping("/{id}/foto")
    public ResponseEntity<Resource> servirFoto(@PathVariable Integer id) {
        try {
            var usuarioOpt = usuarioService.findById(id);
            if (usuarioOpt.isEmpty()) return ResponseEntity.notFound().build();

            String filename = usuarioOpt.get().getFoto();
            Path filePath = null;
            
            // Intentar cargar la foto del usuario desde la carpeta uploads
            if (filename != null && !filename.isEmpty() && !filename.equals("default-profile.jpg")) {
                Path uploadsPath = Paths.get(System.getProperty("user.dir") + File.separator + "uploads" + File.separator + filename);
                if (Files.exists(uploadsPath)) {
                    filePath = uploadsPath;
                }
            }
            
            // Si no existe la foto del usuario, usar la imagen por defecto
            if (filePath == null) {
                try {
                    // Intentar desde the classpath resources
                    org.springframework.core.io.Resource defaultResource = new org.springframework.core.io.ClassPathResource("static/default-profile.jpg");
                    if (defaultResource.exists()) {
                        filePath = defaultResource.getFile().toPath();
                    }
                } catch (Exception e) {
                    // Fallback a ruta absoluta
                    filePath = Paths.get(System.getProperty("user.dir") + File.separator + "src" + File.separator + "main" + File.separator + "resources" + File.separator + "static" + File.separator + "default-profile.jpg");
                }
            }

            if (filePath == null || !Files.exists(filePath)) {
                return ResponseEntity.notFound().build();
            }

            Resource resource = new UrlResource(filePath.toUri());
            String contentType = Files.probeContentType(filePath);
            if (contentType == null) contentType = "application/octet-stream";

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
