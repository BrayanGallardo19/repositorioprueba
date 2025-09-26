// Carrito de compras
document.addEventListener('DOMContentLoaded', function() {
    cargarItemsCarrito();
    configurarEventListeners();
    actualizarContadorCarrito();
    actualizarEstadoCheckout();
});

// Cargar items del carrito
function cargarItemsCarrito() {
    const cart = JSON.parse(localStorage.getItem('carrito')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const cartSummary = document.querySelector('.cart-summary');
    
    if (!cartItemsContainer) {
        console.error('Container cart-items no encontrado');
        return;
    }
    
    // Limpiar completamente el contenedor
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        // Verificar si acabamos de completar una compra exitosa
        const compraExitosa = localStorage.getItem('compraExitosa');
        if (compraExitosa) {
            // Limpiar el flag y NO mostrar mensaje de carrito vacío
            localStorage.removeItem('compraExitosa');
            if (emptyCartMessage) emptyCartMessage.style.display = 'none';
            if (cartSummary) cartSummary.style.display = 'none';
            return;
        }
        
        // Carrito realmente vacío (no por compra exitosa)
        if (emptyCartMessage) emptyCartMessage.style.display = 'block';
        if (cartSummary) cartSummary.style.display = 'none';
        return;
    }
    
    if (emptyCartMessage) emptyCartMessage.style.display = 'none'; // Ocultar mensaje de carrito vacío
    if (cartSummary) cartSummary.style.display = 'block'; // Mostrar resumen del carrito
    
    // Crear items usando template
    cart.forEach(item => {
        const itemElement = crearElementoCarrito(item);
        if (itemElement) {
            cartItemsContainer.appendChild(itemElement);
        }
    });
    
    actualizarResumenCarrito();
    actualizarEstadoCheckout();
}

// Crear elemento del carrito usando template HTML
function crearElementoCarrito(item) {
    // Validar propiedades del item
    const itemId = item.id || 'sin-id';
    const itemNombre = item.nombre || item.name || 'Producto sin nombre';
    const itemImagen = item.imagen || item.image || 'https://via.placeholder.com/100x100?text=Sin+Imagen';
    const itemPrecio = item.precio || item.price || 0;
    const itemCantidad = item.cantidad || item.quantity || 1;
    
    // Obtener template
    const template = document.getElementById('cart-item-template');
    if (!template) {
        console.error('Template de item del carrito no encontrado');
        return document.createElement('div');
    }
    
    // Clonar template
    const itemElement = template.content.cloneNode(true);
    
    // Configurar el elemento contenedor
    const cartItem = itemElement.querySelector('.cart-item');
    cartItem.setAttribute('data-id', itemId);
    // Configurar imagen
    const img = itemElement.querySelector('.item-img');
    img.src = itemImagen;
    img.alt = itemNombre;
    img.onerror = function() {
        this.src = 'https://via.placeholder.com/100x100?text=Sin+Imagen';
    };
    
    // Configurar nombre del producto
    const nameElement = itemElement.querySelector('.item-name');
    nameElement.textContent = itemNombre;
    
    // Configurar precio con validación
    const priceElement = itemElement.querySelector('.item-price');
    if (typeof itemPrecio === 'number' && itemPrecio >= 0) {
        priceElement.textContent = `$${itemPrecio.toLocaleString('es-CL')}`;
    } else {
        priceElement.textContent = '$0';
    }
    
    // Configurar cantidad
    const quantityInput = itemElement.querySelector('.cantidad-input');
    quantityInput.value = itemCantidad;
    
    return itemElement;
}

// Configurar event listeners para los botones del carrito usando delegación de eventos
function configurarEventListeners() {
    const cartItemsContainer = document.getElementById('cart-items');
    
    // Usar delegación de eventos para elementos dinámicos
    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', function(e) {
            // Botones de incrementar/decrementar cantidad
            if (e.target.classList.contains('cantidad-btn')) {
                const cartItem = e.target.closest('.cart-item');
                const id = cartItem.dataset.id;
                const input = cartItem.querySelector('.cantidad-input');
                let cantidad = parseInt(input.value);
                
                if (e.target.classList.contains('increase')) {
                    cantidad += 1;
                } else if (e.target.classList.contains('decrease') && cantidad > 1) {
                    cantidad -= 1;
                }
                
                input.value = cantidad;
                actualizarCantidadItem(id, cantidad);
            }
            
            // Botones de eliminar
            if (e.target.classList.contains('remove-btn') || e.target.parentElement.classList.contains('remove-btn')) {
                const button = e.target.classList.contains('remove-btn') ? e.target : e.target.parentElement;
                const cartItem = button.closest('.cart-item');
                const id = cartItem.dataset.id;
                eliminarItemCarrito(id);
            }
        });
        
        // Event listener para cambios directos en el input de cantidad
        cartItemsContainer.addEventListener('change', function(e) {
            if (e.target.classList.contains('cantidad-input')) {
                const cartItem = e.target.closest('.cart-item');
                const id = cartItem.dataset.id;
                let cantidad = parseInt(e.target.value);
                
                if (isNaN(cantidad) || cantidad < 1) {
                    cantidad = 1;
                    e.target.value = 1;
                }
                
                actualizarCantidadItem(id, cantidad);
            }
        });
    }
    
    // Botón de checkout (este no es dinámico)
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            procesarCompra();
        });
    }
}

// Actualizar cantidad de un item en el carrito
function actualizarCantidadItem(id, cantidad) {
    let cart = JSON.parse(localStorage.getItem('carrito')) || [];
    const item = cart.find(item => item.id == id); // Usar == para comparar string con number
    
    if (item) {
        // Verificar stock disponible
        const productos = JSON.parse(localStorage.getItem('productos')) || [];
        const producto = productos.find(p => p.id == id);
        
        if (producto && cantidad > producto.stock) {
            alert(`No hay suficiente stock. Stock disponible: ${producto.stock}`);
            // Recargar la página para mostrar la cantidad correcta
            cargarItemsCarrito();
            return;
        }
        
        const cantidadAnterior = item.cantidad;
        item.cantidad = cantidad;
        localStorage.setItem('carrito', JSON.stringify(cart));
        
        // Actualizar los cálculos y contador
        actualizarResumenCarrito();
        actualizarContadorCarrito();
    }
}

// Eliminar item del carrito
function eliminarItemCarrito(id) {
    let cart = JSON.parse(localStorage.getItem('carrito')) || [];
    
    // Usar comparación flexible para evitar problemas de tipos
    cart = cart.filter(item => item.id != id);
    
    localStorage.setItem('carrito', JSON.stringify(cart));
    
    // Recargar la vista del carrito
    cargarItemsCarrito();
    actualizarContadorCarrito();
}

// Actualizar resumen del carrito
function actualizarResumenCarrito() {
    const cart = JSON.parse(localStorage.getItem('carrito')) || [];
    const subtotalElement = document.getElementById('cart-subtotal');
    const shippingElement = document.getElementById('cart-shipping');
    const totalElement = document.getElementById('cart-total');
    
    const subtotal = cart.reduce((total, item) => {
        const precio = item.precio || item.price || 0;
        const cantidad = item.cantidad || item.quantity || 1;
        
        // Validar que precio y cantidad sean números válidos
        const precioValido = typeof precio === 'number' && precio >= 0 ? precio : 0;
        const cantidadValida = typeof cantidad === 'number' && cantidad >= 0 ? cantidad : 1;
        
        const subtotalItem = precioValido * cantidadValida;
        
        return total + subtotalItem;
    }, 0);
    
    const shipping = subtotal > 0 ? 5000 : 0; // Costo de envío fijo
    const total = subtotal + shipping;
    
    // Actualizar elementos DOM con validación
    if (subtotalElement) {
        subtotalElement.textContent = `$${subtotal.toLocaleString('es-CL')}`;
    }
    if (shippingElement) {
        shippingElement.textContent = `$${shipping.toLocaleString('es-CL')}`;
    }
    if (totalElement) {
        totalElement.textContent = `$${total.toLocaleString('es-CL')}`;
    }
}

// Procesar compra y actualizar stock
function procesarCompra() {
    // Verificar que el usuario esté logueado
    const usuario = JSON.parse(localStorage.getItem('usuarioActual'));
    if (!usuario) {
        alert('Debes iniciar sesión para finalizar la compra');
        window.location.href = 'login.html';
        return;
    }
    
    const cart = JSON.parse(localStorage.getItem('carrito')) || [];
    
    if (cart.length === 0) {
        alert('El carrito está vacío');
        return;
    }
    
    // Obtener productos actuales
    let productos = JSON.parse(localStorage.getItem('productos')) || [];
    
    // Verificar stock disponible antes de procesar
    for (let cartItem of cart) {
        const producto = productos.find(p => p.id == cartItem.id);
        if (producto && producto.stock < cartItem.cantidad) {
            alert(`No hay suficiente stock para ${cartItem.nombre}. Stock disponible: ${producto.stock}, solicitado: ${cartItem.cantidad}`);
            return;
        }
    }
    
    // Actualizar stock de cada producto
    cart.forEach(cartItem => {
        const productoIndex = productos.findIndex(p => p.id == cartItem.id);
        if (productoIndex !== -1) {
            productos[productoIndex].stock -= cartItem.cantidad;
            // Asegurar que el stock no sea negativo
            if (productos[productoIndex].stock < 0) {
                productos[productoIndex].stock = 0;
            }
        }
    });
    
    // Guardar productos actualizados
    localStorage.setItem('productos', JSON.stringify(productos));
    
    // Crear nuevo pedido
    const nuevoPedido = {
        id: Date.now(), // ID único basado en timestamp
        cliente: {
            nombre: usuario.nombre,
            email: usuario.email,
            telefono: usuario.telefono || 'No especificado'
        },
        fecha: new Date().toISOString().split('T')[0], // Fecha actual en formato YYYY-MM-DD
        estado: "pendiente", // Estado inicial del pedido
        total: cart.reduce((sum, item) => sum + (item.precio * item.cantidad), 0),
        productos: cart.map(item => ({
            nombre: item.nombre,
            cantidad: item.cantidad,
            precio: item.precio
        })),
        direccionEnvio: "Dirección por definir" // Se podría expandir para capturar dirección real
    };
    
    // Obtener pedidos existentes y agregar el nuevo
    const pedidosExistentes = JSON.parse(localStorage.getItem('pedidos')) || [];
    pedidosExistentes.push(nuevoPedido);
    localStorage.setItem('pedidos', JSON.stringify(pedidosExistentes));
    
    // Mostrar mensaje de éxito
    alert('¡Gracias por tu compra! El stock ha sido actualizado y tu pedido ha sido registrado.');
    
    // Vaciar carrito DESPUÉS de mostrar el mensaje de éxito y antes de redirigir
    localStorage.removeItem('carrito');
    
    // Agregar flag temporal para evitar mostrar "carrito vacío" inmediatamente después
    localStorage.setItem('compraExitosa', 'true');
    
    // Redirigir después de un pequeño delay para evitar el problema de timing
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 500);
}

// Actualizar estado del botón de checkout según autenticación
function actualizarEstadoCheckout() {
    const checkoutBtn = document.getElementById('checkout-btn');
    const usuario = JSON.parse(localStorage.getItem('usuarioActual'));
    
    if (!checkoutBtn) return;
    
    if (!usuario) {
        // Usuario no logueado - mostrar botón para login
        checkoutBtn.innerHTML = '<i class="fas fa-user"></i> Iniciar Sesión para Comprar';
        checkoutBtn.className = 'btn btn-warning w-100';
        checkoutBtn.onclick = function() {
            alert('Debes iniciar sesión para finalizar la compra');
            window.location.href = 'login.html';
        };
    } else {
        // Usuario logueado - botón normal de checkout
        checkoutBtn.innerHTML = '<i class="fas fa-credit-card"></i> Finalizar Compra';
        checkoutBtn.className = 'btn btn-success w-100';
        // No agregar onclick aquí - ya se maneja con addEventListener en cargarItemsCarrito()
    }
}

