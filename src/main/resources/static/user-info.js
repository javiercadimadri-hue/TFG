// Script para actualizar toda la información del usuario en la interfaz
document.addEventListener('DOMContentLoaded', function() {
    actualizarInformacionUsuario();
});

async function actualizarInformacionUsuario() {
    try {
        const token = localStorage.getItem('jwt_token');
        
        if (!token) {
            window.location.href = '/login';
            return;
        }
        
        // Configurar botón de logout
        const btnLogout = document.getElementById('btn-logout');
        if (btnLogout) {
            btnLogout.onclick = function() {
                if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
                    localStorage.removeItem('jwt_token');
                    localStorage.removeItem('usuario');
                    localStorage.removeItem('authToken');
                    window.location.href = '/login';
                }
            };
        }
        
        const usuarioJSON = localStorage.getItem('usuario');
        let usuario = usuarioJSON ? JSON.parse(usuarioJSON) : null;

        // Carga inmediata desde localStorage para evitar parpadeo
        if (usuario) {
            actualizarNombre(usuario.nombre || 'Usuario');
            actualizarFoto(usuario.foto, usuario.id_usuario);
            actualizarInformacionPersonal(usuario);
            if (usuario.id_usuario) {
                cargarHistorialPedidos(usuario.id_usuario, token);
            }
        }

        if (!usuario || !usuario.id_usuario) {
            window.location.href = '/login';
            return;
        }

        // Refrescar datos desde el servidor
        fetch(`/api/usuarios/${usuario.id_usuario}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) throw new Error('Error en servidor');
            return response.json();
        })
        .then(usuarioDB => {
            localStorage.setItem('usuario', JSON.stringify(usuarioDB));
            actualizarNombre(usuarioDB.nombre);
            actualizarFoto(usuarioDB.foto, usuarioDB.id_usuario);
            actualizarInformacionPersonal(usuarioDB);
        })
        .catch(err => console.warn('Usando datos locales:', err));

    } catch (error) {
        console.error('Error cargando información:', error);
    }
}

function actualizarNombre(nombre) {
    const elementos = document.querySelectorAll('.user-name, .profile-main-title, #user-nombre');
    elementos.forEach(el => {
        el.innerText = nombre;
    });
    
    const nombreUsuarioNav = document.getElementById('nombreUsuarioNav');
    if (nombreUsuarioNav) nombreUsuarioNav.innerText = nombre;
}

function actualizarFoto(foto, userId) {
    const fotos = document.querySelectorAll('.user-avatar, .sidebar-avatar, #fotoUsuarioNav');
    fotos.forEach(img => {
        const iconoExistente = img.parentElement.querySelector('.fa-user-circle');
        if (iconoExistente) iconoExistente.remove();
        
        if (foto && foto !== 'default-profile.jpg' && foto !== '' && foto !== null) {
            img.src = `/api/usuarios/${userId}/foto?t=` + new Date().getTime();
            img.style.display = 'inline';
        } else {
            img.src = 'img/default-profile.jpg';
        }
    });
}

function actualizarInformacionPersonal(usuario) {
    if (document.getElementById('user-email')) 
        document.getElementById('user-email').innerText = usuario.email || '---';
    
    if (document.getElementById('user-telefono')) 
        document.getElementById('user-telefono').innerText = usuario.telefono || usuario.teléfono || 'No registrado';
    
    const planElement = document.querySelector('.plan-highlight');
    if (planElement) planElement.innerText = usuario.plan || 'Ninguno';
    
    const expirationElement = document.getElementById('plan-expiration-date');
    const expirationWrapper = document.getElementById('plan-expiration-wrapper');
    
    if (expirationElement && expirationWrapper) {
        if (usuario.fechaExpiracionPlan) {
            const date = new Date(usuario.fechaExpiracionPlan);
            expirationElement.innerText = date.toLocaleDateString('es-ES');
            expirationWrapper.style.display = 'block';
        } else {
            expirationWrapper.style.display = 'none';
        }
    }
}

// --- LÓGICA DE PEDIDOS ACTUALIZADA ---

async function cargarHistorialPedidos(userId, token) {
    try {
        const response = await fetch(`/api/pedidos/usuario/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error('Error al obtener pedidos');
        const pedidos = await response.json();

        for (let pedido of pedidos) {
            try {
                const resDetalles = await fetch(`/api/detalle-pedidos/pedido/${pedido.id_pedido}`, {
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (resDetalles.ok) {
                    pedido.detalles = await resDetalles.json();
                } else {
                    pedido.detalles = [];
                }
            } catch (err) {
                console.warn(`Error en detalles del pedido ${pedido.id_pedido}:`, err);
                pedido.detalles = [];
            }
        }

        mostrarHistorialPedidos(pedidos);
    } catch (error) {
        console.error("Error historial:", error);
        const container = document.getElementById('contenedor-pedidos-js');
        if (container) container.innerHTML = '<p style="text-align: center; color: #999;">No se pudo cargar el historial.</p>';
    }
}

function mostrarHistorialPedidos(pedidos) {
    const container = document.getElementById('contenedor-pedidos-js');
    if (!container) return;
    
    if (!pedidos || pedidos.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: rgba(255,255,255,0.5); padding: 20px;">No tienes pedidos aún.</p>';
        return;
    }
    
    let html = '';
    pedidos.forEach(pedido => {
        const fecha = new Date(pedido.fecha || pedido.fecha_pedido).toLocaleDateString('es-ES');
        const estado = pedido.estado || 'Pendiente';
        
        let estadoClase = 'pending';
        if (estado.toLowerCase() === 'entregado' || estado.toLowerCase() === 'completado') {
            estadoClase = 'completed';
        } else if (estado.toLowerCase() === 'en proceso' || estado.toLowerCase() === 'procesando') {
            estadoClase = 'processing';
        }

        let productosHTML = '';
        if (pedido.detalles && pedido.detalles.length > 0) {
            pedido.detalles.forEach(item => {
                productosHTML += `
                <div class="product-row" style="display: flex; justify-content: space-between; align-items: center; padding: 10px 15px; background: rgba(255,255,255,0.03); border-radius: 10px; margin-bottom: 8px;">
                    <span class="p-name" style="color: #eee; font-size: 0.95rem;">${item.nombreProducto}</span>
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <span class="p-qty" style="color: rgba(255,255,255,0.5); font-size: 0.8rem; background: rgba(255,255,255,0.08); padding: 2px 8px; border-radius: 5px;">x${item.cantidad}</span>
                        <span class="p-price" style="color: #fff; font-weight: 600;">${item.precio_unitario.toFixed(2)}€</span>
                    </div>
                </div>`;
            });
        }

        html += `
        <div class="order-box" style="margin-bottom: 30px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; overflow: hidden; backdrop-filter: blur(10px);">
            
            <div style="padding: 20px 20px 10px 20px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <span style="display: block; font-weight: bold; font-size: 1.1rem; color: #fff; margin-bottom: 4px;">Pedido #IF-${pedido.id_pedido}</span>
                    <span style="color: rgba(255,255,255,0.4); font-size: 0.85rem;"><i class="fas fa-calendar-alt"></i> ${fecha}</span>
                </div>
                <span class="order-status-badge ${estadoClase}">${estado}</span>
            </div>

            <div style="width: calc(100% - 40px); height: 1px; background: rgba(255,255,255,0.1); margin: 5px auto 15px auto;"></div>

            <div style="padding: 0 20px 10px 20px;">
                <p style="font-size: 0.7rem; text-transform: uppercase; color: rgba(255,255,255,0.3); margin-bottom: 12px; letter-spacing: 1.2px; display: flex; align-items: center; gap: 8px;">
                    <i class="fas fa-box" style="color: #3a6ff2; font-size: 0.8rem;"></i> Resumen de productos
                </p>
                <div class="order-products">
                    ${productosHTML}
                </div>
            </div>

            <div style="width: calc(100% - 40px); height: 1px; background: rgba(255,255,255,0.1); margin: 10px auto 5px auto;"></div>

            <div style="padding: 15px 20px 20px 20px; text-align: right; display: flex; justify-content: flex-end; align-items: baseline; gap: 12px;">
                <span style="color: rgba(255,255,255,0.5); font-size: 0.9rem; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">Importe Total:</span>
                <span style="font-family: 'Oswald', sans-serif; font-size: 30px; color: #3a6ff2; font-weight: bold; line-height: 1;">
                    ${pedido.total.toFixed(2)}€
                </span>
            </div>
        </div>`;
    });
    
    container.innerHTML = html;
}