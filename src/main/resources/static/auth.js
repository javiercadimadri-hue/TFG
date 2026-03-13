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
        alert('Por favor, completa todos los campos requeridos (nombre, email, contraseña)');
        return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Por favor, ingresa un email válido');
        return;
    }

    // Validar contraseña (mínimo 6 caracteres)
    if (password.length < 6) {
        alert('La contraseña debe tener mínimo 6 caracteres');
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
        return response.json().then(data => ({
            ok: response.ok,
            status: response.status,
            data: data
        }));
    })
    .then(result => {
        if (result.ok || result.data.id_usuario) {
            alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
            window.location.href = '/login';
        } else {
            alert('Error en el registro: ' + (result.data.error || 'Intenta de nuevo'));
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error en la conexión. Intenta de nuevo.');
    });
}

// Función para iniciar sesión
function iniciarSesion() {
    const email = document.getElementById('email')?.value || '';
    const password = document.getElementById('password')?.value || '';

    // Validar campos requeridos
    if (!email || !password) {
        alert('Por favor, completa el email y la contraseña');
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
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('usuario', JSON.stringify(data.usuario));
            
            // Guardar token en una cookie que se envíe en todos los requests
            document.cookie = `authToken=${data.token}; path=/; max-age=${86400}; SameSite=Lax`;
            
            // Guardar ID del usuario en una cookie simple para Thymeleaf
            document.cookie = `userId=${data.usuario.id_usuario}; path=/; max-age=${86400}; SameSite=Lax`;
            
            console.log('✓ Token y userId guardados en cookie');
            console.log('✓ UserId: ' + data.usuario.id_usuario);
            
            alert('¡Bienvenido ' + data.usuario.nombre + '!');
            window.location.href = '/inicio';
        } else {
            alert('Error: ' + (data.error || 'Credenciales incorrectas'));
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error en la conexión. Intenta de nuevo.');
    });
}
