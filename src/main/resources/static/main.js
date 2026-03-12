/**
 * main.js - Lógica principal de la aplicación
 * Gestiona la actualización del carrito en toda la aplicación
 */

document.addEventListener('DOMContentLoaded', () => {
    // Actualizar contador del carrito al cargar la página
    actualizarContadorCarrito();
    
    // Actualizar contador cada 2 segundos
    setInterval(actualizarContadorCarrito, 2000);
});
