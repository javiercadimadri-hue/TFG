/**
 * App.js - Lógica del Frontend
 * Este archivo conecta los formularios HTML con tu Backend (Spring Boot)
 * usando JavaScript moderno (Fetch API y Async/Await).
 */

// 1. CONSTANTES
// Definimos la dirección donde está escuchando tu servidor Spring Boot.
const API_BASE = 'http://localhost:8080/api';

// ==========================================
// INTERCEPTOR DE FETCH PARA JWT
// ==========================================
// Interceptamos las peticiones `fetch` y añadimos el token JWT a las
// solicitudes dirigidas al backend (`/api`). Maneja casos donde `fetch`
// se llama sin objeto `init` y cuando `headers` es un objeto o Headers.
const originalFetch = window.fetch;
window.fetch = function(input, init) {
    try {
        const token = localStorage.getItem('jwt_token');

        // Determinar la URL en forma de string
        const urlStr = (typeof input === 'string') ? input : (input && input.url) || '';

        // Solo inyectar token para llamadas al API de la app
        const isApiCall = urlStr.startsWith('/api') || urlStr.includes(window.location.origin + '/api') || urlStr.includes('://localhost:8080/api');

        if (token && isApiCall) {
            init = init || {};

            // Crear headers si no existen
            if (!init.headers) init.headers = {};

            // Si es instancia de Headers
            if (typeof Headers !== 'undefined' && init.headers instanceof Headers) {
                if (!init.headers.get('Authorization')) {
                    init.headers.set('Authorization', `Bearer ${token}`);
                }
            } else {
                // headers como objeto plano
                if (!init.headers['Authorization'] && !init.headers.Authorization) {
                    init.headers['Authorization'] = `Bearer ${token}`;
                }
            }
        }
    } catch (e) {
        // No bloquear peticiones si algo falla en el interceptor
        console.error('JWT fetch interceptor error:', e);
    }

    return originalFetch.apply(this, arguments);
};

// ==========================================
// Sincronización token -> usuario (fallback)
// ==========================================
function decodeJwtPayload(token) {
    try {
        const parts = token.split('.');
        if (parts.length < 2) return null;
        const payload = parts[1];
        const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
        return JSON.parse(decodeURIComponent(escape(json)));
    } catch (e) {
        console.error('decodeJwtPayload error', e);
        return null;
    }
}

async function ensureUsuarioFromToken() {
    try {
        const usuarioJSON = localStorage.getItem('usuario');
        if (usuarioJSON && usuarioJSON !== 'null') return; // ya existe

        const token = localStorage.getItem('jwt_token');
        if (!token) return;

        const payload = decodeJwtPayload(token);
        if (!payload) return;

        // El backend añade la claim 'id' al token
        const idFromToken = payload.id || payload.userId || payload.sub || null;
        const emailFromToken = payload.email || payload.sub || null;
        if (!idFromToken) return;

        const usuarioAuto = {
            id: idFromToken,
            id_usuario: idFromToken,
            nombre: emailFromToken || 'Usuario',
            email: emailFromToken || '',
            teléfono: '',
            rol: payload.rol || 'cliente',
            foto: `/api/usuarios/${idFromToken}/foto`,
            fotoFilename: null
        };

        localStorage.setItem('usuario', JSON.stringify(usuarioAuto));
        localStorage.setItem('usuarioId', usuarioAuto.id);
        console.log('ensureUsuarioFromToken: usuario creado desde token', usuarioAuto);

        // Intentar cargar carrito del backend si la función existe
        if (typeof cargarCarritoDelBackend === 'function') {
            await cargarCarritoDelBackend();
            console.log('ensureUsuarioFromToken: carrito cargado');
        }
    } catch (e) {
        console.error('ensureUsuarioFromToken error', e);
    }
}

// 2. EVENTO PRINCIPAL
// 'DOMContentLoaded' asegura que el código JS no se ejecute hasta que 
// todo el HTML se haya cargado. Esto evita errores de "elemento no encontrado".
document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // LÓGICA DE REGISTRO
    // ==========================================
    
    // Buscamos el formulario de registro en el HTML
    const formRegistro = document.getElementById('formRegistro');
    
    // Solo ejecutamos esto si el formulario existe en la página actual
    if (formRegistro) {
        // Escuchamos el evento 'submit' (cuando le dan al botón enviar)
        formRegistro.addEventListener('submit', async (e) => {
            
            // IMPORTANTE: preventDefault() evita que la página se recargue,
            // permitiéndonos manejar el envío con JavaScript (Single Page behaviour).
            e.preventDefault();
            
            // Capturamos los valores de los inputs.
            // El símbolo '?' (optional chaining) evita errores si el input no existe.
            const nombre = document.getElementById('nombre')?.value;
            const email = document.getElementById('email')?.value;
            const contraseña = document.getElementById('contraseña')?.value;
            const teléfono = document.getElementById('teléfono')?.value || ''; // Si está vacío, enviamos cadena vacía

            // Creamos el objeto JavaScript con los datos (el DTO)
            const nuevoUsuario = {
                nombre: nombre.trim(),       // .trim() elimina espacios en blanco al inicio/final
                email: email.trim(),
                contraseña: contraseña.trim(),
                teléfono: teléfono.trim(),
                rol: 'cliente'               // Asignamos un rol por defecto
            };

            try {
                // Hacemos la petición POST al backend
                // 'await' espera a que el servidor responda antes de seguir
                const response = await fetch(`${API_BASE}/usuarios/registro`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }, // Avisamos que enviamos JSON
                    body: JSON.stringify(nuevoUsuario)               // Convertimos el objeto JS a texto JSON
                });

                // Convertimos la respuesta del servidor (JSON) a un objeto JS
                const data = await response.json();
                
                // response.ok es true si el status es 200-299
                if (response.ok) {
                    // --- ÉXITO ---
                    // Buscamos o creamos la alerta verde
                    const alertDiv = document.querySelector('.alert-success') || createAlert();
                    alertDiv.style.display = 'block';
                    alertDiv.innerHTML = '<i class="bi bi-check-circle-fill"></i> <strong>¡Excelente!</strong><br>Registro exitoso. Redirigiendo al login...';
                    
                    // Limpiamos los campos del formulario
                    formRegistro.reset();
                    
                    // Esperamos 2 segundos para que el usuario lea el mensaje y redirigimos
                    setTimeout(() => {
                        // Enviamos al usuario al login con un parámetro en la URL
                        window.location.href = '/usuarios/login?success=true';
                    }, 2000);
                } else {
                    // --- ERROR DEL SERVIDOR --- (Ej: Email ya existe)
                    mostrarError(data.error || 'Error en el registro');
                }
            } catch (error) {
                // --- ERROR DE RED --- (Ej: Servidor apagado)
                mostrarError(`Error: ${error.message}`);
            }
        });
    }
    
    // Preview al seleccionar archivo (si existe el input en la página)
    const profileInput = document.getElementById('profilePhotoInput');
    if (profileInput) {
        profileInput.addEventListener('change', (e) => {
            const file = e.target.files && e.target.files[0];
            if (!file) return;
            const preview = document.getElementById('previewFoto');
            const fotoCard = document.getElementById('fotoUsuarioCard');
            const reader = new FileReader();
            reader.onload = function(ev) {
                if (preview) { preview.src = ev.target.result; preview.style.display = 'block'; }
                if (fotoCard) { fotoCard.src = ev.target.result; fotoCard.style.display = 'block'; }
            };
            reader.readAsDataURL(file);
        });
    }
    
    // ==========================================
    // LÓGICA DE LOGIN
    // ==========================================
    
    const formLogin = document.getElementById('loginForm');
    
    if (formLogin) {
        formLogin.addEventListener('submit', async (e) => {
            e.preventDefault(); // Evitamos recarga
            
            const email = document.getElementById('email')?.value;
            const password = document.getElementById('password')?.value;

            // Objeto con las credenciales
            const credentials = {
                email: email.trim(),
                password: password.trim()
            };

            try {
                // Petición al endpoint de login
                const response = await fetch(`${API_BASE}/usuarios/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(credentials)
                });

                const data = await response.json();
                
                // Verificamos si la respuesta es OK y si el backend dice success: true
                if (response.ok && data.success) {
                    // --- LOGIN EXITOSO ---
                    
                    // *** PASO CRÍTICO ***: Guardamos al usuario en el navegador.
                    // localStorage permite que los datos persistan aunque cierres la pestaña.
                    console.log('Login exitoso. Usuario:', data.usuario);
                    console.log('Foto desde backend:', data.usuario.foto);
                    
                    // Normalizar el usuario: convertir id_usuario a id para consistencia
                    // La foto se devuelve como nombre de archivo desde backend
                    let fotoUrl = null;
                    if (data.usuario.foto && data.usuario.foto.trim() !== '') {
                        fotoUrl = `/api/usuarios/${data.usuario.id_usuario}/foto`;
                        console.log('Foto URL construida:', fotoUrl);
                    }
                    
                    const usuarioNormalizado = {
                        id: data.usuario.id_usuario,
                        id_usuario: data.usuario.id_usuario,
                        nombre: data.usuario.nombre,
                        email: data.usuario.email,
                        teléfono: data.usuario.teléfono,
                        rol: data.usuario.rol,
                        foto: fotoUrl,
                        fotoFilename: data.usuario.foto || null
                    };
                    
                    console.log('Usuario normalizado (con foto):', usuarioNormalizado);
                    localStorage.setItem('usuario', JSON.stringify(usuarioNormalizado));
                    localStorage.setItem('usuarioId', usuarioNormalizado.id);
                    
                    console.log('Llamando a cargarCarritoDelBackend después del login');
                    // Cargar el carrito del backend para este usuario
                    if (typeof cargarCarritoDelBackend === 'function') {
                        await cargarCarritoDelBackend();
                        console.log('Carrito cargado del backend');
                    } else {
                        console.error('cargarCarritoDelBackend no está disponible');
                    }
                    
                    // Feedback visual
                    const alertDiv = document.querySelector('.alert-success') || createAlert();
                    alertDiv.style.display = 'block';
                    alertDiv.innerHTML = '<i class="bi bi-check-circle-fill"></i> <strong>¡Éxito!</strong><br>Sesión iniciada. Redirigiendo...';
                    
                    formLogin.reset();
                    
                    // Redirección al panel de inicio
                    setTimeout(() => {
                        window.location.href = '/usuarios/inicio';
                    }, 1500);
                } else {
                    // Credenciales incorrectas
                    mostrarError(data.error || 'Credenciales incorrectas');
                }
            } catch (error) {
                mostrarError(`Error de conexión: ${error.message}`);
            }
        });
    }
    
    // ==========================================
    // LÓGICA DE MENSAJES ENTRE PÁGINAS
    // ==========================================
    
    // Esto sirve para detectar si venimos redirigidos del registro.
    // Lee la URL buscando: ?success=true
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
        const alertDiv = document.querySelector('.alert-success') || createAlert();
        if (alertDiv) {
            alertDiv.style.display = 'block';
            alertDiv.innerHTML = `
                <i class="bi bi-check-circle-fill"></i>
                <strong>¡Excelente!</strong><br>
                Registro completado. Sigue con tu login.
            `;
        }
    }
    
    // Actualizar navbar al cargar la página (para mostrar si el usuario está logueado)
    if (typeof actualizarNavbar === 'function') {
        actualizarNavbar();
    }
    
});

// ==========================================
// FUNCIONES AUXILIARES (HELPERS)
// ==========================================
// Estas funciones se crean aparte para no repetir código y mantenerlo limpio.

/**
 * Busca el div de alerta roja y muestra el mensaje de error.
 * Si no existe el div, lo crea.
 */
function mostrarError(mensaje) {
    let alertDiv = document.querySelector('.alert-danger');
    
    if (!alertDiv) {
        alertDiv = createAlert();
    }
    
    // Cambiamos la clase a peligro (rojo en Bootstrap)
    alertDiv.className = 'alert alert-danger';
    alertDiv.style.display = 'block';
    alertDiv.innerHTML = `
        <i class="bi bi-exclamation-triangle-fill"></i>
        <strong>Error:</strong>
        ${mensaje}
    `;
}

/**
 * Crea dinámicamente un <div> para alertas en el HTML
 * y lo inserta al principio del formulario.
 */
function createAlert() {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert'; // Clase base
    alertDiv.setAttribute('role', 'alert');
    
    // Busca dónde insertar la alerta (intenta varios contenedores posibles)
    const formContainer = document.querySelector('.login-container') || 
                          document.querySelector('.registro-container') ||
                          document.querySelector('form')?.parentElement;
    
    // Insertar antes del primer hijo del contenedor (arriba del todo)
    if (formContainer) {
        formContainer.insertBefore(alertDiv, formContainer.firstChild);
    }
    
    return alertDiv;
}

/**
 * Utilidad para recuperar el usuario guardado en localStorage.
 * Útil para saber si alguien está logueado en otras páginas.
 */
function getUsuarioAutenticado() {
    const usuarioJSON = localStorage.getItem('usuario');
    // Si existe devuelve el objeto, si no existe devuelve null
    return usuarioJSON ? JSON.parse(usuarioJSON) : null;
}

/**
 * Borra los datos del localStorage y redirige al home.
 */
async function cerrarSesion() {
    try {
        // Antes de borrar la sesión, intentar sincronizar el carrito
        if (typeof sincronizarCarritoBackend === 'function') {
            console.log('cerrarSesion: sincronizando carrito con el backend antes de cerrar sesión');
            await sincronizarCarritoBackend();
            console.log('cerrarSesion: sincronización completada');
        }
    } catch (e) {
        console.error('cerrarSesion: error sincronizando carrito:', e);
    }

    // Borrar credenciales/usuario
    localStorage.removeItem('usuario');
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('usuarioId');
    console.log('Sesión cerrada');

    // Actualizar navbar para reflejar el logout
    if (typeof actualizarNavbar === 'function') {
        actualizarNavbar();
    }

    window.location.href = '/';
}

// No se utiliza fetch para subir la foto; el formulario HTML envía la petición