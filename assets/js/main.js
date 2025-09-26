// Funcionalidades generales del sitio
document.addEventListener('DOMContentLoaded', function() {
    // Actualizar la UI según el estado de autenticación
    actualizarUIAutenticacion();
    
    // Actualizar contador del carrito
    actualizarContadorCarrito();
    
    // Event listener para atajos de teclado de testing
    document.addEventListener('keydown', function(e) {
        // Ctrl + Shift + R = Reset completo
        if (e.ctrlKey && e.shiftKey && e.key === 'R') {
            e.preventDefault();
            if (confirm('🔄 ¿Resetear todo el sistema?\n\n- Se borrará la sesión actual\n- Se limpiará el carrito\n- Se resetearán los productos\n- Se eliminarán los usuarios registrados')) {
                resetearSistema();
            }
        }
        
        // Ctrl + Shift + D = Depuración/Estado del sistema  
        if (e.ctrlKey && e.shiftKey && e.key === 'D') {
            e.preventDefault();
            mostrarEstadoSistema();
        }
        
        // Ctrl + Shift + L = Login rápido
        if (e.ctrlKey && e.shiftKey && e.key === 'L') {
            e.preventDefault();
            const email = prompt('Email para login rápido (por defecto: test@test.com):', 'test@test.com');
            if (email) {
                loginPrueba(email);
            }
        }
    });
    
    // Menú móvil
    const botonMenuMovil = document.querySelector('.mobile-menu-btn');
    const menuNav = document.querySelector('.navbar ul');
    
    if (botonMenuMovil && menuNav) {
        botonMenuMovil.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            menuNav.classList.toggle('active');
        });
    }
    
    // Configurar el dropdown del usuario
    const botonMenuUsuario = document.querySelector('.user-menu-btn');
    if (botonMenuUsuario) {
        botonMenuUsuario.addEventListener('click', function(e) {
            e.preventDefault();
            const dropdown = document.querySelector('.user-dropdown');
            if (dropdown) {
                dropdown.classList.toggle('active');
            }
        });
    }
});

// Cerrar dropdown cuando se hace clic fuera
document.addEventListener('click', function(e) {
    const dropdown = document.querySelector('.user-dropdown');
    const botonMenu = document.querySelector('.user-menu-btn');
    
    if (dropdown && botonMenu && !botonMenu.contains(e.target)) {
        dropdown.classList.remove('active');
    }
});

// Actualizar la UI según el estado de autenticación
function actualizarUIAutenticacion() {
    const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
    const menuUsuario = document.getElementById('user-menu');
    const botonLogin = document.getElementById('login-btn');
    const nombreUsuario = document.getElementById('user-name');
    const adminLink = document.getElementById('admin-link');
    const vendedorLink = document.getElementById('vendedor-link');
    
    if (usuarioActual && usuarioActual.logueado) {
        // Mostrar menú de usuario y ocultar botón de login
        if (menuUsuario) menuUsuario.style.display = 'block';
        if (botonLogin) botonLogin.style.display = 'none';
        if (nombreUsuario) nombreUsuario.textContent = usuarioActual.nombre;
        
        // Mostrar enlaces según el rol del usuario
        if (adminLink) {
            adminLink.style.display = (usuarioActual.rol === 'admin') ? 'block' : 'none';
        }
        if (vendedorLink) {
            vendedorLink.style.display = (usuarioActual.rol === 'vendedor' || usuarioActual.rol === 'admin') ? 'block' : 'none';
        }
        
        // Configurar event listener del dropdown DESPUÉS de mostrar el menú
        setTimeout(() => {
            configurarDropdownUsuario();
        }, 10);
        
    } else {
        // Ocultar menú de usuario y mostrar botón de login
        if (menuUsuario) menuUsuario.style.display = 'none';
        if (botonLogin) botonLogin.style.display = 'block';
        
        // Ocultar enlaces de admin y vendedor
        if (adminLink) adminLink.style.display = 'none';
        if (vendedorLink) vendedorLink.style.display = 'none';
    }
}

// Función para configurar el dropdown del usuario
function configurarDropdownUsuario() {
    const botonMenuUsuario = document.querySelector('.user-menu-btn');
    if (botonMenuUsuario) {
        // Remover event listeners anteriores clonando el elemento
        const nuevoBoton = botonMenuUsuario.cloneNode(true);
        botonMenuUsuario.parentNode.replaceChild(nuevoBoton, botonMenuUsuario);
        
        // Agregar nuevo event listener
        nuevoBoton.addEventListener('click', function(e) {
            e.preventDefault();
            const dropdown = document.querySelector('.user-dropdown');
            if (dropdown) {
                dropdown.classList.toggle('active');
            }
        });
    }
}

// Actualizar contador del carrito
function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const totalItems = carrito.reduce((total, item) => total + (item.cantidad || 0), 0);
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = totalItems;
    });
}

// Función para validar email
function validarEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Función para cerrar sesión
function cerrarSesion() {
    const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
    
    if (usuarioActual) {
        localStorage.removeItem('usuarioActual');
        
        // Actualizar UI antes de redirigir
        actualizarUIAutenticacion();
        
        // Pequeño delay para mostrar cambios
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 100);
    } else {
        window.location.href = 'index.html';
    }
}

// Mantener función logout para compatibilidad hacia atrás
function logout() {
    cerrarSesion();
}


// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar datos por defecto si no existen
    inicializarDatosPorDefecto();
    
    actualizarUIAutenticacion();
    actualizarContadorCarrito();
});

// Cerrar dropdown cuando se hace clic fuera
document.addEventListener('click', function(e) {
    const dropdown = document.querySelector('.user-dropdown');
    const botonMenu = document.querySelector('.user-menu-btn');
    
    if (dropdown && botonMenu && !botonMenu.contains(e.target)) {
        dropdown.classList.remove('active');
    }
});
    
    // Los botones add-to-cart ahora se generan dinámicamente en productos.js


// Función wrapper para compatibilidad hacia atrás - usa el sistema unificado de productos.js
function agregarAlCarrito(id, nombre, precio) {
    // Crear objeto producto compatible con el sistema moderno
    const product = {
        id: id,
        nombre: nombre,
        precio: precio,
        imagen: `https://images.unsplash.com/photo-1560769629-975ec94e6a86?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`,
        stock: 10 // Valor por defecto
    };
    
    // Usar la función unificada de productos.js
    if (typeof agregarAlCarritoProducto === 'function') {
        agregarAlCarritoProducto(product);
    } else {
        console.error('Función agregarAlCarritoProducto no disponible. Asegúrate de que productos.js esté cargado.');
    }
}

// Función para obtener usuario logueado (compatibilidad con otros archivos)
function obtenerUsuarioLogueado() {
    return JSON.parse(localStorage.getItem('usuarioActual'));
}

// Inicializar datos por defecto del sistema
function inicializarDatosPorDefecto() {
    // Inicializar productos por defecto si no existen
    const productos = JSON.parse(localStorage.getItem('productos'));
    if (!productos || productos.length === 0) {
        const productosPorDefecto = [
            {
                id: 1,
                nombre: "Nike Air Max 270",
                precio: 89990,
                imagen: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                categoria: "deportivos",
                descripcion: "Zapatillas deportivas con tecnología Air Max para máxima comodidad y estilo.",
                stock: 25,
                activo: true,
                fechaCreacion: new Date().toISOString()
            },
            {
                id: 2,
                nombre: "Converse Chuck Taylor All Star",
                precio: 45990,
                imagen: "https://images.unsplash.com/photo-1552346154-21d32810aba3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                categoria: "casual",
                descripcion: "Clásicas zapatillas de lona, perfectas para un look casual y juvenil.",
                stock: 30,
                activo: true,
                fechaCreacion: new Date().toISOString()
            },
            {
                id: 3,
                nombre: "Adidas Stan Smith",
                precio: 79990,
                imagen: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                categoria: "casual",
                descripcion: "Icónicas zapatillas blancas con detalles verdes, un clásico atemporal.",
                stock: 20,
                activo: true,
                fechaCreacion: new Date().toISOString()
            },
            {
                id: 4,
                nombre: "Zapatos Oxford Clásicos",
                precio: 129990,
                imagen: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                categoria: "formal",
                descripcion: "Elegantes zapatos Oxford de cuero genuino para ocasiones formales.",
                stock: 15,
                activo: true,
                fechaCreacion: new Date().toISOString()
            },
            {
                id: 5,
                nombre: "Tacones Elegantes",
                precio: 99990,
                imagen: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                categoria: "mujer",
                descripcion: "Tacones altos elegantes para eventos especiales y ocasiones formales.",
                stock: 12,
                activo: true,
                fechaCreacion: new Date().toISOString()
            },
            {
                id: 6,
                nombre: "Botas de Montaña",
                precio: 149990,
                imagen: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                categoria: "outdoor",
                descripcion: "Resistentes botas de montaña ideales para trekking y actividades al aire libre.",
                stock: 18,
                activo: true,
                fechaCreacion: new Date().toISOString()
            },
            {
                id: 7,
                nombre: "Sandalias de Verano",
                precio: 39990,
                imagen: "https://images.unsplash.com/photo-1505782679771-15200ba4a5db?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                categoria: "verano",
                descripcion: "Cómodas sandalias perfectas para los días calurosos de verano.",
                stock: 35,
                activo: true,
                fechaCreacion: new Date().toISOString()
            },
            {
                id: 8,
                nombre: "Zapatillas Running",
                precio: 119990,
                imagen: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                categoria: "deportivos",
                descripcion: "Zapatillas especializadas para running con tecnología de amortiguación avanzada.",
                stock: 22,
                activo: true,
                fechaCreacion: new Date().toISOString()
            }
        ];
        
        localStorage.setItem('productos', JSON.stringify(productosPorDefecto));

    }
}

// FUNCIONES DE PRUEBAS Y DEPURACIÓN

// Función para resetear completamente el sistema a estado por defecto
function resetearSistema() {
    console.log('🔄 Reseteando sistema completo...');
    
    // Limpiar solo datos de usuario y carrito, MANTENER productos
    const clavesALimpiar = [
        'usuarioActual',
        'carrito', 
        'usuarios'
    ];
    
    clavesALimpiar.forEach(clave => {
        localStorage.removeItem(clave);
        console.log(`✅ Limpiado: ${clave}`);
    });
    
    // Reinicializar productos si no existen (NO los borramos para preservar el stock)
    if (!localStorage.getItem('productos')) {
        console.log('🔄 Reinicializando productos por defecto...');
        // Será inicializado por productos.js al cargar
    }
    
    // Mostrar estado actual
    console.log('📊 Estado después del reset:');
    console.log('- Usuario logueado:', JSON.parse(localStorage.getItem('usuarioActual')));
    console.log('- Productos en carrito:', JSON.parse(localStorage.getItem('carrito'))?.length || 0);
    console.log('- Usuarios registrados:', JSON.parse(localStorage.getItem('usuarios'))?.length || 0);
    console.log('- Productos en localStorage:', !!localStorage.getItem('productos'));
    
    // Recargar página para aplicar cambios
    console.log('🔄 Recargando página...');
    setTimeout(() => {
        window.location.reload();
    }, 1000);
}

// Función para mostrar estado actual del sistema
function mostrarEstadoSistema() {
    console.log('📊 ESTADO ACTUAL DEL SISTEMA');
    console.log('================================');
    
    const usuario = JSON.parse(localStorage.getItem('usuarioActual'));
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const productos = JSON.parse(localStorage.getItem('productos')) || [];
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    
    console.log('👤 Usuario actual:', usuario ? usuario.nombre : 'No logueado');
    console.log('🛒 Items en carrito:', carrito.length);
    console.log('📦 Total productos:', productos.length);
    console.log('👥 Usuarios registrados:', usuarios.length);
    
    if (productos.length > 0) {
        console.log('\n📊 Stock de productos:');
        productos.forEach(p => {
            const stockColor = p.stock === 0 ? '🔴' : p.stock <= 5 ? '🟡' : '🟢';
            console.log(`  ${stockColor} ${p.nombre}: ${p.stock} unidades`);
        });
    }
    
    if (carrito.length > 0) {
        console.log('\n🛒 Contenido del carrito:');
        carrito.forEach(item => {
            console.log(`  - ${item.nombre}: ${item.cantidad} unidades`);
        });
    }
    
    return {
        usuario,
        carrito,
        productos,
        usuarios
    };
}


// Exponer funciones globalmente para uso en consola
window.resetearSistema = resetearSistema;
window.mostrarEstadoSistema = mostrarEstadoSistema; 

// Mensaje de bienvenida para desarrolladores
console.log('FUNCIONES DE TESTING DISPONIBLES:');
console.log('====================================');
console.log('FUNCIONES EN CONSOLA:');
console.log('resetearSistema() - Limpia todo y recarga');
console.log('mostrarEstadoSistema() - Muestra estado actual');  
console.log('');
console.log('ATAJOS DE TECLADO:');
console.log('Ctrl+Shift+R - Reset completo del sistema');
console.log('Ctrl+Shift+D - Ver estado/depuración del sistema'); 
console.log('====================================');

