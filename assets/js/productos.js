// Productos JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Si estamos en la página de productos
    if (document.getElementById('all-products')) {
        inicializarProductos();
        configurarFiltros();
    }
    
    // Si estamos en el index (productos destacados)
    if (document.getElementById('featured-products')) {
        inicializarProductosDestacados();
    }
    
    actualizarContadorCarrito();
});

// Datos de productos (simulando una base de datos)
const datosProductos = [
    {
        id: 1,
        nombre: "Zapatos Oxford Clásicos",
        precio: 89990,
        imagen: "./assets/img/productos/zapatosoxfordclasicos.jpg",
        categoria: "hombre",
        descripcion: "Elegantes zapatos Oxford de cuero genuino para hombre",
        stock: 15
    },
    {
        id: 2,
        nombre: "Tacones Elegantes",
        precio: 75990,
        imagen: "./assets/img/productos/taconeselegantes.jpg",
        categoria: "mujer",
        descripcion: "Tacones altos elegantes para ocasiones especiales",
        stock: 5
    },
    {
        id: 3,
        nombre: "Zapatillas Deportivas",
        precio: 65990,
        imagen: "./assets/img/productos/zapatillasdeportivas.jpg",
        categoria: "deportivos",
        descripcion: "Zapatillas deportivas cómodas para running",
        stock: 20
    },
    {
        id: 4,
        nombre: "Botas de Cuero",
        precio: 125990,
        imagen: "./assets/img/productos/botasdecuero.jpg",
        categoria: "hombre",
        descripcion: "Botas robustas de cuero para uso diario",
        stock: 12
    },
    {
        id: 5,
        nombre: "Sandalias de Verano",
        precio: 45990,
        imagen: "./assets/img/productos/sandaliasdeverano.jpg",
        categoria: "mujer",
        descripcion: "Sandalias cómodas para el verano",
        stock: 25
    },
    {
        id: 6,
        nombre: "Zapatos Escolares",
        precio: 35990,
        imagen: "./assets/img/productos/zapatosescolares.jpg",
        categoria: "niños",
        descripcion: "Zapatos escolares resistentes y cómodos",
        stock: 0
    },
    {
        id: 7,
        nombre: "Zapatillas Casual",
        precio: 55990,
        imagen: "./assets/img/productos/zapatillascasual.jpg",
        categoria: "mujer",
        descripcion: "Zapatillas casuales para uso diario",
        stock: 18
    },
    {
        id: 8,
        nombre: "Zapatos de Vestir",
        precio: 95990,
        imagen: "./assets/img/productos/zapatosdevestir.jpg",
        categoria: "hombre",
        descripcion: "Zapatos formales para eventos especiales",
        stock: 10
    }
];

// Inicializar productos
function inicializarProductos() {
    // Cargar productos desde localStorage
    let productos = JSON.parse(localStorage.getItem('productos'));
    
    // FORZAR ACTUALIZACIÓN: Si los productos no tienen las categorías correctas, reemplazarlos
    const categoriasCorrectas = ['hombre', 'mujer', 'niños', 'deportivos'];
    let necesitaReinicio = false;
    
    if (productos) {
        // Verificar si algún producto tiene categorías incorrectas
        const categoriasEncontradas = [...new Set(productos.map(p => p.categoria))];
        const tieneCategoriasIncorrectas = categoriasEncontradas.some(cat => 
            !['hombre', 'mujer', 'niños', 'deportivos'].includes(cat)
        );
        
        if (tieneCategoriasIncorrectas) {
            console.log('🔄 Categorías incorrectas detectadas, actualizando productos...');
            console.log('Categorías encontradas:', categoriasEncontradas);
            necesitaReinicio = true;
        }
    }
    
    // Solo inicializar con datos por defecto si no hay nada en localStorage O necesita reset
    if (!productos || necesitaReinicio) {
        console.log('📦 Inicializando productos con datos por defecto...');
        localStorage.setItem('productos', JSON.stringify(datosProductos));
        productos = datosProductos;
    } else {
        // Ya existen productos correctos en localStorage, verificar que tengan todas las propiedades necesarias
        let necesitaActualizacion = false;
        productos.forEach((producto, indice) => {
            if (producto.stock === undefined) {
                const productoDefecto = datosProductos.find(p => p.id === producto.id);
                if (productoDefecto) {
                    producto.stock = productoDefecto.stock;
                    necesitaActualizacion = true;
                }
            }
        });
        
        // Si se necesita actualizar, guardar los cambios
        if (necesitaActualizacion) {
            localStorage.setItem('productos', JSON.stringify(productos));
        }
    }
    
    mostrarProductos(productos);
}

// Función de depuración - muestra el stock actual en consola
function mostrarStockActual() {
    const productos = JSON.parse(localStorage.getItem('productos')) || [];
    console.log('Stock actual de todos los productos:');
    productos.forEach(p => {
        console.log(`${p.nombre}: ${p.stock} unidades`);
    });
    return productos;
}

// Mostrar productos en el DOM
function mostrarProductos(productos) {
    const contenedor = document.getElementById('all-products');
    
    // Limpiar contenedor
    while (contenedor.firstChild) {
        contenedor.removeChild(contenedor.firstChild);
    }
    
    if (productos.length === 0) {
        const sinResultados = document.createElement('div');
        sinResultados.className = 'no-results';
        sinResultados.innerHTML = '<p>No se encontraron productos que coincidan con los filtros.</p>';
        contenedor.appendChild(sinResultados);
        return;
    }
    
    productos.forEach(producto => {
        const tarjetaProducto = crearTarjetaProducto(producto);
        contenedor.appendChild(tarjetaProducto);
    });
}

// Crear tarjeta de producto
function crearTarjetaProducto(producto) {
    // Obtener stock actualizado desde localStorage
    const productos = JSON.parse(localStorage.getItem('productos')) || datosProductos;
    const productoActualizado = productos.find(p => p.id === producto.id);
    const stockActual = productoActualizado ? productoActualizado.stock : producto.stock;
    
    const tarjeta = document.createElement('div');
    tarjeta.className = 'product-card';
    
    // Imagen del producto o fallback si no hay imagen
    let elementoImagen;
    
    if (producto.imagen && producto.imagen.trim() !== '') {
        // Si tiene imagen válida, crear elemento img
        elementoImagen = document.createElement('img');
        elementoImagen.src = producto.imagen;
        elementoImagen.alt = producto.nombre;
        elementoImagen.className = 'product-img';
        elementoImagen.onerror = function() {
            // Si falla la carga, reemplazar con texto
            const divTexto = document.createElement('div');
            divTexto.className = 'product-img-fallback';
            divTexto.textContent = producto.nombre || 'Producto';
            divTexto.style.cssText = `
                width: 100%;
                height: 200px;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: #f8f9fa;
                color: #666;
                text-align: center;
                font-size: 14px;
                border: 1px solid #ddd;
                border-radius: 4px;
                padding: 10px;
            `;
            this.parentNode.replaceChild(divTexto, this);
        };
    } else {
        // Si no tiene imagen, crear directamente el div con texto
        elementoImagen = document.createElement('div');
        elementoImagen.className = 'product-img-fallback';
        elementoImagen.textContent = producto.nombre || 'Producto';
        elementoImagen.style.cssText = `
            width: 100%;
            height: 200px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #f8f9fa;
            color: #666;
            text-align: center;
            font-size: 14px;
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 10px;
        `;
    }
    
    // Información del producto
    const infoProducto = document.createElement('div');
    infoProducto.className = 'product-info';
    
    const titulo = document.createElement('h3');
    titulo.className = 'product-title';
    const nombreProducto = producto.nombre || 'Producto sin nombre';
    titulo.textContent = nombreProducto;
    
    const descripcion = document.createElement('p');
    descripcion.className = 'product-description';
    descripcion.textContent = producto.descripcion || '';
    
    const precio = document.createElement('p');
    precio.className = 'product-price';
    precio.textContent = `$${producto.precio.toLocaleString('es-CL')}`;
    
    // Información de stock
    const stock = document.createElement('p');
    stock.className = 'product-stock';
    if (stockActual > 0) {
        stock.textContent = `Stock disponible: ${stockActual}`;
        stock.style.color = stockActual <= 5 ? '#e63946' : '#28a745'; // Rojo si queda poco, verde si hay suficiente
    } else {
        stock.textContent = 'Sin stock';
        stock.style.color = '#dc3545';
        stock.style.fontWeight = 'bold';
    }
    
    // Botón agregar al carrito
    const botonAgregar = document.createElement('button');
    botonAgregar.className = 'btn add-to-cart-btn';
    
    // Verificar si el usuario está logueado
    const usuario = JSON.parse(localStorage.getItem('usuarioActual'));
    
    if (stockActual <= 0) {
        // Sin stock
        botonAgregar.innerHTML = '<i class="fas fa-times"></i> Sin Stock';
        botonAgregar.disabled = true;
        botonAgregar.classList.add('disabled');
        botonAgregar.style.backgroundColor = '#6c757d';
        botonAgregar.style.cursor = 'not-allowed';
        botonAgregar.style.opacity = '0.6';
    } else if (!usuario) {
        // Con stock pero usuario no logueado
        botonAgregar.innerHTML = '<i class="fas fa-user"></i> Iniciar Sesión para Comprar';
        botonAgregar.addEventListener('click', () => {
            alert('Debes iniciar sesión para agregar productos al carrito');
            window.location.href = 'login.html';
        });
        botonAgregar.style.backgroundColor = '#ffc107';
        botonAgregar.style.color = '#000';
    } else {
        // Con stock y usuario logueado
        botonAgregar.innerHTML = '<i class="fas fa-shopping-cart"></i> Agregar al Carrito';
        botonAgregar.addEventListener('click', () => agregarAlCarritoProducto(producto));
    }
    
    // Ensamblar la tarjeta
    infoProducto.appendChild(titulo);
    infoProducto.appendChild(descripcion);
    infoProducto.appendChild(precio);
    infoProducto.appendChild(stock);
    infoProducto.appendChild(botonAgregar);
    
    tarjeta.appendChild(elementoImagen);
    tarjeta.appendChild(infoProducto);
    
    return tarjeta;
}

// Agregar producto al carrito
function agregarAlCarritoProducto(producto) {
    // Verificar que el usuario esté logueado
    const usuario = JSON.parse(localStorage.getItem('usuarioActual'));
    if (!usuario) {
        alert('Debes iniciar sesión para agregar productos al carrito');
        window.location.href = 'login.html';
        return;
    }
    
    // Obtener stock actualizado desde localStorage
    const productos = JSON.parse(localStorage.getItem('productos')) || datosProductos;
    const productoActualizado = productos.find(p => p.id === producto.id);
    const stockActual = productoActualizado ? productoActualizado.stock : producto.stock;
    
    if (stockActual <= 0) {
        alert('Este producto no tiene stock disponible');
        return;
    }
    
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    // Verificar si el producto ya está en el carrito
    const indiceElementoExistente = carrito.findIndex(elemento => elemento.id === producto.id);
    
    if (indiceElementoExistente !== -1) {
        // Si ya existe, verificar que no exceda el stock disponible
        const cantidadActual = carrito[indiceElementoExistente].cantidad;
        if (cantidadActual >= stockActual) {
            alert(`No puedes agregar más de este producto. Stock disponible: ${stockActual}`);
            return;
        }
        // Aumentar cantidad
        carrito[indiceElementoExistente].cantidad += 1;
    } else {
        // Si no existe, agregar nuevo elemento
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen,
            cantidad: 1,
            stock: stockActual // Usar stock actualizado
        });
    }
    
    // Guardar carrito actualizado
    localStorage.setItem('carrito', JSON.stringify(carrito));
    
    // Actualizar contador del carrito
    actualizarContadorCarrito();
    
    // Mostrar mensaje de confirmación
    const nombreProducto = producto.nombre || 'Producto sin nombre';
    mostrarMensajeAgregarCarrito(nombreProducto);
}

// Mostrar mensaje de confirmación
function mostrarMensajeAgregarCarrito(nombreProducto) {
    // Crear elemento de notificación
    const notificacion = document.createElement('div');
    notificacion.className = 'cart-notification';
    notificacion.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${nombreProducto} agregado al carrito</span>
    `;
    
    // Estilos en línea para la notificación
    notificacion.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 10px;
        opacity: 0;
        transform: translateX(100px);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(notificacion);
    
    // Animar entrada
    setTimeout(() => {
        notificacion.style.opacity = '1';
        notificacion.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notificacion.style.opacity = '0';
        notificacion.style.transform = 'translateX(100px)';
        setTimeout(() => {
            document.body.removeChild(notificacion);
        }, 300);
    }, 3000);
}

// Configurar filtros
function configurarFiltros() {
    const filtroCategoria = document.getElementById('category-filter');
    const filtroPrecio = document.getElementById('price-filter');
    const valorPrecio = document.getElementById('price-value');
    const entradaBusqueda = document.getElementById('search-input');
    
    // Filtro de categoría
    filtroCategoria.addEventListener('change', aplicarFiltros);
    
    // Filtro de precio
    filtroPrecio.addEventListener('input', function() {
        const valor = parseInt(this.value);
        valorPrecio.textContent = `$${valor.toLocaleString('es-CL')}`;
        aplicarFiltros();
    });
    
    // Filtro de búsqueda
    let tiempoEsperaBusqueda;
    entradaBusqueda.addEventListener('input', function() {
        clearTimeout(tiempoEsperaBusqueda);
        tiempoEsperaBusqueda = setTimeout(aplicarFiltros, 300); // Debounce
    });
}

// Aplicar filtros
function aplicarFiltros() {
    const productos = JSON.parse(localStorage.getItem('productos')) || datosProductos;
    const categoria = document.getElementById('category-filter').value;
    const precioMaximo = parseInt(document.getElementById('price-filter').value);
    const terminoBusqueda = document.getElementById('search-input').value.toLowerCase();
    
    let productosFiltrados = productos.filter(producto => {
        const coincideCategoria = categoria === 'all' || producto.categoria === categoria;
        const coincidePrecio = producto.precio <= precioMaximo;
        const coincideBusqueda = producto.nombre.toLowerCase().includes(terminoBusqueda) || 
                            producto.descripcion.toLowerCase().includes(terminoBusqueda);
        
        return coincideCategoria && coincidePrecio && coincideBusqueda;
    });
    
    mostrarProductos(productosFiltrados);
}

// Inicializar productos destacados en el index
function inicializarProductosDestacados() {
    let productos = JSON.parse(localStorage.getItem('productos')) || datosProductos;
    
    // Si no hay productos en localStorage, guardar los datos por defecto
    if (!localStorage.getItem('productos')) {
        localStorage.setItem('productos', JSON.stringify(datosProductos));
        productos = datosProductos;
    }
    
    // Mostrar solo los primeros 4 productos como destacados
    const productosDestacados = productos.slice(0, 4);
    mostrarProductosDestacados(productosDestacados);
}

// Mostrar productos destacados en el index
function mostrarProductosDestacados(productos) {
    const contenedor = document.getElementById('featured-products');
    
    if (!contenedor) {
        console.error('Contenedor featured-products no encontrado');
        return;
    }
    
    // Limpiar contenedor
    while (contenedor.firstChild) {
        contenedor.removeChild(contenedor.firstChild);
    }
    
    productos.forEach((producto, indice) => {
        const tarjetaProducto = crearTarjetaProducto(producto);
        contenedor.appendChild(tarjetaProducto);
    });
    
}
