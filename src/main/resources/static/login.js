// Script para manejar el login de usuarios con JWT

let loginIntentando = false;
let loginListener = null;

document.addEventListener('DOMContentLoaded', function() {
    const formLogin = document.getElementById('formLogin');
    
    if (formLogin) {
        loginListener = function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('Form submitted, loginIntentando:', loginIntentando);
            
            // Evitar doble envío
            if (loginIntentando) {
                console.log('Ya se está haciendo login, ignorando clic');
                return false;
            }
            
            // Obtener los valores del formulario
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();
            
            // Validaciones de cliente
            if (!email || !password) {
                mostrarError('Por favor completa email y contraseña');
                return false;
            }
            
            if (!validarEmail(email)) {
                mostrarError('Por favor ingresa un email válido');
                return false;
            }
            
            // Hacer login
            hacerLogin(email, password);
            return false;
        };
        
        formLogin.addEventListener('submit', loginListener);
    }
});

function hacerLogin(email, password) {
    loginIntentando = true;
    
    const formLogin = document.getElementById('formLogin');
    const btnLogin = document.querySelector('.btn-login') || document.querySelector('button[type="submit"]');
    
    // Deshabilitar el formulario completo
    formLogin.style.pointerEvents = 'none';
    formLogin.style.opacity = '0.6';
    
    if (btnLogin) {
        btnLogin.disabled = true;
        btnLogin.textContent = 'Iniciando sesión...';
    }
    
    console.log('Enviando solicitud de login para:', email);
    
    fetch('/api/usuarios/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    })
    .then(response => {
        console.log('Respuesta recibida:', response.status);
        
        if (response.status === 200) {
            return response.json().then(data => ({
                success: true,
                data: data
            }));
        } else if (response.status === 400) {
            return response.json().then(data => ({
                success: false,
                error: data.error || 'Credenciales incorrectas'
            }));
        } else if (response.status === 500) {
            return response.json().then(data => ({
                success: false,
                error: 'Error en el servidor: ' + (data.error || 'Error desconocido')
            })).catch(() => ({
                success: false,
                error: 'Error interno del servidor (500)'
            }));
        } else {
            return {
                success: false,
                error: 'Error desconocido (código: ' + response.status + ')'
            };
        }
    })
    .then(resultado => {
        if (resultado.success) {
            console.log('Login exitoso:', resultado.data);
            
            // Guardar el token en localStorage
            const token = resultado.data.token;
            const usuario = resultado.data.usuario;
            
            localStorage.setItem('jwt_token', token);
            
            // Guardar el usuario como objeto (para compatibilidad con todos los JS)
            const usuarioData = {
                id: usuario.id_usuario,
                id_usuario: usuario.id_usuario,
                nombre: usuario.nombre,
                email: usuario.email,
                teléfono: usuario.teléfono,
                rol: usuario.rol,
                foto: '/api/usuarios/' + usuario.id_usuario + '/foto'
            };
            localStorage.setItem('usuario', JSON.stringify(usuarioData));
            
            console.log('Token y usuario guardados en localStorage');
            
            mostrarExito('¡Login exitoso! Redirigiendo...');
            
            // Actualizar navbar inmediatamente
            if (typeof actualizarNavbar === 'function') {
                actualizarNavbar();
            }

            // Remover el listener
            formLogin.removeEventListener('submit', loginListener);

            // Intentar cargar el carrito del backend (restaurar lo que hubiese)
            // y sólo redirigir cuando termine la sincronización para evitar pérdidas.
            if (typeof cargarCarritoDelBackend === 'function') {
                cargarCarritoDelBackend()
                    .then(() => {
                        console.log('login.js: carrito restaurado, redirigiendo');
                        setTimeout(() => { window.location.href = '/usuarios/inicio'; }, 800);
                    })
                    .catch((e) => {
                        console.warn('login.js: fallo al restaurar carrito:', e);
                        setTimeout(() => { window.location.href = '/usuarios/inicio'; }, 800);
                    });
            } else {
                // Si no existe la función, redirigimos como antes
                setTimeout(() => {
                    window.location.href = '/usuarios/inicio';
                }, 1000);
            }
        } else {
            console.error('Error en el login:', resultado.error);
            mostrarError(resultado.error);
            
            // Reiniciar el formulario
            loginIntentando = false;
            formLogin.style.pointerEvents = 'auto';
            formLogin.style.opacity = '1';
            if (btnLogin) {
                btnLogin.disabled = false;
                btnLogin.textContent = 'Iniciar Sesión';
            }
        }
    })
    .catch(error => {
        console.error('Error de red completo:', error);
        mostrarError('Error al conectar con el servidor: ' + error.message);
        
        // Reiniciar el formulario
        loginIntentando = false;
        formLogin.style.pointerEvents = 'auto';
        formLogin.style.opacity = '1';
        if (btnLogin) {
            btnLogin.disabled = false;
            btnLogin.textContent = 'Iniciar Sesión';
        }
    });
}

function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function mostrarError(mensaje) {
    console.error('Error:', mensaje);
    const errorDiv = document.getElementById('errorMessage') || crearElementoError();
    errorDiv.className = 'alert alert-danger';
    errorDiv.innerHTML = '<i class="bi bi-exclamation-circle"></i> ' + mensaje;
    errorDiv.style.display = 'block';
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function mostrarExito(mensaje) {
    console.log('Éxito:', mensaje);
    const errorDiv = document.getElementById('errorMessage') || crearElementoError();
    errorDiv.className = 'alert alert-success';
    errorDiv.innerHTML = '<i class="bi bi-check-circle"></i> ' + mensaje;
    errorDiv.style.display = 'block';
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function crearElementoError() {
    const div = document.createElement('div');
    div.id = 'errorMessage';
    div.style.marginBottom = '20px';
    
    // Insertar después del título
    const header = document.querySelector('.login-header') || document.querySelector('h1');
    if (header) {
        header.parentNode.insertBefore(div, header.nextSibling);
    }
    
    return div;
}
