// admin.js - Lógica del Panel de Administración

// Helper: parsear payload del JWT (base64url)
function parseJwtPayload(token) {
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length < 2) return null;
    let payload = parts[1];
    // base64url -> base64
    payload = payload.replace(/-/g, '+').replace(/_/g, '/');
    // padding
    while (payload.length % 4 !== 0) payload += '=';
    try {
        const json = atob(payload);
        return JSON.parse(json);
    } catch (e) {
        console.error('Error parseando JWT payload', e);
        return null;
    }
}

function ensureAdminOrRedirect() {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
        // intentar permitir si el objeto 'usuario' en localStorage indica admin
        const usuarioStr = localStorage.getItem('usuario');
        if (usuarioStr) {
            try {
                const usuarioObj = JSON.parse(usuarioStr);
                const rolUsuarioLocal = (usuarioObj.rol || usuarioObj.role || '').toString().toLowerCase();
                if (rolUsuarioLocal.includes('admin')) return true;
            } catch (e) { /* ignore */ }
        }
        window.location.href = '/usuarios/login';
        return false;
    }
    const payload = parseJwtPayload(token);
    if (!payload) {
        // si el token no contiene payload válido, intentar con localStorage.usuario
        const usuarioStr = localStorage.getItem('usuario');
        if (usuarioStr) {
            try {
                const usuarioObj = JSON.parse(usuarioStr);
                const rolUsuarioLocal = (usuarioObj.rol || usuarioObj.role || '').toString().toLowerCase();
                if (rolUsuarioLocal.includes('admin')) return true;
            } catch (e) { /* ignore */ }
        }
        window.location.href = '/usuarios/login';
        return false;
    }
    const rol = (payload.rol || payload.role || '').toString();
    if (!(rol === 'ADMIN_ROLE' || rol.toLowerCase().includes('admin'))) {
        // fallback: comprobar localStorage.usuario
        const usuarioStr = localStorage.getItem('usuario');
        if (usuarioStr) {
            try {
                const usuarioObj = JSON.parse(usuarioStr);
                const rolUsuarioLocal = (usuarioObj.rol || usuarioObj.role || '').toString().toLowerCase();
                if (rolUsuarioLocal.includes('admin')) return true;
            } catch (e) { /* ignore */ }
        }
        window.location.href = '/usuarios/login';
        return false;
    }
    return true;
}

// UI helpers
function showView(viewId) {
    document.getElementById('viewUsuarios').style.display = 'none';
    document.getElementById('viewProductos').style.display = 'none';
    document.getElementById(viewId).style.display = 'block';
}

// Fetch helpers
async function loadUsers() {
    const token = localStorage.getItem('jwt_token');
    try {
        const res = await fetch('/api/usuarios', {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        const usuarios = await res.json();
        renderUsuariosTable(usuarios);
    } catch (e) {
        console.error('Error cargando usuarios:', e);
    }
}

function renderUsuariosTable(usuarios) {
    const tbody = document.querySelector('#tablaUsuarios tbody');
    tbody.innerHTML = '';
    
    if (!usuarios || usuarios.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No hay usuarios registrados</td></tr>';
        return;
    }
    
    usuarios.forEach(u => {
        const tr = document.createElement('tr');
        const rolBadge = u.rol && u.rol.toLowerCase().includes('admin') ? '<span class="badge bg-danger">ADMIN</span>' : '<span class="badge bg-secondary">USER</span>';
        tr.innerHTML = `
            <td>${u.id_usuario}</td>
            <td>${u.nombre}</td>
            <td>${u.email}</td>
            <td>${rolBadge}</td>
            <td>
                <button class="btn btn-outline-primary btn-sm" onclick="editarUsuario(${u.id_usuario})"><i class="bi bi-pencil"></i> Editar</button>
                <button class="btn btn-danger btn-sm" onclick="deleteUser(${u.id_usuario})"><i class="bi bi-trash"></i> Eliminar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

async function deleteUser(id) {
    const token = localStorage.getItem('jwt_token');
    if (!confirm('¿Eliminar este usuario?')) return;
    
    try {
        const res = await fetch(`/api/usuarios/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + token }
        });
        if (res.ok) {
            loadUsers();
            mostrarExitoUsuario('Usuario eliminado');
        }
    } catch (e) {
        console.error('Error eliminando usuario:', e);
        mostrarErrorUsuario('Error eliminando usuario');
    }
}

async function saveUsuario(usuario) {
    const token = localStorage.getItem('jwt_token');
    try {
        const url = usuario.id_usuario ? `/api/usuarios/${usuario.id_usuario}` : '/api/usuarios';
        const method = usuario.id_usuario ? 'PUT' : 'POST';
        
        const res = await fetch(url, {
            method: method,
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuario)
        });
        
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || err.mensaje || 'Error guardando usuario');
        }
        
        return await res.json();
    } catch (e) {
        console.error('Error guardando usuario:', e);
        throw e;
    }
}

function crearUsuario() {
    document.getElementById('formUsuario').reset();
    document.getElementById('inputIdUsuario').value = '';
    document.getElementById('modalUsuarioTitle').textContent = 'Crear Nuevo Usuario';
    document.getElementById('inputPasswordUsuario').required = true;
    const modal = new bootstrap.Modal(document.getElementById('modalUsuario'));
    modal.show();
}

async function editarUsuario(id) {
    const token = localStorage.getItem('jwt_token');
    try {
        const res = await fetch(`/api/usuarios/${id}`, {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        const usuario = await res.json();
        
        document.getElementById('inputIdUsuario').value = usuario.id_usuario;
        document.getElementById('inputNombreUsuario').value = usuario.nombre;
        document.getElementById('inputEmailUsuario').value = usuario.email;
        document.getElementById('inputTelefonoUsuario').value = usuario.teléfono || '';
        document.getElementById('inputRolUsuario').value = usuario.rol || 'cliente';
        document.getElementById('inputPasswordUsuario').value = '';
        document.getElementById('inputPasswordUsuario').required = false;
        
        document.getElementById('modalUsuarioTitle').textContent = 'Editar Usuario';
        const modal = new bootstrap.Modal(document.getElementById('modalUsuario'));
        modal.show();
    } catch (e) {
        console.error('Error cargando usuario:', e);
        mostrarErrorUsuario('Error cargando usuario');
    }
}

function mostrarErrorUsuario(msg) {
    alert('Error: ' + msg);
}

function mostrarExitoUsuario(msg) {
    alert('✓ ' + msg);
}

async function loadProducts() {
    const token = localStorage.getItem('jwt_token');
    try {
        const res = await fetch('/api/productos', {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        const productos = await res.json();
        renderProductosTable(productos);
    } catch (e) {
        console.error('Error cargando productos:', e);
        mostrarErrorProducto('Error cargando productos');
    }
}

function renderProductosTable(productos) {
    const tbody = document.querySelector('#tablaProductos tbody');
    tbody.innerHTML = '';
    
    if (!productos || productos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No hay productos registrados</td></tr>';
        return;
    }
    
    productos.forEach(p => {
        const tr = document.createElement('tr');
        const imageUrl = p.imagen ? `/api/productos/${p.id_producto}/imagen` : '/static/img-placeholder.png';
        tr.innerHTML = `
            <td><img src="${imageUrl}" alt="${p.nombre}" onerror="this.src='/static/img-placeholder.png'"></td>
            <td>${p.nombre}</td>
            <td>${p.precio.toFixed(2)}€</td>
            <td><span class="badge ${p.stock > 0 ? 'bg-success' : 'bg-danger'}">${p.stock}</span></td>
            <td>
                <button class="btn btn-outline-primary btn-sm" onclick="editarProducto(${p.id_producto})"><i class="bi bi-pencil"></i> Editar</button>
                <button class="btn btn-danger btn-sm" onclick="eliminarProducto(${p.id_producto})"><i class="bi bi-trash"></i> Eliminar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

async function saveProduct(product) {
    const token = localStorage.getItem('jwt_token');
    try {
        const url = product.id_producto ? `/api/productos/${product.id_producto}` : '/api/productos';
        const method = product.id_producto ? 'PUT' : 'POST';
        
        const res = await fetch(url, {
            method: method,
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        });
        
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || 'Error guardando producto');
        }
        
        return await res.json();
    } catch (e) {
        console.error('Error guardando producto:', e);
        throw e;
    }
}

async function eliminarProducto(id) {
    const token = localStorage.getItem('jwt_token');
    if (!confirm('¿Eliminar este producto?')) return;
    
    try {
        const res = await fetch(`/api/productos/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + token }
        });
        if (res.ok) {
            loadProducts();
            mostrarExitoProducto('Producto eliminado');
        }
    } catch (e) {
        console.error('Error eliminando producto:', e);
        mostrarErrorProducto('Error eliminando producto');
    }
}

function editarProducto(id) {
    const token = localStorage.getItem('jwt_token');
    fetch(`/api/productos/${id}`, {
        headers: { 'Authorization': 'Bearer ' + token }
    })
    .then(res => res.json())
    .then(producto => {
        document.getElementById('inputIdProducto').value = producto.id_producto;
        document.getElementById('inputNombreProducto').value = producto.nombre;
        document.getElementById('inputDescripcionProducto').value = producto.descripcion;
        document.getElementById('inputPrecioProducto').value = producto.precio;
        document.getElementById('inputStockProducto').value = producto.stock;
        document.getElementById('inputCategoriaProducto').value = producto.categoria;
        document.getElementById('inputImagenProducto').value = ''; // No se puede prellenar archivos por seguridad
        
        document.getElementById('modalProductoTitle').textContent = 'Editar Producto';
        const modal = new bootstrap.Modal(document.getElementById('modalProducto'));
        modal.show();
    })
    .catch(e => {
        console.error('Error cargando producto:', e);
        mostrarErrorProducto('Error cargando producto');
    });
}

function mostrarErrorProducto(msg) {
    alert(msg);
}

function mostrarExitoProducto(msg) {
    alert(msg);
}

// Eventos UI
document.addEventListener('DOMContentLoaded', () => {
    if (!ensureAdminOrRedirect()) return;

    // Inicializar vistas
    document.getElementById('btnUsuarios').addEventListener('click', () => {
        showView('viewUsuarios');
        loadUsers();
    });
    document.getElementById('btnProductos').addEventListener('click', () => {
        showView('viewProductos');
        loadProducts();
    });
    
    // Botón para crear nuevo usuario
    document.getElementById('btnAddUsuario').addEventListener('click', () => {
        crearUsuario();
    });
    
    // Handler para guardar usuario
    document.getElementById('formUsuario').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const id_usuario = document.getElementById('inputIdUsuario').value;
        const nombre = document.getElementById('inputNombreUsuario').value;
        const email = document.getElementById('inputEmailUsuario').value;
        const contraseña = document.getElementById('inputPasswordUsuario').value;
        const teléfono = document.getElementById('inputTelefonoUsuario').value;
        const rol = document.getElementById('inputRolUsuario').value;
        
        if (!nombre || !email || !rol) {
            mostrarErrorUsuario('Por favor completa todos los campos obligatorios');
            return;
        }
        
        // Si es creación, contraseña es obligatoria
        if (!id_usuario && !contraseña) {
            mostrarErrorUsuario('La contraseña es obligatoria para nuevos usuarios');
            return;
        }
        
        // Si es edición y la contraseña está vacía, no la incluimos
        const usuario = {
            id_usuario: id_usuario || null,
            nombre,
            email,
            teléfono,
            rol
        };
        
        if (contraseña) {
            usuario.contraseña = contraseña;
        }
        
        try {
            await saveUsuario(usuario);
            mostrarExitoUsuario('Usuario guardado correctamente');
            
            bootstrap.Modal.getInstance(document.getElementById('modalUsuario')).hide();
            loadUsers();
            document.getElementById('formUsuario').reset();
        } catch (e) {
            mostrarErrorUsuario('Error al guardar: ' + e.message);
        }
    });
    
    document.getElementById('btnAddProducto').addEventListener('click', () => {
        // Limpiar formulario y abrir modal en modo creación
        document.getElementById('formProducto').reset();
        document.getElementById('inputIdProducto').value = '';
        document.getElementById('modalProductoTitle').textContent = 'Crear Nuevo Producto';
        const modal = new bootstrap.Modal(document.getElementById('modalProducto'));
        modal.show();
    });

    // Handler para guardar producto
    document.getElementById('formProducto').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const id_producto = document.getElementById('inputIdProducto').value;
        const nombre = document.getElementById('inputNombreProducto').value;
        const descripcion = document.getElementById('inputDescripcionProducto').value;
        const precio = parseFloat(document.getElementById('inputPrecioProducto').value);
        const stock = parseInt(document.getElementById('inputStockProducto').value);
        const categoria = document.getElementById('inputCategoriaProducto').value;
        const imagenFile = document.getElementById('inputImagenProducto').files[0];
        
        if (!nombre || !descripcion || !precio || stock === undefined || !categoria) {
            mostrarErrorProducto('Por favor completa todos los campos obligatorios');
            return;
        }
        
        try {
            // Crear o actualizar producto
            const producto = {
                id_producto: id_producto ? parseInt(id_producto) : null,
                nombre,
                descripcion,
                precio,
                stock,
                categoria,
                imagen: null
            };
            
            const productoGuardado = await saveProduct(producto);
            
            // Si hay imagen seleccionada, subirla
            if (imagenFile) {
                const formData = new FormData();
                formData.append('file', imagenFile);
                
                const token = localStorage.getItem('jwt_token');
                const uploadRes = await fetch(`/api/productos/${productoGuardado.id_producto}/imagen`, {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                    body: formData
                });
                
                if (!uploadRes.ok) {
                    console.error('Error subiendo imagen:', uploadRes.statusText);
                }
            }
            
            mostrarExitoProducto('Producto guardado correctamente');
            
            // Cerrar modal y recargar tabla
            bootstrap.Modal.getInstance(document.getElementById('modalProducto')).hide();
            loadProducts();
            document.getElementById('formProducto').reset();
        } catch (e) {
            mostrarErrorProducto('Error al guardar: ' + e.message);
        }
    });
    document.getElementById('btnCerrarSesion').addEventListener('click', () => {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('usuario');
        window.location.href = '/usuarios/login';
    });

    // Mostrar vista por defecto
    showView('viewUsuarios');
    loadUsers();
});
