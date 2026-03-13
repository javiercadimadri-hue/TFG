// Script para actualizar toda la información del usuario en la interfaz
// VERSIÓN CORREGIDA: Obtiene datos persistentes desde la API con detalles de pedidos
document.addEventListener('DOMContentLoaded', function() {
    actualizarInformacionUsuario();
});

function actualizarInformacionUsuario() {
    try {
        const token = localStorage.getItem('authToken');
        
        if (!token) {
            console.log('No hay sesión iniciada, redirigiendo a login');
            window.location.href = '/login';
            return;
        }
        
        const usuarioJSON = localStorage.getItem('usuario');
        if (!usuarioJSON) {
            window.location.href = '/login';
            return;
        }
        
        const usuario = JSON.parse(usuarioJSON);
        const userId = usuario.id_usuario;
        
        // Configurar botón de logout
        const btnLogout = document.getElementById('btn-logout');
        if (btnLogout) {
            btnLogout.addEventListener('click', function() {
                if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
                    // Borrar localStorage
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('usuario');
                    localStorage.removeItem('jwt_token');
                    
                    // Borrar cookies
                    document.cookie = 'authToken=; path=/; max-age=0;';
                    document.cookie = 'userId=; path=/; max-age=0;';
                    
                    window.location.href = '/login';
                }
            });
        }
        
        // Actualizar nombre
        actualizarNombre(usuario.nombre || 'Usuario');
        
        // Actualizar información personal
        actualizarInformacionPersonal(usuario);
        
        // Cargar foto desde la API
        cargarFotoDesdeAPI(userId);
        
        // Cargar historial de pedidos
        cargarHistorialPedidosConDetalles(userId, token);
        
    } catch (error) {
        console.error('Error cargando información del usuario:', error);
    }
}

function cargarFotoDesdeAPI(userId) {
    console.log('Cargando foto desde API para usuario:', userId);
    
    const fotoUrl = `/api/usuarios/${userId}/foto?t=` + new Date().getTime();
    
    const fotoPerfil = document.getElementById('fotoPerfil');
    if (fotoPerfil) {
        fotoPerfil.src = fotoUrl;
        fotoPerfil.onerror = function() {
            console.warn('Error cargando foto, usando imagen predeterminada');
            this.src = '/img/default-profile.jpg';
        };
    }
}

function actualizarNombre(nombre) {
    const titleElement = document.querySelector('.profile-main-title');
    if (titleElement) titleElement.innerText = nombre;
    
    const nombreUsuarioNav = document.getElementById('nombreUsuarioNav');
    if (nombreUsuarioNav) nombreUsuarioNav.innerText = nombre;
}

function actualizarInformacionPersonal(usuario) {
    const nombreElement = document.getElementById('user-nombre');
    if (nombreElement) nombreElement.innerText = usuario.nombre || 'Usuario';
    
    const emailElement = document.getElementById('user-email');
    if (emailElement) emailElement.innerText = usuario.email || 'email@example.com';
    
    const telefonoElement = document.getElementById('user-telefono');
    if (telefonoElement) telefonoElement.innerText = usuario.teléfono || 'No registrado';
}

function cargarHistorialPedidosConDetalles(userId, token) {
    console.log('Cargando historial de pedidos para userId:', userId);
    
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
        if (pedidos && pedidos.length > 0) {
            mostrarHistorialConDetalles(pedidos, token);
        } else {
            mostrarSinPedidos();
        }
    })
    .catch(error => {
        console.error('Error al cargar pedidos:', error);
        mostrarSinPedidos();
    });
}

function mostrarSinPedidos() {
    const ordersHistory = document.getElementById('historial-pedidos') || document.querySelector('.orders-history');
    if (ordersHistory) {
        ordersHistory.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No tienes pedidos aún.</p>';
    }
}

function mostrarHistorialConDetalles(pedidos, token) {
    const ordersHistory = document.getElementById('historial-pedidos') || document.querySelector('.orders-history');
    if (!ordersHistory) return;
    
    let contenido = '<h2 class="section-title">Historial de pedidos</h2>';
    
    // Cargar detalles de todos los pedidos en paralelo
    const detallesPromesas = pedidos.map(pedido => 
        fetch(`/api/detalle-pedidos/pedido/${pedido.id_pedido}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .catch(err => {
            console.error('Error cargando detalles del pedido:', err);
            return [];
        })
        .then(detalles => {
            // Obtener información de cada producto en paralelo
            return Promise.all(detalles.map(detalle => 
                fetch(`/api/productos/${detalle.id_producto}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                })
                .then(res => res.ok ? res.json() : null)
                .then(producto => {
                    detalle.producto = producto;
                    return detalle;
                })
                .catch(err => {
                    console.error('Error cargando producto:', err);
                    return detalle;
                })
            ));
        })
    );
    
    Promise.all(detallesPromesas).then(detallesArray => {
        pedidos.forEach((pedido, index) => {
            const detalles = detallesArray[index] || [];
            const fecha = pedido.fecha_pedido ? new Date(pedido.fecha_pedido).toLocaleDateString('es-ES') : 'N/A';
            const total = parseFloat(pedido.total).toFixed(2) || '0.00';
            
            contenido += `
            <div class="order-box">
                <div class="order-top">
                    <div class="order-meta">
                        <p><strong>Nº Orden:</strong> #IF-${pedido.id_pedido}</p>
                        <p><strong>Fecha:</strong> ${fecha}</p>
                    </div>
                    <div class="order-total-price">${total}€</div>
                </div>
                <p class="products-label">Productos</p>
            `;
            
            if (detalles.length > 0) {
                detalles.forEach(detalle => {
                    const nombreProducto = detalle.producto?.nombre || 'Producto desconocido';
                    const precioUnitario = parseFloat(detalle.precio_unitario).toFixed(2) || '0.00';
                    const cantidad = detalle.cantidad || 1;
                    
                    // Obtener imagen del producto si existe
                    const imagenProducto = detalle.producto?.imagen ? `/img/${detalle.producto.imagen}` : '/img/default-product.png';
                    
                    contenido += `
                    <div class="product-row">
                        <img src="${imagenProducto}" alt="${nombreProducto}" onerror="this.src='/img/default-product.png'">
                        <span class="p-name">${nombreProducto}</span>
                        <div class="p-values-right">
                            <span class="p-qty">x${cantidad}</span>
                            <span class="p-price">${precioUnitario}€</span>
                        </div>
                    </div>
                    `;
                });
            } else {
                contenido += '<p style="color: #999; padding: 10px;">Sin productos en este pedido</p>';
            }
            
            contenido += '</div>';
        });
        
        ordersHistory.innerHTML = contenido;
    });
}

