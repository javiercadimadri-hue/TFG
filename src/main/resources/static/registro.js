// Script para manejar el registro de usuarios con JWT

let registrando = false;
let listenerAgregado = false; // Bandera para evitar agregar múltiples listeners

document.addEventListener('DOMContentLoaded', function() {
    const formRegistro = document.getElementById('formRegistro');
    
    // Evitar agregar listener múltiples veces
    if (listenerAgregado) {
        console.log('Listener ya fue agregado, saltando');
        return;
    }
    
    if (formRegistro) {
        // Remover cualquier listener anterior
        const clonedForm = formRegistro.cloneNode(true);
        formRegistro.parentNode.replaceChild(clonedForm, formRegistro);
        
        const nuevoForm = document.getElementById('formRegistro');
        
        // Agregar listener ÚNICO
        nuevoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('Form submitted, registrando:', registrando);
            
            // Evitar doble envío
            if (registrando) {
                console.log('Ya se está registrando, ignorando clic');
                return false;
            }
            
            // Obtener los valores del formulario
            const nombre = document.getElementById('nombre').value.trim();
            const email = document.getElementById('email').value.trim();
            const contraseña = document.getElementById('contraseña').value.trim();
            const teléfono = document.getElementById('teléfono').value.trim();
            
            // Validaciones de cliente
            if (!nombre || !email || !contraseña) {
                mostrarError('Por favor completa todos los campos requeridos');
                return false;
            }
            
            if (contraseña.length < 6) {
                mostrarError('La contraseña debe tener al menos 6 caracteres');
                return false;
            }
            
            if (!validarEmail(email)) {
                mostrarError('Por favor ingresa un email válido');
                return false;
            }
            
            // Enviar registro al servidor
            registrarUsuario(nombre, email, contraseña, teléfono);
            return false;
        });
        
        listenerAgregado = true;
    }
});

function registrarUsuario(nombre, email, contraseña, teléfono) {
    // Establecer bandera ANTES de hacer la solicitud
    registrando = true;
    
    const formRegistro = document.getElementById('formRegistro');
    const btnRegistrarse = document.querySelector('.btn-registrarse');
    
    // Deshabilitar el formulario completo
    formRegistro.style.pointerEvents = 'none';
    formRegistro.style.opacity = '0.6';
    
    btnRegistrarse.disabled = true;
    btnRegistrarse.textContent = 'Registrando...';
    
    console.log('Enviando solicitud de registro para:', email);
    
    fetch('/api/usuarios/registro', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nombre: nombre,
            email: email,
            contraseña: contraseña,
            teléfono: teléfono,
            foto: 'default-profile.jpg'
        })
    })
    .then(response => {
        console.log('Respuesta recibida:', response.status);
        
        return response.json().then(data => {
            if (response.status === 201) {
                return { success: true, data: data };
            } else if (response.status === 400) {
                return { success: false, error: data.error || 'Error en el registro' };
            } else {
                return { success: false, error: 'Error desconocido en el servidor (código: ' + response.status + ')' };
            }
        });
    })
    .then(resultado => {
        console.log('Resultado del registro:', resultado);
        
        if (resultado.success) {
            console.log('Usuario registrado exitosamente:', resultado.data);
            mostrarExito('¡Registro exitoso! Redirigiendo al login...');
            
            // Esperar a que se muestre el mensaje de éxito antes de redirigir
            setTimeout(() => {
                window.location.href = '/usuarios/login';
            }, 2000);
        } else {
            console.error('Error en el registro:', resultado.error);
            mostrarError(resultado.error);
            
            // Reiniciar el formulario
            registrando = false;
            formRegistro.style.pointerEvents = 'auto';
            formRegistro.style.opacity = '1';
            btnRegistrarse.disabled = false;
            btnRegistrarse.textContent = 'Crear Cuenta';
        }
    })
    .catch(error => {
        console.error('Error de red:', error);
        mostrarError('Error al conectar con el servidor: ' + error.message);
        
        // Reiniciar el formulario
        registrando = false;
        formRegistro.style.pointerEvents = 'auto';
        formRegistro.style.opacity = '1';
        btnRegistrarse.disabled = false;
        btnRegistrarse.textContent = 'Crear Cuenta';
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
    const header = document.querySelector('.registro-header');
    if (header) {
        header.parentNode.insertBefore(div, header.nextSibling);
    }
    
    return div;
}
