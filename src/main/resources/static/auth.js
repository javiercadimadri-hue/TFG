// Función para mostrar mensajes en modal
function showMessageModal(message, title = 'Mensaje') {
    if (typeof showCustomModal === 'function') {
        showCustomModal(message, title);
    } else {
        alert(message);
    }
}

// Manejar el formulario de registro
document.addEventListener('DOMContentLoaded', function() {
    const registroForm = document.getElementById('registroForm');
    const loginForm = document.getElementById('loginForm');

    // Evento para formulario de registro
    if (registroForm) {
        registroForm.addEventListener('submit', function(e) {
            e.preventDefault();
            registrarUsuario();
        });
    }

    // Evento para formulario de login
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            iniciarSesion();
        });
    }
});

// Función para registrar usuario
function registrarUsuario() {
    const nombre = document.getElementById('name')?.value || '';
    const email = document.getElementById('email')?.value || '';
    const password = document.getElementById('password')?.value || '';
    const telefono = document.getElementById('phone')?.value || '';

    // Validar campos requeridos
    if (!nombre || !email || !password) {
        showMessageModal('Por favor, completa todos los campos requeridos (nombre, email, contraseña)', 'Error de Validación');
        return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessageModal('Por favor, ingresa un email válido', 'Error de Validación');
        return;
    }

    // Validar contraseña (mínimo 6 caracteres)
    if (password.length < 6) {
        showMessageModal('La contraseña debe tener mínimo 6 caracteres', 'Error de Validación');
        return;
    }

    // Crear objeto con datos del usuario
    const usuarioData = {
        nombre: nombre,
        email: email,
        contraseña: password,
        teléfono: telefono || null
    };

    // Enviar solicitud al servidor
    fetch('/api/usuarios/registro', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuarioData)
    })
    .then(response => {
        return response.json().then(data => ({ response, data }));
    })
    .then(({ response, data }) => {
        if (response.ok || data.id_usuario) {
            showMessageModal('¡Registro exitoso! Ahora puedes iniciar sesión.', 'Registro Exitoso');
            setTimeout(() => window.location.href = '/login', 2000);
        } else {
            showMessageModal('Error en el registro: ' + (data.error || 'Intenta de nuevo'), 'Error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showMessageModal('Error en la conexión. Intenta de nuevo.', 'Error');
    });
}

// Función para iniciar sesión
function iniciarSesion() {
    const email = document.getElementById('email')?.value || '';
    const password = document.getElementById('password')?.value || '';

    // Validar campos requeridos
    if (!email || !password) {
        showMessageModal('Por favor, completa el email y la contraseña', 'Error de Validación');
        return;
    }

    // Crear objeto con credenciales
    const credenciales = {
        email: email,
        password: password
    };

    // Enviar solicitud al servidor
    fetch('/api/usuarios/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credenciales)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success && data.token) {
            // Guardar token en localStorage
            localStorage.setItem('jwt_token', data.token);
            localStorage.setItem('usuario', JSON.stringify(data.usuario));
            
            showMessageModal('¡Bienvenido ' + data.usuario.nombre + '!', 'Bienvenido');
            setTimeout(() => window.location.href = '/inicio', 2000);
        } else {
            showMessageModal('Error: ' + (data.error || 'Credenciales incorrectas'), 'Error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showMessageModal('Error en la conexión. Intenta de nuevo.', 'Error');
    });
}
