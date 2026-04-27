/**
 * Gestión del carrito de compras con localStorage
 * El carrito persiste incluso después de cerrar el navegador
 */

// Estructura del carrito en localStorage:
// {
//   items: [
//     { id, nombre, precio, cantidad },
//     ...
//   ]
// }

/**
 * Obtiene la clave del carrito para el usuario actual
 */
function obtenerClaveCarrito() {
    const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
    // IMPORTANTE: Solo devolver carrito si hay usuario autenticado
    // No permitir carritos anónimos
    if (!usuario) {
        console.warn('obtenerClaveCarrito: No hay usuario en localStorage');
        return null;
    }
    
    // Usar 'id' si está disponible, sino 'id_usuario'
    const usuarioId = usuario.id || usuario.id_usuario;
    
    if (!usuarioId) {
        console.warn('obtenerClaveCarrito: Usuario sin ID. Usuario:', usuario);
        return null;
    }
    
    const clave = 'carrito_usuario_' + usuarioId;
    console.log(`obtenerClaveCarrito: Clave generada: ${clave} para usuario ${usuarioId}`);
    return clave;
}

/**
 * Obtiene el carrito del localStorage o crea uno vacío
 * Solo devuelve carrito si hay usuario autenticado
 */
function obtenerCarrito() {
    const claveCarrito = obtenerClaveCarrito();
    // Si no hay usuario, no devolver carrito
    if (!claveCarrito) {
        return { items: [] };
    }
    const carrito = localStorage.getItem(claveCarrito);
    if (!carrito) {
        return { items: [] };
    }
    try {
        return JSON.parse(carrito);
    } catch (e) {
        console.error('Error al parsear carrito:', e);
        return { items: [] };
    }
}

/**
 * Guarda el carrito en localStorage con la clave del usuario y sincroniza con el backend
 */
function guardarCarrito(carrito) {
    const claveCarrito = obtenerClaveCarrito();
    // Solo guardar si hay usuario autenticado
    if (!claveCarrito) {
        console.warn('No hay usuario autenticado. No se puede guardar el carrito.');
        return;
    }
    localStorage.setItem(claveCarrito, JSON.stringify(carrito));
    actualizarContadorCarrito();
    
    // Sincronizar con backend si hay usuario autenticado
    sincronizarCarritoBackend();
}

/**
 * Agrega un producto al carrito
 * @param {number} id - ID del producto
 * @param {string} nombre - Nombre del producto
 * @param {number} precio - Precio del producto
 * @param {number} cantidad - Cantidad a agregar (default: 1)
 * @param {string} imagen - Imagen del producto
 * @param {boolean} esPlan - Indica si es un plan de gimnasio
 */
function agregarAlCarrito(id, nombre, precio, cantidad = 1, imagen = 'img/producto-default.png', esPlan = false) {
    console.log('\n=== FUNCIÓN: agregarAlCarrito() ===');
    console.log('Parámetros:', {id, nombre, precio, cantidad, imagen, esPlan});
    
    // Obtener usuario del localStorage
    const usuarioStr = localStorage.getItem('usuario');
    console.log('usuarioStr:', usuarioStr);
    
    let usuario = null;
    try {
        usuario = usuarioStr ? JSON.parse(usuarioStr) : null;
    } catch (e) {
        console.error('Error al parsear usuario:', e);
        usuario = null;
    }
    
    console.log('usuario parseado:', usuario);
    console.log('usuario.id:', usuario?.id);
    
    // Validar que hay usuario autenticado (aceptar `id` o `id_usuario`)
    const usuarioId = usuario && (usuario.id || usuario.id_usuario);
    if (!usuario || !usuarioId) {
        console.error('❌ No hay usuario autenticado. No se puede agregar al carrito.');
        console.error('Detalles: usuario=', usuario);
        mostrarAlertaCarrito('Debes iniciar sesión para usar el carrito', 'danger');
        return;
    }

    console.log(`✓ Usuario autenticado: ${usuario.nombre} (ID: ${usuarioId})`);
    
    const claveCarrito = obtenerClaveCarrito();
    console.log('claveCarrito:', claveCarrito);
    
    const carrito = obtenerCarrito();
    console.log('Carrito antes:', JSON.stringify(carrito));
    
    // Validar si es un plan y si ya hay un plan en el carrito
    if (esPlan) {
        const planExistente = carrito.items.find(item => item.esPlan === true);
        if (planExistente) {
            mostrarAlertaCarrito('¡Solo puedes tener un plan activo en el carrito a la vez!', 'warning');
            return;
        }
    }
    
    // Buscar si el producto ya existe en el carrito
    const itemExistente = carrito.items.find(item => item.id === id);
    
    if (itemExistente) {
        // En caso de planes, no deberían sumarse cantidades (1 máximo)
        if (itemExistente.esPlan) {
            mostrarAlertaCarrito('Este plan ya está en tu carrito.', 'warning');
            return;
        }
        
        // Si existe, aumentar la cantidad
        console.log(`Producto ya existe. Aumentando cantidad de ${itemExistente.cantidad} a ${itemExistente.cantidad + cantidad}`);
        itemExistente.cantidad += cantidad;
        // Update image if a new one is provided that isn't default
        if (imagen && imagen !== 'img/producto-default.png') {
            itemExistente.imagen = imagen;
        }
    } else {
        // Si no existe, agregar nuevo
        console.log('Agregando producto nuevo al carrito');
        carrito.items.push({
            id: id,
            nombre: nombre,
            precio: precio,
            cantidad: cantidad,
            imagen: imagen,
            esPlan: esPlan
        });
    }
    
    console.log('Carrito después:', JSON.stringify(carrito));
    
    guardarCarrito(carrito);
    console.log('✓ Carrito guardado en localStorage');
    
    mostrarAlertaCarrito(`${nombre} añadido al carrito`, 'success');
}

/**
 * Elimina un producto del carrito
 */
function eliminarDelCarrito(id) {
    const carrito = obtenerCarrito();
    carrito.items = carrito.items.filter(item => item.id !== id);
    guardarCarrito(carrito);
    actualizarVistaCarrito();
}

/**
 * Actualiza la cantidad de un producto en el carrito
 */
function actualizarCantidad(id, cantidad) {
    const carrito = obtenerCarrito();
    const item = carrito.items.find(item => item.id === id);
    
    if (item) {
        if (cantidad <= 0) {
            eliminarDelCarrito(id);
        } else {
            item.cantidad = cantidad;
            guardarCarrito(carrito);
            actualizarVistaCarrito();
        }
    }
}

/**
 * Calcula el total del carrito
 */
function calcularTotal() {
    const carrito = obtenerCarrito();
    return carrito.items.reduce((total, item) => total + (item.precio * item.cantidad), 0);
}

/**
 * Calcula el número total de artículos en el carrito
 */
function calcularNumeroArticulos() {
    const carrito = obtenerCarrito();
    return carrito.items.reduce((total, item) => total + item.cantidad, 0);
}

/**
 * Actualiza el contador del carrito (badge)
 * Solo muestra si hay usuario autenticado
 */
function actualizarContadorCarrito() {
    const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
    const contador = document.getElementById('contadorCarrito');
    
    // Si no hay usuario, ocultar contador
    const usuarioId = usuario && (usuario.id || usuario.id_usuario);
    if (!usuario || !usuarioId) {
        if (contador) {
            contador.style.display = 'none';
            contador.textContent = '0';
        }
        return;
    }
    
    if (contador) {
        const numero = calcularNumeroArticulos();
        contador.textContent = numero;
        contador.style.display = numero > 0 ? 'flex' : 'none';
    }
}

/**
 * Muestra una alerta al agregar/eliminar del carrito
 */
function mostrarAlertaCarrito(mensaje, tipo = 'info') {
    const alertaDiv = document.getElementById('alertaCarrito');
    if (!alertaDiv) return;
    
    const alertaHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
            <i class="bi bi-check-circle"></i> ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    
    alertaDiv.insertAdjacentHTML('beforeend', alertaHTML);
    
    // Auto-cerrar después de 3 segundos
    setTimeout(() => {
        const alerta = alertaDiv.querySelector('.alert');
        if (alerta) {
            const bsAlert = new bootstrap.Alert(alerta);
            bsAlert.close();
        }
    }, 3000);
}

/**
 * Actualiza la vista del carrito (se llama cuando se cambia contenido)
 */
function actualizarVistaCarrito() {
    actualizarContadorCarrito();
    
    // Si existe el contenedor del carrito, actualizarlo
    const cartContainer = document.getElementById('cart-items-container');
    if (cartContainer) {
        renderizarCarrito();
    }
}

/**
 * Renderiza el contenido del carrito en la página de carrito.html
 */
function renderizarCarrito() {
    const carrito = obtenerCarrito();
    const cartItemsContainer = document.getElementById('cart-items-container');
    const precioTotal = document.getElementById('precio-total');
    const checkoutDetailsContainer = document.getElementById('checkout-details-container');
    const cartSection = document.querySelector('.cart-section');
    
    // Si no estamos en la página del carrito, no hacemos nada
    if (!cartItemsContainer || !precioTotal || !checkoutDetailsContainer) {
        return;
    }
    
    console.log('renderizarCarrito: Items en carrito:', carrito.items.length);
    
    // Limpiar contenedor (manteniendo el título h1)
    const titleHtml = '<h1 class="cart-title">Tu cesta...</h1>';
    
    if (carrito.items.length === 0) {
        // Carrito vacío
        cartItemsContainer.innerHTML = titleHtml + '<p class="text-center mt-4">Tu carrito está vacío.</p>';
        precioTotal.textContent = '0.00€';
        
        // Limpiar resumen de pedido
        checkoutDetailsContainer.innerHTML = `
            <div class="detail-row">
                <span>Envío</span>
                <span class="free-shipping">GRATIS</span>
            </div>
            <div class="detail-row total">
                <span>Total</span>
                <span id="precio-total">0.00€</span>
            </div>
        `;
        return;
    }
    
    // Renderizar productos
    let itemsHtml = titleHtml;
    let resumenHtml = '';
    
    carrito.items.forEach(item => {
        const subtotal = (item.precio * item.cantidad).toFixed(2);
        const imagenUrl = item.imagen || `img/producto-default.png`; // Fallback imagen
        
        // Item del carrito (div.cart-item)
        itemsHtml += `
            <div class="cart-item">
                <img src="${imagenUrl}" alt="${item.nombre}" style="width: 80px; object-fit: cover;">
                <div class="item-info">
                    <h3>${item.nombre}</h3>
                    <div style="display: flex; align-items: center; margin-top: 10px;">
                        <button class="btn btn-sm btn-outline-secondary" onclick="actualizarCantidad(${item.id}, ${item.cantidad - 1})">-</button>
                        <span style="margin: 0 10px;">${item.cantidad}</span>
                        <button class="btn btn-sm btn-outline-secondary" onclick="actualizarCantidad(${item.id}, ${item.cantidad + 1})">+</button>
                    </div>
                </div>
                <div class="item-price">${subtotal}€</div>
                <button class="btn-remove" onclick="eliminarDelCarrito(${item.id})"><i class="fas fa-trash"></i></button>
            </div>
        `;
        
        // Fila del resumen
        resumenHtml += `
            <div class="detail-row product-summary">
                <span>${item.nombre} (x${item.cantidad})</span>
                <span>${subtotal}€</span>
            </div>
        `;
    });
    
    cartItemsContainer.innerHTML = itemsHtml;
    
    // Actualizar total
    const total = calcularTotal();
    
    // Agregar filas finales al resumen
    resumenHtml += `
        <div class="detail-row">
            <span>Envío</span>
            <span class="free-shipping">GRATIS</span>
        </div>
        <div class="detail-row total">
            <span>Total</span>
            <span id="precio-total">${total.toFixed(2)}€</span>
        </div>
    `;
    
    checkoutDetailsContainer.innerHTML = resumenHtml;
    
    console.log('renderizarCarrito: ✓ Carrito renderizado correctamente usando DIVs');
}

/**
 * Vacía todo el carrito
 */
async function vaciarCarrito() {
    const confirmed = await showCustomConfirm('¿Seguro que deseas vaciar el carrito?', 'Vaciar Carrito');
    if (confirmed) {
        console.log('Vaciando carrito...');
        
        // Usar la clave correcta del usuario
        const claveCarrito = obtenerClaveCarrito();
        console.log('Clave del carrito a vaciar:', claveCarrito);
        
        if (claveCarrito) {
            // Crear un carrito vacío
            const carritoVacio = { items: [], total: 0, cantidadItems: 0 };
            localStorage.setItem(claveCarrito, JSON.stringify(carritoVacio));
            console.log('✓ Carrito vaciado en localStorage');
        }
        
        // Vaciar también en el backend
        if (typeof vaciarCarritoBackend === 'function') {
            vaciarCarritoBackend();
        }
        
        // Actualizar la vista
        actualizarVistaCarrito();
        
        // Mostrar mensaje
        mostrarAlertaCarrito('Carrito vaciado correctamente', 'info');
        console.log('✓ Carrito vaciado completamente');
    }
}

/**
 * Sincroniza el carrito local con el backend
 */
async function sincronizarCarritoBackend() {
    const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
    
    // Si no hay usuario, no sincronizar
    if (!usuario) {
        console.warn('sincronizarCarritoBackend: No hay usuario en localStorage');
        return;
    }
    
    // Usar 'id' si está disponible, sino 'id_usuario'
    const usuarioId = usuario.id || usuario.id_usuario;
    
    if (!usuarioId) {
        console.warn('sincronizarCarritoBackend: Usuario sin ID');
        return;
    }
    
    try {
        const carrito = obtenerCarrito();
        const total = calcularTotal();
        const cantidadItems = calcularNumeroArticulos();
        
        console.log(`sincronizarCarritoBackend: Sincronizando carrito del usuario ${usuarioId}:`, carrito);
        
        const token = localStorage.getItem('jwt_token');
        const headers = {
            'Content-Type': 'application/json'
        };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(`/api/carrito/${usuarioId}/actualizar`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                contenido: JSON.stringify(carrito.items),
                cantidadItems: cantidadItems,
                total: total
            })
        });
        
        if (response.ok) {
            console.log('✓ Carrito sincronizado con el backend correctamente');
        } else {
            console.error('✗ Error del servidor al sincronizar carrito:', response.status);
        }
    } catch (error) {
        console.error('✗ Error al conectar con el servidor para sincronizar carrito:', error);
    }
}

/**
 * Carga el carrito del backend para el usuario autenticado
 */
async function cargarCarritoDelBackend() {
    const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
    
    // Si no hay usuario, no cargar
    if (!usuario) {
        console.warn('cargarCarritoDelBackend: No hay usuario en localStorage');
        return;
    }
    
    // Usar 'id' si está disponible, sino 'id_usuario'
    const usuarioId = usuario.id || usuario.id_usuario;
    
    if (!usuarioId) {
        console.warn('cargarCarritoDelBackend: Usuario sin ID. Usuario:', usuario);
        return;
    }
    
    console.log(`cargarCarritoDelBackend: Cargando carrito del backend para usuario ${usuarioId}`);
    
    try {
        const token = localStorage.getItem('jwt_token');
        const headers = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(`/api/carrito/${usuarioId}`, { headers });
        
        if (!response.ok) {
            console.error(`cargarCarritoDelBackend: Error HTTP ${response.status}`);
            return;
        }
        
        const carritoBackend = await response.json();
        console.log('cargarCarritoDelBackend: Carrito recibido del backend:', carritoBackend);
        
        let items = [];
        if (carritoBackend.contenido) {
            try {
                // El contenido podría ser un string o ya un objeto
                if (typeof carritoBackend.contenido === 'string') {
                    items = JSON.parse(carritoBackend.contenido);
                } else {
                    items = carritoBackend.contenido;
                }
                console.log('cargarCarritoDelBackend: Items parseados del backend:', items);
            } catch (e) {
                console.error('cargarCarritoDelBackend: Error al parsear contenido:', e);
                items = [];
            }
        } else {
            console.log('cargarCarritoDelBackend: Backend retornó carrito sin contenido');
            items = [];
        }
        
        // Guardar en localStorage
        const claveCarrito = obtenerClaveCarrito();
        if (claveCarrito) {
            try {
                // Comprobar si ya existe un carrito local para este usuario
                const localCarritoStr = localStorage.getItem(claveCarrito);
                let localItems = [];
                if (localCarritoStr) {
                    try {
                        const parsed = JSON.parse(localCarritoStr);
                        localItems = Array.isArray(parsed.items) ? parsed.items : [];
                    } catch (e) {
                        console.warn('cargarCarritoDelBackend: error parseando carrito local existente', e);
                        localItems = [];
                    }
                }

                // Si no hay datos en backend, preferimos conservar el local
                let mergedItems = [];

                if ((!items || items.length === 0) && localItems.length > 0) {
                    mergedItems = localItems;
                    console.log('cargarCarritoDelBackend: No hay items en backend, usando carrito local', mergedItems);
                } else if (items.length === 0 && localItems.length === 0) {
                    mergedItems = [];
                } else {
                    // Fusionar backend + local, sumando cantidades de productos iguales
                    const mapa = new Map();
                    // Añadir items del backend primero
                    items.forEach(it => {
                        const id = Number(it.id);
                        mapa.set(id, Object.assign({}, it));
                    });
                    // Mezclar con los locales (sumar cantidades)
                    localItems.forEach(it => {
                        const id = Number(it.id);
                        if (mapa.has(id)) {
                            const existing = mapa.get(id);
                            existing.cantidad = Number(existing.cantidad || 0) + Number(it.cantidad || 0);
                            mapa.set(id, existing);
                        } else {
                            mapa.set(id, Object.assign({}, it));
                        }
                    });
                    mergedItems = Array.from(mapa.values());
                    console.log('cargarCarritoDelBackend: Carrito fusionado backend+local:', mergedItems);
                }

                // Calcular totales a partir de los items fusionados
                const totalCalc = mergedItems.reduce((acc, it) => acc + (Number(it.precio || 0) * Number(it.cantidad || 0)), 0);
                const cantidadCalc = mergedItems.reduce((acc, it) => acc + Number(it.cantidad || 0), 0);

                const carrito = {
                    items: mergedItems,
                    total: carritoBackend.total || totalCalc,
                    cantidadItems: carritoBackend.cantidadItems || cantidadCalc
                };

                localStorage.setItem(claveCarrito, JSON.stringify(carrito));
                console.log('cargarCarritoDelBackend: Carrito guardado en localStorage (fusionado):', carrito);
                actualizarContadorCarrito();

                // Enviar la versión fusionada al backend para mantener todo sincronizado
                if (typeof sincronizarCarritoBackend === 'function') {
                    try {
                        await sincronizarCarritoBackend();
                        console.log('cargarCarritoDelBackend: Carrito fusionado sincronizado al backend');
                    } catch (e) {
                        console.warn('cargarCarritoDelBackend: Error sincronizando carrito fusionado al backend', e);
                    }
                }
            } catch (e) {
                console.error('cargarCarritoDelBackend: Error guardando carrito en localStorage:', e);
            }
        }
    } catch (error) {
        console.error('cargarCarritoDelBackend: Error al conectar con el servidor:', error);
    }
}

/**
 * Vacía el carrito en el backend
 */
async function vaciarCarritoBackend() {
    const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
    
    if (!usuario) {
        console.warn('vaciarCarritoBackend: No hay usuario en localStorage');
        return;
    }
    
    // Usar 'id' si está disponible, sino 'id_usuario'
    const usuarioId = usuario.id || usuario.id_usuario;
    
    if (!usuarioId) {
        console.warn('vaciarCarritoBackend: Usuario sin ID');
        return;
    }
    
    try {
        const token = localStorage.getItem('jwt_token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(`/api/carrito/${usuarioId}/vaciar`, {
            method: 'POST',
            headers: headers
        });
        
        if (!response.ok) {
            console.error('vaciarCarritoBackend: Error al vaciar carrito en backend');
        } else {
            console.log('✓ Carrito vaciado en backend correctamente');
        }
    } catch (error) {
        console.error('vaciarCarritoBackend: Error al conectar con el servidor:', error);
    }
}

/**
 * Procesa la compra: crea un pedido en el backend y vacía el carrito
 */
async function procesarCompra() {
    const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
    const carrito = obtenerCarrito();
    
    if (!usuario || !usuario.id && !usuario.id_usuario) {
        showCustomModal('Debes iniciar sesión para realizar la compra', 'Error');
        setTimeout(() => window.location.href = '/login', 2000);
        return;
    }
    
    if (carrito.items.length === 0) {
        showCustomModal('El carrito está vacío', 'Error');
        return;
    }
    
    const total = calcularTotal();
    const usuarioId = usuario.id || usuario.id_usuario;
    
    const confirmed = await showCustomConfirm(`¿Confirmar compra por €${total.toFixed(2)}?`, 'Confirmar Compra');
    if (confirmed) {
        // Preparar datos para el backend
        const crearPedidoDTO = {
            id_usuario: usuarioId,
            items: carrito.items.map(item => ({
                id: item.id,
                nombre: item.nombre,
                precio: item.precio,
                cantidad: item.cantidad,
                esPlan: item.esPlan || false
            })),
            total: total
        };
        
        console.log('Procesando compra:', crearPedidoDTO);
        
        // Llamar al endpoint para crear el pedido
        fetch('/api/pedidos/crear', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + (localStorage.getItem('jwt_token') || '')
            },
            body: JSON.stringify(crearPedidoDTO)
        })
        .then(async response => {
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Error ${response.status}`);
            }
            return response.json();
        })
        .then(pedido => {
            console.log('✓ Pedido creado exitosamente:', pedido);
            
            // Si hay un plan en el carrito, actualizar el perfil del usuario en localStorage
            const planItem = carrito.items.find(item => item.esPlan === true);
            if (planItem) {
                const usuarioActualizado = JSON.parse(localStorage.getItem('usuario') || '{}');
                usuarioActualizado.plan = planItem.nombre;
                // Fecha de expiración: 30 días desde ahora
                usuarioActualizado.fecha_expiracion_plan = Date.now() + (30 * 24 * 60 * 60 * 1000);
                localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
                console.log('✓ Plan actualizado en localStorage:', planItem.nombre);
            }
            
            // Vaciar carrito en localStorage
            const claveCarrito = obtenerClaveCarrito();
            localStorage.removeItem(claveCarrito);
            
            // Vaciar carrito en backend
            vaciarCarritoBackend();
            
            actualizarVistaCarrito();
            
            // Mostrar confirmación y redirigir al historial de pedidos
            showCustomModal(`¡Compra realizada exitosamente! Pedido #${pedido.id_pedido}`, 'Compra Exitosa');
            setTimeout(() => window.location.href = '/cuenta', 2000);
        })
        .catch(error => {
            console.error('✗ Error al procesar la compra:', error);
            showCustomModal(`Error al procesar la compra: ${error.message}`, 'Error');
        });
    }
}
