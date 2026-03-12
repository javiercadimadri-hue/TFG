document.addEventListener('DOMContentLoaded', () => {
    // Cargar datos del usuario desde localStorage
    const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');

    if (!usuario) {
        // Si no hay usuario, redirigir a login
        window.location.href = '/usuarios/login';
        return;
    }

    // Mostrar datos del usuario
    const mensajeBienvenida = document.getElementById('mensajeBienvenida');
    if (mensajeBienvenida) {
        mensajeBienvenida.innerHTML = `Hola <strong>${usuario.nombre}</strong>, te has conectado exitosamente a tu cuenta.`;
    }

    const nombreUsuarioEl = document.getElementById('nombreUsuario');
    const emailUsuarioEl = document.getElementById('emailUsuario');
    const telefonoUsuarioEl = document.getElementById('telefonoUsuario');
    const rolUsuarioEl = document.getElementById('rolUsuario');

    if (nombreUsuarioEl) nombreUsuarioEl.textContent = usuario.nombre || '-';
    if (emailUsuarioEl) emailUsuarioEl.textContent = usuario.email || '-';
    if (telefonoUsuarioEl) telefonoUsuarioEl.textContent = usuario.teléfono || 'No registrado';
    if (rolUsuarioEl) rolUsuarioEl.textContent = usuario.rol || 'cliente';

    // Mostrar foto de perfil guardada (si existe)
    const fotoCard = document.getElementById('fotoUsuarioCard');
    const preview = document.getElementById('previewFoto');
    const viewBtn = document.getElementById('viewFotoBtn');
    
    console.log('usuario.foto desde localStorage:', usuario.foto);
    
    if (usuario.foto) {
        console.log('Cargando foto desde URL:', usuario.foto);
        if (fotoCard) {
            fotoCard.src = usuario.foto;
            fotoCard.style.display = 'block';
            fotoCard.onerror = function() {
                console.error('Error cargando foto desde:', usuario.foto);
                // Mostrar foto por defecto si hay error
                this.src = '/default-profile.jpg';
            };
        }
        if (preview) {
            preview.src = usuario.foto;
            preview.style.display = 'block';
            preview.onerror = function() {
                this.src = '/default-profile.jpg';
            };
        }
        if (viewBtn) {
            viewBtn.style.display = 'inline-block';
            viewBtn.dataset.url = usuario.foto;
        }
    } else {
        console.log('No hay foto en localStorage para este usuario');
        // Mostrar foto por defecto
        if (fotoCard) {
            fotoCard.src = '/default-profile.jpg';
            fotoCard.style.display = 'block';
        }
    }

    // Manejar formulario de subida: fijar action a la API REST y previsualizar
    const form = document.getElementById('uploadForm');
    const input = document.getElementById('profilePhotoInput');

    if (form && input) {
        const cancelBtn = document.getElementById('cancelFotoBtn');
        const viewBtn = document.getElementById('viewFotoBtn');
        form.addEventListener('submit', async function (e) {
            e.preventDefault();
            const usuarioLocal = JSON.parse(localStorage.getItem('usuario') || 'null');
            if (!usuarioLocal) {
                alert('Debes iniciar sesión para subir una foto.');
                return;
            }
            const id = usuarioLocal.id || usuarioLocal.id_usuario;
            if (!id) {
                alert('ID de usuario no disponible.');
                return;
            }

            const file = input.files && input.files[0];
            if (!file) {
                alert('Selecciona un archivo primero.');
                return;
            }

            const fd = new FormData();
            fd.append('file', file);

            try {
                const resp = await fetch(`/api/usuarios/${id}/foto`, { method: 'POST', body: fd });
                if (!resp.ok) {
                    const err = await resp.json().catch(() => ({}));
                    alert('Error subiendo la imagen: ' + (err.error || resp.status));
                    return;
                }
                const data = await resp.json();
                // data.fotoUrl expected
                const fotoUrl = data.fotoUrl || `/api/usuarios/${id}/foto`;

                // Actualizar localStorage
                usuarioLocal.foto = fotoUrl;
                localStorage.setItem('usuario', JSON.stringify(usuarioLocal));

                // Mostrar preview desde servidor (asegura que la URL servida exista)
                if (preview) {
                    preview.src = fotoUrl;
                    preview.style.display = 'block';
                }
                if (viewBtn) { viewBtn.style.display = 'inline-block'; viewBtn.dataset.url = fotoUrl; }
                // Actualizar tarjeta y navbar si existen
                const fotoCard = document.getElementById('fotoUsuarioCard');
                if (fotoCard) { fotoCard.src = fotoUrl; fotoCard.style.display = 'block'; }
                if (typeof actualizarNavbar === 'function') actualizarNavbar();

                // Limpiar input (muestra "Ningún archivo seleccionado")
                input.value = '';

                // Ocultar el botón cancelar ya que no hay selección
                if (cancelBtn) cancelBtn.style.display = 'none';

                alert('Foto subida correctamente');
            } catch (e) {
                console.error('Upload error', e);
                alert('Error subiendo la imagen');
            }
        });

        input.addEventListener('change', function () {
            const file = this.files && this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    preview.src = e.target.result;
                    preview.style.display = 'block';
                    if (viewBtn) { viewBtn.style.display = 'none'; }
                    if (cancelBtn) { cancelBtn.style.display = 'inline-block'; }
                };
                reader.readAsDataURL(file);
            } else {
                preview.src = '';
                preview.style.display = 'none';
                if (cancelBtn) cancelBtn.style.display = 'none';
            }
        });
        // Cancelar selección
        if (cancelBtn) {
            cancelBtn.addEventListener('click', (e) => {
                e.preventDefault();
                input.value = '';
                if (preview) { preview.src = ''; preview.style.display = 'none'; }
                cancelBtn.style.display = 'none';
            });
            // ocultar por defecto hasta que haya selección
            cancelBtn.style.display = 'none';
        }

        // Ver foto en nueva pestaña
        if (viewBtn) {
            viewBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const url = viewBtn.dataset.url;
                if (url) window.open(url, '_blank');
            });
            viewBtn.style.display = 'none';
        }
    }
    
    // Cargar pedidos automáticamente
    cargarPedidosAutomaticamente();
});

/**
 * Carga los pedidos automáticamente cuando carga la página
 */
async function cargarPedidosAutomaticamente() {
    const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
    
    if (!usuario || !usuario.id && !usuario.id_usuario) {
        console.log('No hay usuario, saltando carga de pedidos');
        return;
    }
    
    const usuarioId = usuario.id || usuario.id_usuario;
    
    try {
        const token = localStorage.getItem('jwt_token');
        const headers = {
            'Authorization': 'Bearer ' + (token || '')
        };
        
        const response = await fetch(`/api/pedidos/usuario/${usuarioId}`, { headers });
        
        if (!response.ok) {
            throw new Error('Error al cargar pedidos: ' + response.status);
        }
        
        const pedidos = await response.json();
        console.log('Pedidos cargados:', pedidos);
        
        mostrarPedidos(pedidos);
        
    } catch (error) {
        console.error('Error cargando pedidos:', error);
    }
}

/**
 * Muestra los pedidos en el contenedor
 */
function mostrarPedidos(pedidos) {
    const contenedorPedidos = document.getElementById('contenedorPedidos');
    
    if (!contenedorPedidos) {
        console.error('Contenedor de pedidos no encontrado');
        return;
    }
    
    if (!pedidos || pedidos.length === 0) {
        contenedorPedidos.innerHTML = `
            <div class="sin-pedidos">
                <i class="bi bi-inbox"></i>
                <p>No tienes pedidos aún. ¡Realiza tu primer compra!</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    
    pedidos.forEach(pedido => {
        const fechaFormato = new Date(pedido.fecha).toLocaleDateString('es-ES', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        const totalFormato = parseFloat(pedido.total).toFixed(2);
        const estadoClass = pedido.estado === 'pendiente' ? 'badge-pendiente' : 'badge-completado';
        const estadoTexto = pedido.estado.charAt(0).toUpperCase() + pedido.estado.slice(1);
        
        html += `
            <div class="pedido-card">
                <div class="pedido-info">
                    <div class="pedido-numero">Pedido #${pedido.id_pedido}</div>
                    <div class="pedido-detalle">
                        <i class="bi bi-calendar3"></i> ${fechaFormato}
                    </div>
                    <div class="pedido-detalle">
                        <i class="bi bi-info-circle"></i> ${estadoTexto}
                    </div>
                    <span class="badge-estado ${estadoClass}">${estadoTexto}</span>
                </div>
                <div class="pedido-total">
                    $${totalFormato}
                </div>
            </div>
        `;
    });
    
    contenedorPedidos.innerHTML = html;
}

/**
 * Muestra los pedidos (función anterior para compatibilidad)
 */
async function mostrarMisPedidos() {
    const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
    
    if (!usuario || !usuario.id && !usuario.id_usuario) {
        alert('Debes iniciar sesión');
        window.location.href = '/usuarios/login';
        return;
    }
    
    const usuarioId = usuario.id || usuario.id_usuario;
    
    try {
        const token = localStorage.getItem('jwt_token');
        const headers = {
            'Authorization': 'Bearer ' + (token || '')
        };
        
        const response = await fetch(`/api/pedidos/usuario/${usuarioId}`, { headers });
        
        if (!response.ok) {
            throw new Error('Error al cargar pedidos: ' + response.status);
        }
        
        const pedidos = await response.json();
        mostrarPedidos(pedidos);
        
    } catch (error) {
        console.error('Error:', error);
        const contenedorPedidos = document.getElementById('contenedorPedidos');
        if (contenedorPedidos) {
            contenedorPedidos.innerHTML = `<div class="alert alert-danger">Error al cargar pedidos: ${error.message}</div>`;
        }
    }
}

/**
 * Muestra los detalles de un pedido (próximamente)
 */
async function verDetallesPedido(pedidoId) {
    alert(`Ver detalles del pedido #${pedidoId} (Próximamente)`);
    // Aquí se podría implementar una modal con los detalles del pedido
}

