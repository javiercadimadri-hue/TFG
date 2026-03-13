// Script para actualizar toda la información del usuario en la interfaz
document.addEventListener('DOMContentLoaded', function() {
    actualizarInformacionUsuario();
});

function actualizarInformacionUsuario() {
    try {
        // Obtener token del usuario
        const token = localStorage.getItem('authToken');
        
        // Si no hay token, redirigir a login
        if (!token) {
            console.log('No hay sesión iniciada, redirigiendo a login');
            window.location.href = '/login';
            return;
        }
        
        // Configurar botón de logout
        const btnLogout = document.getElementById('btn-logout');
        if (btnLogout) {
            btnLogout.addEventListener('click', function() {
                if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('usuario');
                    localStorage.removeItem('jwt_token');
                    window.location.href = '/login';
                }
            });
        }
        
        // Obtener datos del usuario del localStorage
        const usuarioJSON = localStorage.getItem('usuario');
        
        if (usuarioJSON) {
            const usuario = JSON.parse(usuarioJSON);
            const nombre = usuario.nombre || 'Usuario';
            const foto = usuario.foto || 'default-profile.jpg';
            
            console.log('Cargando datos del usuario:', nombre);
            
            // ===== ACTUALIZAR NOMBRE =====
            actualizarNombre(nombre);
            
            // ===== ACTUALIZAR FOTO =====
            actualizarFoto(foto, usuario.id_usuario);
            
            // ===== ACTUALIZAR INFORMACIÓN PERSONAL =====
            actualizarInformacionPersonal(usuario);
            
            // ===== CARGAR HISTORIAL DE PEDIDOS =====
            cargarHistorialPedidos(usuario.id_usuario, token);
        }
    } catch (error) {
        console.error('Error cargando información del usuario:', error);
    }
}

function actualizarNombre(nombre) {
    // Actualizar nombre en todos los lugares
    const elementos = document.querySelectorAll('.user-name, .profile-main-title');
    elementos.forEach(elemento => {
        if (elemento.innerText.includes('Noelia') || elemento.innerText === 'Usuario') {
            elemento.innerText = nombre;
        }
    });
    
    // Actualizar en navbar
    const nombreUsuarioNav = document.getElementById('nombreUsuarioNav');
    if (nombreUsuarioNav) {
        nombreUsuarioNav.innerText = nombre;
    }
}

function actualizarFoto(foto, userId) {
    // Determinar si es una foto customizada (con ID) o una foto por defecto
    const fotoFinal = foto && foto !== 'null' && foto !== '' && foto !== 'default-profile.jpg' ? foto : null;
    
    // Actualizar foto en todos los lugares
    const fotos = document.querySelectorAll('.user-avatar, .sidebar-avatar, #fotoUsuarioNav');
    fotos.forEach(img => {
        // Eliminar cualquier icono de usuario existente
        const iconoExistente = img.parentElement.querySelector('.fa-user-circle');
        if (iconoExistente) {
            iconoExistente.remove();
        }
        
        if (fotoFinal && fotoFinal.includes('/foto')) {
            // Es una referencia al endpoint de foto de perfil
            img.src = `/api/usuarios/${userId}${fotoFinal.substring(fotoFinal.indexOf('/foto'))}?t=` + new Date().getTime();
            img.style.display = 'inline';
            img.style.backgroundColor = 'transparent';
        } else if (fotoFinal) {
            // Es una foto en static/img/
            img.src = '/img/' + fotoFinal + '?t=' + new Date().getTime();
            img.style.display = 'inline';
            img.style.backgroundColor = 'transparent';
        } else {
            // Si no hay foto, mostrar círculo gris con icono
            img.style.backgroundColor = '#e0e0e0';
            img.style.display = 'inline';
            img.style.borderRadius = '50%';
            img.src = ''; // Vaciar src para que no intente cargar
            img.alt = 'Sin foto de perfil';
            
            // Crear un ícono de usuario por defecto
            const icon = document.createElement('i');
            icon.className = 'fas fa-user-circle';
            icon.style.fontSize = '2rem';
            icon.style.color = '#999';
            icon.style.position = 'absolute';
            icon.style.top = '50%';
            icon.style.left = '50%';
            icon.style.transform = 'translate(-50%, -50%)';
            img.parentElement.style.position = 'relative';
            img.parentElement.appendChild(icon);
        }
    });
    
    // Ocultar icono de usuario por defecto en navbar
    const defaultUserIcon = document.getElementById('defaultUserIcon');
    if (defaultUserIcon && fotoFinal) {
        defaultUserIcon.style.display = 'none';
    } else if (defaultUserIcon) {
        defaultUserIcon.style.display = 'inline';
    }
}

function actualizarInformacionPersonal(usuario) {
    // Actualizar nombre
    const nombreElement = document.getElementById('user-nombre');
    if (nombreElement) {
        nombreElement.innerText = usuario.nombre || 'Usuario';
    }
    
    // Actualizar email
    const emailElement = document.getElementById('user-email');
    if (emailElement) {
        emailElement.innerText = usuario.email || 'email@example.com';
    }
    
    // Actualizar teléfono
    const telefonoElement = document.getElementById('user-telefono');
    if (telefonoElement) {
        telefonoElement.innerText = usuario.teléfono || 'No registrado';
    }
    
    // Actualizar plan si está disponible
    const planElement = document.querySelector('.plan-highlight');
    if (planElement) {
        planElement.innerText = usuario.plan || 'Ninguno';
    }
    
    // Actualizar fecha de expiración si está disponible
    const expirationElement = document.getElementById('plan-expiration-date');
    const expirationLabel = document.getElementById('plan-expiration-label');
    if (expirationElement && expirationLabel) {
        if (usuario.fechaExpiracionPlan) {
            const date = new Date(usuario.fechaExpiracionPlan);
            expirationElement.innerText = date.toLocaleDateString('es-ES');
            expirationElement.style.display = 'inline-block';
            expirationLabel.style.display = 'inline-block';
        } else {
            expirationElement.style.display = 'none';
            expirationLabel.style.display = 'none';
        }
    }
}

function cargarHistorialPedidos(userId, token) {
    // Obtener historial de pedidos del servidor
    fetch(`/api/pedidos/usuario/${userId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) throw new Error('Error al obtener pedidos');
        return response.json();
    })
    .then(pedidos => {
        console.log('Pedidos obtenidos:', pedidos);
        mostrarHistorialPedidos(pedidos);
    })
    .catch(error => {
        console.log('No hay historial de pedidos o error al cargar:', error);
        // Mostrar mensaje si no hay pedidos
        const ordersHistory = document.querySelector('.orders-history');
        if (ordersHistory) {
            ordersHistory.innerHTML = '<p style="text-align: center; color: #999;">No tienes pedidos aún.</p>';
        }
    });
}

function mostrarHistorialPedidos(pedidos) {
    const ordersHistory = document.getElementById('historial-pedidos') || document.querySelector('.orders-history');
    if (!ordersHistory) return;
    
    if (!pedidos || pedidos.length === 0) {
        ordersHistory.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No tienes pedidos aún.</p>';
        return;
    }
    
    // Crear tabla con los pedidos
    let contenido = '<h2 class="section-title">Historial de pedidos</h2>';
    contenido += '<table style="width: 100%; text-align: left; border-collapse: collapse;">';
    contenido += '<thead><tr style="border-bottom: 2px solid #ddd;">';
    contenido += '<th style="padding: 10px;">ID Pedido</th>';
    contenido += '<th style="padding: 10px;">Fecha</th>';
    contenido += '<th style="padding: 10px;">Estado</th>';
    contenido += '<th style="padding: 10px;">Total</th>';
    contenido += '</tr></thead><tbody>';
    
    pedidos.forEach(pedido => {
        const fechaVal = pedido.fecha || pedido.fecha_pedido; // Soporte para ambos por si acaso
        const fecha = fechaVal ? new Date(fechaVal).toLocaleDateString('es-ES') : 'N/A';
        contenido += `<tr style="border-bottom: 1px solid #eee;">`;
        contenido += `<td style="padding: 10px;">#${pedido.id_pedido}</td>`;
        contenido += `<td style="padding: 10px;">${fecha}</td>`;
        contenido += `<td style="padding: 10px;"><span style="background: #4CAF50; color: white; padding: 5px 10px; border-radius: 5px;">${pedido.estado || 'Completado'}</span></td>`;
        contenido += `<td style="padding: 10px; font-weight: bold;">€${pedido.total || '0.00'}</td>`;
        contenido += '</tr>';
    });
    
    contenido += '</tbody></table>';
    ordersHistory.innerHTML = contenido;
}

