/**
 * DEBUG.JS - Diagnóstico de Carrito
 * Ejecuta pruebas para verificar que todo funciona correctamente
 */

console.log('=== DEBUG.JS CARGADO ===');

// Test 1: Verificar que localStorage funciona
function testLocalStorage() {
    console.log('\n--- TEST 1: localStorage ---');
    try {
        const testKey = 'debug_test_' + Date.now();
        localStorage.setItem(testKey, 'ok');
        const value = localStorage.getItem(testKey);
        localStorage.removeItem(testKey);
        console.log('✓ localStorage funciona');
        return true;
    } catch (e) {
        console.error('✗ localStorage no funciona:', e);
        return false;
    }
}

// Test 2: Verificar funciones disponibles
function testFuncionesDisponibles() {
    console.log('\n--- TEST 2: Funciones Disponibles ---');
    const funciones = [
        'obtenerClaveCarrito',
        'obtenerCarrito',
        'guardarCarrito',
        'agregarAlCarrito',
        'sincronizarCarritoBackend',
        'cargarCarritoDelBackend',
        'actualizarContadorCarrito'
    ];
    
    funciones.forEach(fn => {
        if (typeof window[fn] === 'function') {
            console.log(`✓ ${fn} disponible`);
        } else {
            console.error(`✗ ${fn} NO disponible`);
        }
    });
}

// Test 3: Verificar usuario en localStorage
function testUsuario() {
    console.log('\n--- TEST 3: Usuario en localStorage ---');
    const usuarioStr = localStorage.getItem('usuario');
    if (!usuarioStr) {
        console.warn('⚠ No hay usuario en localStorage (esto es normal si no estás logueado)');
        return false;
    }
    
    try {
        const usuario = JSON.parse(usuarioStr);
        console.log('✓ Usuario parseado correctamente:', usuario);
        return usuario;
    } catch (e) {
        console.error('✗ Error al parsear usuario:', e);
        return false;
    }
}

// Test 4: Verificar carrito en localStorage
function testCarritoLocalStorage() {
    console.log('\n--- TEST 4: Carrito en localStorage ---');
    const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
    
    if (!usuario || !usuario.id) {
        console.warn('⚠ No hay usuario logueado. El carrito será vacío.');
        return null;
    }
    
    const claveCarrito = 'carrito_usuario_' + usuario.id;
    const carritoStr = localStorage.getItem(claveCarrito);
    
    if (!carritoStr) {
        console.log('⚠ No hay carrito en localStorage (está vacío)');
        return null;
    }
    
    try {
        const carrito = JSON.parse(carritoStr);
        console.log('✓ Carrito en localStorage:', carrito);
        return carrito;
    } catch (e) {
        console.error('✗ Error al parsear carrito:', e);
        return false;
    }
}

// Test 5: Simular agregar al carrito
async function testAgregarAlCarrito() {
    console.log('\n--- TEST 5: Agregar al Carrito (SIMULACIÓN) ---');
    
    const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
    if (!usuario || !usuario.id) {
        console.warn('⚠ No hay usuario logueado. Por favor, inicia sesión primero.');
        return false;
    }
    
    console.log(`Simulando agregar producto al carrito del usuario ${usuario.id}`);
    
    // Obtener carrito antes
    let carritoBefore = obtenerCarrito();
    console.log('Carrito ANTES:', carritoBefore);
    
    // Agregar producto
    agregarAlCarrito(1, 'Producto Test', 19.99, 1);
    
    // Obtener carrito después
    let carritoAfter = obtenerCarrito();
    console.log('Carrito DESPUÉS:', carritoAfter);
    
    if (carritoAfter.items.length > carritoBefore.items.length) {
        console.log('✓ Producto AGREGADO correctamente');
        return true;
    } else {
        console.error('✗ Producto NO fue agregado');
        return false;
    }
}

// Test 6: Verificar sincronización con backend
async function testSincronizacion() {
    console.log('\n--- TEST 6: Sincronización con Backend ---');
    
    const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
    if (!usuario || !usuario.id) {
        console.warn('⚠ No hay usuario logueado.');
        return false;
    }
    
    console.log(`Verificando GET /api/carrito/${usuario.id}`);
    
    try {
        const response = await fetch(`/api/carrito/${usuario.id}`);
        console.log(`Response status: ${response.status}`);
        
        if (!response.ok) {
            console.error(`✗ Error del servidor: ${response.status}`);
            return false;
        }
        
        const data = await response.json();
        console.log('✓ Carrito recibido del backend:', data);
        return data;
    } catch (error) {
        console.error('✗ Error de conexión:', error);
        return false;
    }
}

// FUNCIÓN MAESTRA QUE EJECUTA TODOS LOS TESTS
window.runDebugTests = async function() {
    console.log('\n╔════════════════════════════════════════╗');
    console.log('║      DIAGNÓSTICO DEL CARRITO DE COMPRAS      ║');
    console.log('╚════════════════════════════════════════╝\n');
    
    testLocalStorage();
    testFuncionesDisponibles();
    const usuario = testUsuario();
    testCarritoLocalStorage();
    
    if (usuario) {
        await testAgregarAlCarrito();
        await testSincronizacion();
    }
    
    console.log('\n╔════════════════════════════════════════╗');
    console.log('║         FIN DEL DIAGNÓSTICO        ║');
    console.log('╚════════════════════════════════════════╝\n');
};

// Ejecutar automáticamente cuando se cargue la página
console.log('Escribe: runDebugTests() en la consola para ejecutar diagnóstico completo');
