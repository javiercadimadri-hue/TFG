/**
 * navbar.js - Gestiona la actualización del navbar según sesión
 */

function actualizarNavbar() {
    const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
    const navLogin = document.getElementById('navLogin');
    const navRegistro = document.getElementById('navRegistro');
    const navUsuarioDropdown = document.getElementById('navUsuarioDropdown');
    const nombreUsuarioNav = document.getElementById('nombreUsuarioNav');
    // Preferir elemento por id para evitar parpadeos
    const navCarrito = document.getElementById('navCarrito') || document.querySelector('.nav-link[href="/carrito"]')?.parentElement;
    // Panel de Administración - solo visible para ADMIN_ROLE
    const navAdminPanel = document.getElementById('navAdminPanel');
    
    if (usuario) {
        // Usuario logueado
        if (navLogin) navLogin.style.display = 'none';
        if (navRegistro) navRegistro.style.display = 'none';
        if (navUsuarioDropdown) navUsuarioDropdown.style.display = 'block';
        if (nombreUsuarioNav) nombreUsuarioNav.textContent = usuario.nombre;
        
        // Mostrar Panel de Administración solo si el usuario tiene rol admin (acepta 'admin' o 'ADMIN_ROLE')
        if (navAdminPanel) {
            const rolUsuario = (usuario.rol || '').toString().toLowerCase();
            if (rolUsuario.includes('admin')) {
                navAdminPanel.style.display = 'block';
            } else {
                navAdminPanel.style.display = 'none';
            }
        }
        // Mostrar foto de usuario en navbar si existe
        const fotoNav = document.getElementById('fotoUsuarioNav');
        const defaultIcon = document.getElementById('defaultUserIcon');
        if (fotoNav) {
            if (usuario.foto) {
                fotoNav.src = usuario.foto;
                fotoNav.style.display = 'inline-block';
                if (defaultIcon) defaultIcon.style.display = 'none';
            } else {
                fotoNav.style.display = 'none';
                if (defaultIcon) defaultIcon.style.display = 'inline-block';
            }
        }
        // Mostrar foto en la tarjeta de inicio si existe
        const fotoCard = document.getElementById('fotoUsuarioCard');
        if (fotoCard) {
            if (usuario.foto) {
                fotoCard.src = usuario.foto;
                fotoCard.style.display = 'block';
            } else {
                fotoCard.style.display = 'none';
            }
        }
        // Mostrar carrito
        if (navCarrito) navCarrito.style.display = 'block';
    } else {
        // Usuario no logueado
        if (navLogin) navLogin.style.display = 'block';
        if (navRegistro) navRegistro.style.display = 'block';
        if (navUsuarioDropdown) navUsuarioDropdown.style.display = 'none';
        // Ocultar carrito
        if (navCarrito) navCarrito.style.display = 'none';
        // Ocultar Panel de Administración para usuarios no logueados
        if (navAdminPanel) navAdminPanel.style.display = 'none';
        // Ocultar contador de carrito
        const contadorNav = document.getElementById('contadorCarritoNav');
        if (contadorNav) contadorNav.style.display = 'none';
    }
    
    // Actualizar contador del carrito
    actualizarContadorCarritoNavbar();
}

function actualizarContadorCarritoNavbar() {
    const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
    const contador = document.getElementById('contadorCarritoNav');
    
    // Solo mostrar contador si hay usuario autenticado
    if (!usuario) {
        if (contador) contador.style.display = 'none';
        return;
    }
    
    if (contador && typeof calcularNumeroArticulos === 'function') {
        const numero = calcularNumeroArticulos();
        contador.textContent = numero;
        contador.style.display = numero > 0 ? 'flex' : 'none';
    }
}

function cerrarSesionNav(e) {
    e.preventDefault();
    
    // Obtener usuario actual
    const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
    
    // Sincronizar carrito UNA ÚLTIMA VEZ antes de cerrar sesión
    if (usuario) {
        const usuarioId = usuario.id || usuario.id_usuario;
        if (usuarioId && typeof sincronizarCarritoBackend === 'function') {
            console.log('Sincronizando carrito antes de cerrar sesión para usuario:', usuarioId);
            sincronizarCarritoBackend();
        }
    }
    
    // Limpiar datos de sesión del usuario
    localStorage.removeItem('usuario');
    localStorage.removeItem('usuarioId');
    
    // IMPORTANTE: NO borrar el carrito del backend
    // El carrito se guarda en la BD y persistirá
    
    // Limpiar SOLO el carrito del localStorage local
    if (usuario) {
        const usuarioId = usuario.id || usuario.id_usuario;
        if (usuarioId) {
            const claveCarrito = 'carrito_usuario_' + usuarioId;
            localStorage.removeItem(claveCarrito);
            console.log('Carrito local eliminado para usuario:', usuarioId);
        }
    }
    
    console.log('Sesión cerrada. El carrito se ha guardado en la base de datos.');
    window.location.href = '/';
}

// Ejecutar al cargar
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(actualizarNavbar, 100);
    // Actualizar contador cada segundo
    setInterval(actualizarContadorCarritoNavbar, 1000);
});
