// Script para actualizar toda la información del usuario en la interfaz
// VERSIÓN MEJORADA: Obtiene datos persistentes desde la API
document.addEventListener('DOMContentLoaded', function() {
    actualizarInformacionUsuario();
});

function obtenerIdUsuarioDelToken() {
    // Intentar obtener el ID del localStorage primero
    const usuarioJSON = localStorage.getItem('usuario');
    if (usuarioJSON) {
        try {
            const usuario = JSON.parse(usuarioJSON);
            return usuario.id_usuario;
        } catch (e) {
            console.error('Error al parsear usuario del localStorage:', e);
        }
    }
    
    // Si no hay datos en localStorage, redirigir a login
    return null;
}

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
        
        // Obtener el ID del usuario
        const userId = obtenerIdUsuarioDelToken();
        if (!userId) {
            console.log('No se pudo obtener el ID del usuario');
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
        
        // Obtener datos del usuario del localStorage (para datos básicos)
        const usuarioJSON = localStorage.getItem('usuario');
        
        if (usuarioJSON) {
            const usuario = JSON.parse(usuarioJSON);
            const nombre = usuario.nombre || 'Usuario';
            
            console.log('Cargando datos del usuario:', nombre);
            
            // ===== ACTUALIZAR NOMBRE =====
            actualizarNombre(nombre);
            
            // ===== ACTUALIZAR INFORMACIÓN PERSONAL =====
            actualizarInformacionPersonal(usuario);
            
            // ===== CARGAR PLAN E INFORMACIÓN DE FOTO DESDE LA API =====
            cargarPlanYFotoDesdeAPI(userId, token);
            
            // ===== CARGAR HISTORIAL DE PEDIDOS =====
            cargarHistorialPedidos(userId, token);
        }
    } catch (error) {
        console.error('Error cargando información del usuario:', error);
    }
}

function cargarPlanYFotoDesdeAPI(userId, token) {
    console.log('Cargando plan y foto desde API para usuario:', userId);
    
    // Llamar a la nueva API que devuelve plan, fecha de expiración y foto
    fetch(`/api/usuarios/${userId}/plan-expiracion`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) throw new Error('Error al obtener plan');
        return response.json();
    })
    .then(data => {
        console.log('Datos de plan y foto obtenidos:', data);
        
        // Actualizar plan
        const planNameElement = document.getElementById('plan-name');
        if (planNameElement) {
            planNameElement.innerText = data.plan || 'Ninguno';
        }
        
        // Actualizar fecha de expiración
        const expirationElement = document.getElementById('plan-expiration-date');
        if (expirationElement) {
            if (data.fechaExpiracion) {
                const date = new Date(data.fechaExpiracion);
                expirationElement.innerText = date.toLocaleDateString('es-ES');
            } else {
                expirationElement.innerText = '--';
            }
        }
        
        // Actualizar foto desde la API GET endpoint
        const fotoFilename = data.fotoFilename;
        if (fotoFilename) {
            actualizarFotoDesdeAPI(userId, fotoFilename);
        } else {
            // Si no hay foto, mostrar por defecto
            const imgElement = document.getElementById('fotoPerfil');
            if (imgElement) {
                imgElement.src = '/img/default-profile.jpg';
            }
        }
    })
    .catch(error => {
        console.error('Error al obtener plan y foto desde API:', error);
        // Mostrar valores por defecto
        const planNameElement = document.getElementById('plan-name');
        if (planNameElement) {
            planNameElement.innerText = 'Ninguno';
        }
        
        const expirationElement = document.getElementById('plan-expiration-date');
        if (expirationElement) {
            expirationElement.innerText = '--';
        }
    });
}

function actualizarFotoDesdeAPI(userId, fotoFilename) {
    console.log('Actualizando foto desde API:', fotoFilename);
    
    const fotoUrl = `/api/usuarios/${userId}/foto?t=` + new Date().getTime();
    
    // Actualizar imagen en la página
    const fotoPerfil = document.getElementById('fotoPerfil');
    if (fotoPerfil) {
        fotoPerfil.src = fotoUrl;
        fotoPerfil.onerror = function() {
            console.warn('Error al cargar foto desde:', fotoUrl);
            this.src = '/img/default-profile.jpg';
        };
    }
    
    // Actualizar en otros lugares si existen
    const otrasImagenes = document.querySelectorAll('.user-avatar, .sidebar-avatar');
    otrasImagenes.forEach(img => {
        img.src = fotoUrl;
        img.onerror = function() {
            this.src = '/img/default-profile.jpg';
        };
    });
}

function actualizarNombre(nombre) {
    // Actualizar nombre en el título principal
    const titleElement = document.querySelector('.profile-main-title');
    if (titleElement) {
        titleElement.innerText = nombre;
    }
    
    // Actualizar en navbar si existe
    const nombreUsuarioNav = document.getElementById('nombreUsuarioNav');
    if (nombreUsuarioNav) {
        nombreUsuarioNav.innerText = nombre;
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
}

function cargarHistorialPedidos(userId, token) {
    console.log('Cargando historial de pedidos para usuario:', userId);
    
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
        // Ahora obtener detalles de cada pedido
        mostrarHistorialPedidosConDetalles(pedidos, token);
    })
    .catch(error => {
        console.log('Error al cargar pedidos:', error);
        // Mostrar mensaje si hay error
        const ordersHistory = document.querySelector('.orders-history');
        if (ordersHistory) {
            ordersHistory.innerHTML = '<p style="text-align: center; color: #999;">No tienes pedidos aún o error al cargarlos.</p>';
        }
    });
}

async function mostrarHistorialPedidosConDetalles(pedidos, token) {
    const ordersHistory = document.getElementById('historial-pedidos') || document.querySelector('.orders-history');
    if (!ordersHistory) return;
    
    if (!pedidos || pedidos.length === 0) {
        ordersHistory.innerHTML = '<h2 class="section-title">Historial de pedidos</h2><p style="text-align: center; color: #999; padding: 20px;">No tienes pedidos aún.</p>';
        return;
    }
    
    // Limpiar y empezar con el título
    let contenido = '<h2 class="section-title">Historial de pedidos</h2>';
    
    // Procesar cada pedido
    for (const pedido of pedidos) {
        try {
            // Obtener detalles del pedido
            const detallesResponse = await fetch(`/api/detalle-pedidos/pedido/${pedido.id_pedido}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            let detalles = [];
            if (detallesResponse.ok) {
                detalles = await detallesResponse.json();
            }
            
            // Obtener información de los productos
            for (let i = 0; i < detalles.length; i++) {
                try {
                    const productoResponse = await fetch(`/api/productos/${detalles[i].id_producto}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    
                    if (productoResponse.ok) {
                        const producto = await productoResponse.json();
                        detalles[i].producto = producto;
                    }
                } catch (err) {
                    console.warn('Error obteniendo producto:', err);
                }
            }
            
            // Construir el HTML del pedido
            contenido += generarHTMLPedido(pedido, detalles);
            
        } catch (error) {
            console.error('Error procesando pedido:', error);
        }
    }
    
    ordersHistory.innerHTML = contenido;
}

function generarHTMLPedido(pedido, detalles) {
    // Formatear fecha
    const fecha = new Date(pedido.fecha);
    const fechaFormato = fecha.toLocaleDateString('es-ES');
    
    // Iniciar HTML del pedido
    let html = '<div class="order-box">';
    html += '  <div class="order-top">';
    html += '    <div class="order-meta">';
    html += `      <p><strong>Nº Orden:</strong> #IF-${pedido.id_pedido}</p>`;
    html += `      <p><strong>Fecha:</strong> ${fechaFormato}</p>`;
    html += '    </div>';
    html += `    <div class="order-total-price">${pedido.total.toFixed(2)}€</div>`;
    html += '  </div>';
    html += '  <p class="products-label">Productos</p>';
    
    // Agregar productos del pedido
    if (detalles && detalles.length > 0) {
        detalles.forEach(detalle => {
            const nombreProducto = detalle.producto ? detalle.producto.nombre : `Producto ${detalle.id_producto}`;
            const precioUnitario = parseFloat(detalle.precio_unitario).toFixed(2);
            const cantidad = detalle.cantidad;
            
            html += '  <div class="product-row">';
            html += '    <img src="/img/default-product.png" alt="Producto" style="width: 50px; height: 50px;">';
            html += `    <span class="p-name">${nombreProducto}</span>`;
            html += '    <div class="p-values-right">';
            html += `      <span class="p-qty">x${cantidad}</span>`;
            html += `      <span class="p-price">${precioUnitario}€</span>`;
            html += '    </div>';
            html += '  </div>';
        });
    } else {
        html += '  <p style="color: #999;">Sin productos en este pedido.</p>';
    }
    
    html += '</div>';
    return html;
}
