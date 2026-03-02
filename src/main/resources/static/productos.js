/**
 * productos.js - Catálogo de productos
 */

console.log('✓ productos.js cargado');

let todosProductos = [];

// Cargar productos al abrir la página
document.addEventListener('DOMContentLoaded', () => {
    console.log('✓ DOMContentLoaded');
    cargarProductos();
    
    // Event listeners para filtros
    setTimeout(() => {
        const searchInput = document.getElementById('searchInput');
        const categoriaFilter = document.getElementById('categoriaFilter');
        const btnLimpiar = document.getElementById('btnLimpiar');
        
        if (searchInput) searchInput.addEventListener('input', filtrarProductos);
        if (categoriaFilter) categoriaFilter.addEventListener('change', filtrarProductos);
        if (btnLimpiar) btnLimpiar.addEventListener('click', limpiarFiltros);
    }, 100);
});

async function cargarProductos() {
    try {
        console.log('Cargando productos...');
        const res = await fetch('/api/productos');
        
        if (!res.ok) throw new Error('Error HTTP: ' + res.status);
        
        todosProductos = await res.json();
        console.log('Productos cargados: ' + todosProductos.length);
        
        // Ordenar alfabéticamente por defecto
        todosProductos.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
        
        mostrarProductos(todosProductos);
    } catch (e) {
        console.error('Error cargando productos:', e);
        const container = document.getElementById('productosContainer');
        if (container) {
            container.innerHTML = '<div style="color: red; padding: 20px; text-align: center;">Error: ' + e.message + '</div>';
        }
    }
}

function mostrarProductos(productos) {
    const container = document.getElementById('productosContainer');
    
    if (!container) {
        console.error('productosContainer no encontrado');
        return;
    }
    
    if (!productos || productos.length === 0) {
        container.innerHTML = '<div style="color: #666; padding: 40px; text-align: center;">No hay productos</div>';
        return;
    }
    
    let html = '';
    
    productos.forEach(p => {
        const id = p.id_producto;
        const nombre = p.nombre || '';
        const precio = (p.precio || 0).toFixed(2);
        const categoria = p.categoria || '';
        const stock = p.stock || 0;
        
        // Imagen: si existe y no es URL, usar endpoint
        let imgUrl = '';
        if (p.imagen) {
            if (p.imagen.startsWith('http')) {
                imgUrl = p.imagen;
            } else {
                imgUrl = '/api/productos/' + id + '/imagen';
            }
        }
        
        html += `
            <div class="producto-card">
                <div class="producto-imagen-container">
                    <img src="${imgUrl}" alt="${nombre}" class="producto-imagen" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22280%22 height=%22280%22%3E%3Crect fill=%23e0e0e0 width=280 height=280/%3E%3Ctext x=50%25 y=50%25 text-anchor=middle dominant-baseline=middle font-size=14 fill=%23999%3ESin imagen%3C/text%3E%3C/svg%3E'" />
                </div>
                <div class="producto-info">
                    <h3 class="producto-nombre">${nombre}</h3>
                    <p class="producto-categoria"><small>${categoria}</small></p>
                    <p class="producto-precio">$${precio}</p>
                    <button class="btn-carrito" onclick="agregarAlCarrito(${id}, '${nombre.replace(/'/g, "\\'")}', ${precio})" ${stock <= 0 ? 'disabled' : ''}>
                        <i class="bi bi-cart-plus"></i> Añadir al carrito
                    </button>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function filtrarProductos() {
    const searchInput = document.getElementById('searchInput');
    const categoriaFilter = document.getElementById('categoriaFilter');
    
    const search = searchInput ? searchInput.value.toLowerCase() : '';
    const categoria = categoriaFilter ? categoriaFilter.value : '';
    
    let filtrados = todosProductos.filter(p => {
        const matchNombre = !search || p.nombre.toLowerCase().includes(search) || (p.descripcion || '').toLowerCase().includes(search);
        const matchCategoria = !categoria || p.categoria === categoria;
        return matchNombre && matchCategoria;
    });
    
    filtrados.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
    mostrarProductos(filtrados);
}

function limpiarFiltros() {
    const searchInput = document.getElementById('searchInput');
    const categoriaFilter = document.getElementById('categoriaFilter');
    
    if (searchInput) searchInput.value = '';
    if (categoriaFilter) categoriaFilter.value = '';
    
    mostrarProductos(todosProductos);
}

// Nota: agregarAlCarrito está definida en carrito.js
// Esta función se sobrescribe aquí para mantener compatibilidad con el onclick del HTML
// La lógica real está en carrito.js
