/**
 * planes.js - Lógica de la página de planes/catálogo
 */

/**
 * Maneja la compra verificando si el usuario está autenticado
 */
function manejarCompra(id, nombre, precio) {
    console.log('=== manejarCompra() llamado ===');
    console.log('ID:', id, 'Nombre:', nombre, 'Precio:', precio);
    
    // Debug: Verificar localStorage
    const usuarioStr = localStorage.getItem('usuario');
    console.log('usuarioStr en localStorage:', usuarioStr);
    
    let usuario = null;
    try {
        usuario = usuarioStr ? JSON.parse(usuarioStr) : null;
        console.log('usuario parseado:', usuario);
    } catch (e) {
        console.error('Error al parsear usuario:', e);
        usuario = null;
    }
    
    if (!usuario || !(usuario.id || usuario.id_usuario)) {
        console.warn('Usuario no autenticado o sin ID');
        console.log('usuario:', usuario);
        // Usuario no autenticado
        if (confirm('Debes iniciar sesión para añadir items al carrito. ¿Deseas hacerlo ahora?')) {
            window.location.href = '/usuarios/login';
        }
        return;
    }
    
    console.log('Usuario autenticado. ID:', usuario.id);
    console.log('Llamando a agregarAlCarrito()');
    
    // Usuario autenticado - agregar al carrito
    agregarAlCarrito(id, nombre, precio);
}

// Actualizar contador del carrito al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded: Actualizando contador del carrito');
    
    // Debug: Ver qué hay en localStorage
    const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
    console.log('Usuario en localStorage:', usuario);
    
    actualizarContadorCarrito();
});

