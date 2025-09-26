// Variables globales
let productosActuales = [];
let pedidosActuales = [];
let paginaProductosActual = 1;
let paginaPedidosActual = 1;
const elementosPorPagina = 10;

// INICIALIZACIÓN

document.addEventListener('DOMContentLoaded', function() {
    verificarSesionVendedor();
    cargarProductosVendedor();
    cargarPedidosVendedor();
    configurarBuscadores();
});

// Verificar que el usuario es vendedor
function verificarSesionVendedor() {
    const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual') || '{}');
    
    if (!usuarioActual.email || usuarioActual.rol !== 'vendedor') {
        alert('Acceso denegado. Solo vendedores pueden acceder a esta sección.');
        window.location.href = 'login.html';
        return;
    }
    
    document.getElementById('vendedor-nombre').textContent = usuarioActual.nombre || 'Vendedor';
}

// GESTIÓN DE PRODUCTOS (SOLO LECTURA)

function cargarProductosVendedor() {
    try {
        // Cargar productos desde localStorage o datos por defecto
        productosActuales = JSON.parse(localStorage.getItem('productos')) || obtenerProductosPorDefecto();
        mostrarProductosVendedor();
        configurarPaginacionProductos();
    } catch (error) {
        console.error('Error al cargar productos:', error);
        mostrarMensajeError('productos-vendedor-table', 'Error al cargar los productos');
    }
}

function mostrarProductosVendedor() {
    const tbody = document.getElementById('productos-vendedor-table');
    if (!tbody) return;

    // Limpiar contenido anterior
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

    const inicio = (paginaProductosActual - 1) * elementosPorPagina;
    const fin = inicio + elementosPorPagina;
    const productosPagina = productosActuales.slice(inicio, fin);

    if (productosPagina.length === 0) {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.colSpan = 6;
        td.className = 'text-center text-muted';
        td.textContent = 'No hay productos disponibles';
        tr.appendChild(td);
        tbody.appendChild(tr);
        return;
    }

    productosPagina.forEach(producto => {
        const tr = document.createElement('tr');
        
        // Celda imagen
        const tdImagen = document.createElement('td');
        const img = document.createElement('img');
        img.src = producto.imagen;
        img.alt = producto.nombre;
        img.style.width = '60px';
        img.style.height = '60px';
        img.style.objectFit = 'cover';
        img.className = 'rounded';
        tdImagen.appendChild(img);
        
        // Celda nombre y categoría
        const tdNombre = document.createElement('td');
        const strong = document.createElement('strong');
        strong.textContent = producto.nombre;
        const br = document.createElement('br');
        const small = document.createElement('small');
        small.className = 'text-muted';
        small.textContent = producto.categoria || 'Sin categoría';
        tdNombre.appendChild(strong);
        tdNombre.appendChild(br);
        tdNombre.appendChild(small);
        
        // Celda precio
        const tdPrecio = document.createElement('td');
        const spanPrecio = document.createElement('span');
        spanPrecio.className = 'fw-bold text-success';
        spanPrecio.textContent = `$${formatearPrecio(producto.precio)}`;
        tdPrecio.appendChild(spanPrecio);
        
        // Celda stock
        const tdStock = document.createElement('td');
        const spanStock = document.createElement('span');
        spanStock.className = `badge ${obtenerClaseStock(producto.stock)}`;
        spanStock.textContent = `${producto.stock} unidades`;
        tdStock.appendChild(spanStock);
        
        // Celda estado
        const tdEstado = document.createElement('td');
        const spanEstado = document.createElement('span');
        spanEstado.className = `badge ${producto.activo ? 'bg-success' : 'bg-secondary'}`;
        spanEstado.textContent = producto.activo ? 'Activo' : 'Inactivo';
        tdEstado.appendChild(spanEstado);
        
        // Celda acciones
        const tdAcciones = document.createElement('td');
        const button = document.createElement('button');
        button.className = 'btn btn-outline-primary btn-sm';
        button.onclick = () => verDetalleProducto(producto.id);
        const icon = document.createElement('i');
        icon.className = 'fas fa-eye';
        button.appendChild(icon);
        button.appendChild(document.createTextNode(' Ver Detalle'));
        tdAcciones.appendChild(button);
        
        // Agregar todas las celdas a la fila
        tr.appendChild(tdImagen);
        tr.appendChild(tdNombre);
        tr.appendChild(tdPrecio);
        tr.appendChild(tdStock);
        tr.appendChild(tdEstado);
        tr.appendChild(tdAcciones);
        
        tbody.appendChild(tr);
    });
}

function verDetalleProducto(id) {
    const producto = productosActuales.find(p => p.id === id);
    if (!producto) {
        alert('Producto no encontrado');
        return;
    }

    const modalContent = document.getElementById('detalle-producto-content');
    
    // Limpiar contenido anterior
    while (modalContent.firstChild) {
        modalContent.removeChild(modalContent.firstChild);
    }

    // Crear estructura del modal
    const row = document.createElement('div');
    row.className = 'row';

    // Columna imagen
    const colImagen = document.createElement('div');
    colImagen.className = 'col-md-4';
    const img = document.createElement('img');
    img.src = producto.imagen;
    img.alt = producto.nombre;
    img.className = 'img-fluid rounded';
    colImagen.appendChild(img);

    // Columna información
    const colInfo = document.createElement('div');
    colInfo.className = 'col-md-8';

    // Título
    const h4 = document.createElement('h4');
    h4.textContent = producto.nombre;
    colInfo.appendChild(h4);

    // ID
    const pId = document.createElement('p');
    pId.className = 'text-muted';
    pId.textContent = `ID: ${producto.id}`;
    colInfo.appendChild(pId);

    // Precio
    const divPrecio = document.createElement('div');
    divPrecio.className = 'mb-3';
    const strongPrecio = document.createElement('strong');
    strongPrecio.textContent = 'Precio: ';
    const spanPrecio = document.createElement('span');
    spanPrecio.className = 'text-success fs-5';
    spanPrecio.textContent = `$${formatearPrecio(producto.precio)}`;
    divPrecio.appendChild(strongPrecio);
    divPrecio.appendChild(spanPrecio);
    colInfo.appendChild(divPrecio);

    // Stock
    const divStock = document.createElement('div');
    divStock.className = 'mb-3';
    const strongStock = document.createElement('strong');
    strongStock.textContent = 'Stock: ';
    const spanStock = document.createElement('span');
    spanStock.className = `badge ${obtenerClaseStock(producto.stock)} fs-6`;
    spanStock.textContent = `${producto.stock} unidades`;
    divStock.appendChild(strongStock);
    divStock.appendChild(spanStock);
    colInfo.appendChild(divStock);

    // Categoría
    const divCategoria = document.createElement('div');
    divCategoria.className = 'mb-3';
    const strongCategoria = document.createElement('strong');
    strongCategoria.textContent = 'Categoría: ';
    divCategoria.appendChild(strongCategoria);
    divCategoria.appendChild(document.createTextNode(producto.categoria || 'Sin categoría'));
    colInfo.appendChild(divCategoria);

    // Estado
    const divEstado = document.createElement('div');
    divEstado.className = 'mb-3';
    const strongEstado = document.createElement('strong');
    strongEstado.textContent = 'Estado: ';
    const spanEstado = document.createElement('span');
    spanEstado.className = `badge ${producto.activo ? 'bg-success' : 'bg-secondary'}`;
    spanEstado.textContent = producto.activo ? 'Activo' : 'Inactivo';
    divEstado.appendChild(strongEstado);
    divEstado.appendChild(spanEstado);
    colInfo.appendChild(divEstado);

    // Descripción
    const divDescripcion = document.createElement('div');
    divDescripcion.className = 'mb-3';
    const strongDescripcion = document.createElement('strong');
    strongDescripcion.textContent = 'Descripción:';
    const pDescripcion = document.createElement('p');
    pDescripcion.className = 'mt-2';
    pDescripcion.textContent = producto.descripcion || 'Sin descripción disponible';
    divDescripcion.appendChild(strongDescripcion);
    divDescripcion.appendChild(pDescripcion);
    colInfo.appendChild(divDescripcion);

    // Fecha de creación
    const divFecha = document.createElement('div');
    divFecha.className = 'mb-3';
    const strongFecha = document.createElement('strong');
    strongFecha.textContent = 'Fecha de creación: ';
    const fechaTexto = producto.fechaCreacion ? 
        new Date(producto.fechaCreacion).toLocaleDateString() : 
        'No disponible';
    divFecha.appendChild(strongFecha);
    divFecha.appendChild(document.createTextNode(fechaTexto));
    colInfo.appendChild(divFecha);

    // Ensamblar todo
    row.appendChild(colImagen);
    row.appendChild(colInfo);
    modalContent.appendChild(row);

    const modal = new bootstrap.Modal(document.getElementById('modalDetalleProducto'));
    modal.show();
}

// ====================================
// GESTIÓN DE PEDIDOS (SOLO LECTURA)
// ====================================

function cargarPedidosVendedor() {
    try {
        // Cargar pedidos desde localStorage o datos por defecto
        const todosPedidos = JSON.parse(localStorage.getItem('pedidos')) || obtenerPedidosPorDefecto();
        
        // Filtrar pedidos relevantes para vendedor: excluir "enviado" y "entregado"
        const estadosRelevantes = ['pendiente', 'procesando', 'vendido', 'cancelado'];
        pedidosActuales = todosPedidos.filter(pedido => {
            return estadosRelevantes.includes(pedido.estado.toLowerCase());
        });
        
        mostrarPedidosVendedor();
        configurarPaginacionPedidos();
    } catch (error) {
        console.error('Error al cargar pedidos:', error);
        mostrarMensajeError('pedidos-vendedor-table', 'Error al cargar los pedidos');
    }
}

function mostrarPedidosVendedor() {
    const tbody = document.getElementById('pedidos-vendedor-table');
    if (!tbody) return;

    // Limpiar contenido anterior
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

    const inicio = (paginaPedidosActual - 1) * elementosPorPagina;
    const fin = inicio + elementosPorPagina;
    const pedidosPagina = pedidosActuales.slice(inicio, fin);

    if (pedidosPagina.length === 0) {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.colSpan = 7;
        td.className = 'text-center text-muted';
        td.textContent = 'No hay pedidos disponibles';
        tr.appendChild(td);
        tbody.appendChild(tr);
        return;
    }

    pedidosPagina.forEach(pedido => {
        const tr = document.createElement('tr');
        
        // Celda ID
        const tdId = document.createElement('td');
        const strongId = document.createElement('strong');
        strongId.textContent = `#${pedido.id}`;
        tdId.appendChild(strongId);
        
        // Celda cliente
        const tdCliente = document.createElement('td');
        tdCliente.appendChild(document.createTextNode(pedido.cliente?.nombre || 'Cliente no identificado'));
        const br = document.createElement('br');
        const small = document.createElement('small');
        small.className = 'text-muted';
        small.textContent = pedido.cliente?.email || '';
        tdCliente.appendChild(br);
        tdCliente.appendChild(small);
        
        // Celda fecha
        const tdFecha = document.createElement('td');
        tdFecha.textContent = new Date(pedido.fecha).toLocaleDateString();
        
        // Celda total
        const tdTotal = document.createElement('td');
        const spanTotal = document.createElement('span');
        spanTotal.className = 'fw-bold text-success';
        spanTotal.textContent = `$${formatearPrecio(pedido.total)}`;
        tdTotal.appendChild(spanTotal);
        
        // Celda estado
        const tdEstado = document.createElement('td');
        const spanEstado = document.createElement('span');
        spanEstado.className = `badge ${obtenerClaseEstado(pedido.estado)}`;
        spanEstado.textContent = pedido.estado;
        tdEstado.appendChild(spanEstado);
        
        // Celda productos
        const tdProductos = document.createElement('td');
        const smallProductos = document.createElement('small');
        smallProductos.textContent = `${pedido.productos?.length || 0} producto(s)`;
        tdProductos.appendChild(smallProductos);
        
        // Celda acciones
        const tdAcciones = document.createElement('td');
        const button = document.createElement('button');
        button.className = 'btn btn-outline-primary btn-sm';
        button.onclick = () => verDetallePedido(pedido.id);
        const icon = document.createElement('i');
        icon.className = 'fas fa-eye';
        button.appendChild(icon);
        button.appendChild(document.createTextNode(' Ver Detalle'));
        tdAcciones.appendChild(button);
        
        // Agregar todas las celdas a la fila
        tr.appendChild(tdId);
        tr.appendChild(tdCliente);
        tr.appendChild(tdFecha);
        tr.appendChild(tdTotal);
        tr.appendChild(tdEstado);
        tr.appendChild(tdProductos);
        tr.appendChild(tdAcciones);
        
        tbody.appendChild(tr);
    });
}

function verDetallePedido(id) {
    const pedido = pedidosActuales.find(p => p.id === id);
    if (!pedido) {
        alert('Pedido no encontrado');
        return;
    }

    const modalContent = document.getElementById('detalle-pedido-content');
    
    // Limpiar contenido anterior
    while (modalContent.firstChild) {
        modalContent.removeChild(modalContent.firstChild);
    }

    // Crear estructura principal
    const row = document.createElement('div');
    row.className = 'row';

    // Columna información del cliente
    const colCliente = document.createElement('div');
    colCliente.className = 'col-md-6';
    
    const h5Cliente = document.createElement('h5');
    const iconCliente = document.createElement('i');
    iconCliente.className = 'fas fa-user';
    h5Cliente.appendChild(iconCliente);
    h5Cliente.appendChild(document.createTextNode(' Información del Cliente'));
    
    const cardCliente = document.createElement('div');
    cardCliente.className = 'card';
    const cardBodyCliente = document.createElement('div');
    cardBodyCliente.className = 'card-body';
    
    // Información del cliente
    const pNombre = crearParrafoInfo('Nombre:', pedido.cliente?.nombre || 'No disponible');
    const pEmail = crearParrafoInfo('Email:', pedido.cliente?.email || 'No disponible');
    const pTelefono = crearParrafoInfo('Teléfono:', pedido.cliente?.telefono || 'No disponible');
    
    cardBodyCliente.appendChild(pNombre);
    cardBodyCliente.appendChild(pEmail);
    cardBodyCliente.appendChild(pTelefono);
    cardCliente.appendChild(cardBodyCliente);
    colCliente.appendChild(h5Cliente);
    colCliente.appendChild(cardCliente);

    // Columna información del pedido
    const colPedido = document.createElement('div');
    colPedido.className = 'col-md-6';
    
    const h5Pedido = document.createElement('h5');
    const iconPedido = document.createElement('i');
    iconPedido.className = 'fas fa-info-circle';
    h5Pedido.appendChild(iconPedido);
    h5Pedido.appendChild(document.createTextNode(' Información del Pedido'));
    
    const cardPedido = document.createElement('div');
    cardPedido.className = 'card';
    const cardBodyPedido = document.createElement('div');
    cardBodyPedido.className = 'card-body';
    
    // Información del pedido
    const pId = crearParrafoInfo('ID Pedido:', `#${pedido.id}`);
    const pFecha = crearParrafoInfo('Fecha:', new Date(pedido.fecha).toLocaleDateString());
    
    // Estado con badge
    const pEstado = document.createElement('p');
    const strongEstado = document.createElement('strong');
    strongEstado.textContent = 'Estado: ';
    const spanEstado = document.createElement('span');
    spanEstado.className = `badge ${obtenerClaseEstado(pedido.estado)}`;
    spanEstado.textContent = pedido.estado;
    pEstado.appendChild(strongEstado);
    pEstado.appendChild(spanEstado);
    
    // Total con formato
    const pTotal = document.createElement('p');
    const strongTotal = document.createElement('strong');
    strongTotal.textContent = 'Total: ';
    const spanTotal = document.createElement('span');
    spanTotal.className = 'text-success fs-5';
    spanTotal.textContent = `$${formatearPrecio(pedido.total)}`;
    pTotal.appendChild(strongTotal);
    pTotal.appendChild(spanTotal);
    
    cardBodyPedido.appendChild(pId);
    cardBodyPedido.appendChild(pFecha);
    cardBodyPedido.appendChild(pEstado);
    cardBodyPedido.appendChild(pTotal);
    cardPedido.appendChild(cardBodyPedido);
    colPedido.appendChild(h5Pedido);
    colPedido.appendChild(cardPedido);

    row.appendChild(colCliente);
    row.appendChild(colPedido);
    modalContent.appendChild(row);

    // Sección de productos
    const divProductos = document.createElement('div');
    divProductos.className = 'mt-4';
    
    const h5Productos = document.createElement('h5');
    const iconProductos = document.createElement('i');
    iconProductos.className = 'fas fa-shopping-cart';
    h5Productos.appendChild(iconProductos);
    h5Productos.appendChild(document.createTextNode(' Productos del Pedido'));
    
    const divTableResponsive = document.createElement('div');
    divTableResponsive.className = 'table-responsive';
    
    const table = document.createElement('table');
    table.className = 'table table-striped';
    
    // Header de la tabla
    const thead = document.createElement('thead');
    const trHead = document.createElement('tr');
    ['Producto', 'Cantidad', 'Precio Unit.', 'Subtotal'].forEach(texto => {
        const th = document.createElement('th');
        th.textContent = texto;
        trHead.appendChild(th);
    });
    thead.appendChild(trHead);
    
    // Body de la tabla
    const tbody = document.createElement('tbody');
    
    if (pedido.productos && pedido.productos.length > 0) {
        pedido.productos.forEach(item => {
            const tr = document.createElement('tr');
            
            const tdNombre = document.createElement('td');
            tdNombre.textContent = item.nombre;
            
            const tdCantidad = document.createElement('td');
            tdCantidad.textContent = item.cantidad;
            
            const tdPrecio = document.createElement('td');
            tdPrecio.textContent = `$${formatearPrecio(item.precio)}`;
            
            const tdSubtotal = document.createElement('td');
            tdSubtotal.textContent = `$${formatearPrecio(item.cantidad * item.precio)}`;
            
            tr.appendChild(tdNombre);
            tr.appendChild(tdCantidad);
            tr.appendChild(tdPrecio);
            tr.appendChild(tdSubtotal);
            tbody.appendChild(tr);
        });
    } else {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.colSpan = 4;
        td.className = 'text-center';
        td.textContent = 'No hay productos en este pedido';
        tr.appendChild(td);
        tbody.appendChild(tr);
    }
    
    // Footer de la tabla
    const tfoot = document.createElement('tfoot');
    const trFoot = document.createElement('tr');
    trFoot.className = 'table-dark';
    
    const thTotal1 = document.createElement('th');
    thTotal1.colSpan = 3;
    thTotal1.textContent = 'Total del Pedido';
    
    const thTotal2 = document.createElement('th');
    thTotal2.textContent = `$${formatearPrecio(pedido.total)}`;
    
    trFoot.appendChild(thTotal1);
    trFoot.appendChild(thTotal2);
    tfoot.appendChild(trFoot);
    
    table.appendChild(thead);
    table.appendChild(tbody);
    table.appendChild(tfoot);
    divTableResponsive.appendChild(table);
    divProductos.appendChild(h5Productos);
    divProductos.appendChild(divTableResponsive);
    modalContent.appendChild(divProductos);

    // Dirección de envío si existe
    if (pedido.direccionEnvio) {
        const divDireccion = document.createElement('div');
        divDireccion.className = 'mt-4';
        
        const h5Direccion = document.createElement('h5');
        const iconDireccion = document.createElement('i');
        iconDireccion.className = 'fas fa-map-marker-alt';
        h5Direccion.appendChild(iconDireccion);
        h5Direccion.appendChild(document.createTextNode(' Dirección de Envío'));
        
        const cardDireccion = document.createElement('div');
        cardDireccion.className = 'card';
        const cardBodyDireccion = document.createElement('div');
        cardBodyDireccion.className = 'card-body';
        
        const pDireccion = document.createElement('p');
        pDireccion.textContent = pedido.direccionEnvio;
        cardBodyDireccion.appendChild(pDireccion);
        cardDireccion.appendChild(cardBodyDireccion);
        divDireccion.appendChild(h5Direccion);
        divDireccion.appendChild(cardDireccion);
        modalContent.appendChild(divDireccion);
    }

    const modal = new bootstrap.Modal(document.getElementById('modalDetallePedido'));
    modal.show();
}

// Función auxiliar para crear párrafos de información
function crearParrafoInfo(label, value) {
    const p = document.createElement('p');
    const strong = document.createElement('strong');
    strong.textContent = label + ' ';
    p.appendChild(strong);
    p.appendChild(document.createTextNode(value));
    return p;
}

// ====================================
// FUNCIONES DE BÚSQUEDA Y FILTRADO
// ====================================

function configurarBuscadores() {
    const buscarProducto = document.getElementById('buscar-producto');
    if (buscarProducto) {
        buscarProducto.addEventListener('input', filtrarProductos);
    }
}

function buscarProductos() {
    filtrarProductos();
}

function filtrarProductos() {
    const termino = document.getElementById('buscar-producto').value.toLowerCase();
    
    if (!termino.trim()) {
        productosActuales = JSON.parse(localStorage.getItem('productos')) || obtenerProductosPorDefecto();
    } else {
        const todosLosProductos = JSON.parse(localStorage.getItem('productos')) || obtenerProductosPorDefecto();
        productosActuales = todosLosProductos.filter(producto => 
            producto.nombre.toLowerCase().includes(termino) ||
            producto.descripcion?.toLowerCase().includes(termino) ||
            producto.categoria?.toLowerCase().includes(termino)
        );
    }
    
    paginaProductosActual = 1;
    mostrarProductosVendedor();
    configurarPaginacionProductos();
}

function filtrarPedidos() {
    const estado = document.getElementById('filtro-estado').value;
    const fecha = document.getElementById('filtro-fecha').value;
    
    // Partir con todos los pedidos pero filtrar estados no relevantes
    let pedidosFiltrados = JSON.parse(localStorage.getItem('pedidos')) || obtenerPedidosPorDefecto();
    
    // Filtrar pedidos relevantes para vendedor: excluir "enviado" y "entregado"  
    const estadosRelevantes = ['pendiente', 'procesando', 'vendido', 'cancelado'];
    pedidosFiltrados = pedidosFiltrados.filter(pedido => {
        return estadosRelevantes.includes(pedido.estado.toLowerCase());
    });
    
    if (estado) {
        pedidosFiltrados = pedidosFiltrados.filter(pedido => pedido.estado === estado);
    }
    
    if (fecha) {
        const fechaFiltro = new Date(fecha).toDateString();
        pedidosFiltrados = pedidosFiltrados.filter(pedido => 
            new Date(pedido.fecha).toDateString() === fechaFiltro
        );
    }
    
    pedidosActuales = pedidosFiltrados;
    paginaPedidosActual = 1;
    mostrarPedidosVendedor();
    configurarPaginacionPedidos();
}

// ====================================
// PAGINACIÓN
// ====================================

function configurarPaginacionProductos() {
    const totalPaginas = Math.ceil(productosActuales.length / elementosPorPagina);
    const paginationContainer = document.getElementById('productos-pagination');
    
    if (!paginationContainer) return;
    
    // Limpiar contenedor
    paginationContainer.innerHTML = '';
    
    // Botón anterior
    const liAnterior = document.createElement('li');
    liAnterior.className = `page-item ${paginaProductosActual === 1 ? 'disabled' : ''}`;
    
    const linkAnterior = document.createElement('a');
    linkAnterior.className = 'page-link';
    linkAnterior.href = '#';
    linkAnterior.textContent = 'Anterior';
    linkAnterior.addEventListener('click', (e) => {
        e.preventDefault();
        cambiarPaginaProductos(paginaProductosActual - 1);
    });
    
    liAnterior.appendChild(linkAnterior);
    paginationContainer.appendChild(liAnterior);
    
    // Números de página
    for (let i = 1; i <= totalPaginas; i++) {
        const liNumero = document.createElement('li');
        liNumero.className = `page-item ${i === paginaProductosActual ? 'active' : ''}`;
        
        const linkNumero = document.createElement('a');
        linkNumero.className = 'page-link';
        linkNumero.href = '#';
        linkNumero.textContent = i;
        linkNumero.addEventListener('click', (e) => {
            e.preventDefault();
            cambiarPaginaProductos(i);
        });
        
        liNumero.appendChild(linkNumero);
        paginationContainer.appendChild(liNumero);
    }
    
    // Botón siguiente
    const liSiguiente = document.createElement('li');
    liSiguiente.className = `page-item ${paginaProductosActual === totalPaginas ? 'disabled' : ''}`;
    
    const linkSiguiente = document.createElement('a');
    linkSiguiente.className = 'page-link';
    linkSiguiente.href = '#';
    linkSiguiente.textContent = 'Siguiente';
    linkSiguiente.addEventListener('click', (e) => {
        e.preventDefault();
        cambiarPaginaProductos(paginaProductosActual + 1);
    });
    
    liSiguiente.appendChild(linkSiguiente);
    paginationContainer.appendChild(liSiguiente);
}

function configurarPaginacionPedidos() {
    const totalPaginas = Math.ceil(pedidosActuales.length / elementosPorPagina);
    const paginationContainer = document.getElementById('pedidos-pagination');
    
    if (!paginationContainer) return;
    
    // Limpiar contenedor
    paginationContainer.innerHTML = '';
    
    // Botón anterior
    const liAnterior = document.createElement('li');
    liAnterior.className = `page-item ${paginaPedidosActual === 1 ? 'disabled' : ''}`;
    
    const linkAnterior = document.createElement('a');
    linkAnterior.className = 'page-link';
    linkAnterior.href = '#';
    linkAnterior.textContent = 'Anterior';
    linkAnterior.addEventListener('click', (e) => {
        e.preventDefault();
        cambiarPaginaPedidos(paginaPedidosActual - 1);
    });
    
    liAnterior.appendChild(linkAnterior);
    paginationContainer.appendChild(liAnterior);
    
    // Números de página
    for (let i = 1; i <= totalPaginas; i++) {
        const liNumero = document.createElement('li');
        liNumero.className = `page-item ${i === paginaPedidosActual ? 'active' : ''}`;
        
        const linkNumero = document.createElement('a');
        linkNumero.className = 'page-link';
        linkNumero.href = '#';
        linkNumero.textContent = i;
        linkNumero.addEventListener('click', (e) => {
            e.preventDefault();
            cambiarPaginaPedidos(i);
        });
        
        liNumero.appendChild(linkNumero);
        paginationContainer.appendChild(liNumero);
    }
    
    // Botón siguiente
    const liSiguiente = document.createElement('li');
    liSiguiente.className = `page-item ${paginaPedidosActual === totalPaginas ? 'disabled' : ''}`;
    
    const linkSiguiente = document.createElement('a');
    linkSiguiente.className = 'page-link';
    linkSiguiente.href = '#';
    linkSiguiente.textContent = 'Siguiente';
    linkSiguiente.addEventListener('click', (e) => {
        e.preventDefault();
        cambiarPaginaPedidos(paginaPedidosActual + 1);
    });
    
    liSiguiente.appendChild(linkSiguiente);
    paginationContainer.appendChild(liSiguiente);
}

function cambiarPaginaProductos(nuevaPagina) {
    event.preventDefault();
    const totalPaginas = Math.ceil(productosActuales.length / elementosPorPagina);
    
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
        paginaProductosActual = nuevaPagina;
        mostrarProductosVendedor();
        configurarPaginacionProductos();
    }
}

function cambiarPaginaPedidos(nuevaPagina) {
    event.preventDefault();
    const totalPaginas = Math.ceil(pedidosActuales.length / elementosPorPagina);
    
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
        paginaPedidosActual = nuevaPagina;
        mostrarPedidosVendedor();
        configurarPaginacionPedidos();
    }
}

// ====================================
// FUNCIONES AUXILIARES
// ====================================

function formatearPrecio(precio) {
    return Number(precio).toLocaleString('es-CL');
}

function obtenerClaseStock(stock) {
    if (stock <= 5) return 'bg-danger';
    if (stock <= 20) return 'bg-warning text-dark';
    return 'bg-success';
}

function obtenerClaseEstado(estado) {
    switch(estado?.toLowerCase()) {
        case 'pendiente': return 'bg-warning text-dark';
        case 'procesando': return 'bg-info';
        case 'vendido': return 'bg-success';
        case 'cancelado': return 'bg-danger';
        default: return 'bg-secondary';
    }
}

function mostrarMensajeError(containerId, mensaje) {
    const container = document.getElementById(containerId);
    if (container) {
        // Limpiar contenedor
        container.innerHTML = '';
        
        // Crear fila de error
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.setAttribute('colspan', '7');
        td.className = 'text-center text-danger';
        td.textContent = mensaje;
        
        tr.appendChild(td);
        container.appendChild(tr);
    }
}

// Nota: cerrarSesion está definida en main.js

// ====================================
// DATOS POR DEFECTO
// ====================================

function obtenerProductosPorDefecto() {
    return [
        {
            id: 1,
            nombre: "Zapatos Oxford Clásicos",
            precio: 89990,
            stock: 15,
            categoria: "Formal",
            descripcion: "Zapatos Oxford de cuero genuino, perfectos para ocasiones formales",
            imagen: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
            activo: true,
            fechaCreacion: "2025-01-01"
        },
        {
            id: 2,
            nombre: "Sneakers Deportivos",
            precio: 79990,
            stock: 25,
            categoria: "Deportivo",
            descripcion: "Zapatillas deportivas de alta tecnología para máximo rendimiento",
            imagen: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
            activo: true,
            fechaCreacion: "2025-01-02"
        },
        {
            id: 3,
            nombre: "Botines de Cuero",
            precio: 129990,
            stock: 8,
            categoria: "Botas",
            descripcion: "Botines de cuero premium, ideales para el clima chileno",
            imagen: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
            activo: true,
            fechaCreacion: "2025-01-03"
        }
    ];
}

function obtenerPedidosPorDefecto() {
    return [
        {
            id: 1001,
            cliente: {
                nombre: "María González",
                email: "maria@email.com",
                telefono: "+56 9 8765 4321"
            },
            fecha: "2025-01-15",
            estado: "vendido",
            total: 169980,
            productos: [
                { nombre: "Zapatos Oxford Clásicos", cantidad: 1, precio: 89990 },
                { nombre: "Sneakers Deportivos", cantidad: 1, precio: 79990 }
            ],
            direccionEnvio: "Av. Las Condes 123, Las Condes, Santiago"
        },
        {
            id: 1002,
            cliente: {
                nombre: "Juan Pérez",
                email: "juan@email.com",
                telefono: "+56 9 1234 5678"
            },
            fecha: "2025-01-20",
            estado: "vendido",
            total: 129990,
            productos: [
                { nombre: "Botines de Cuero", cantidad: 1, precio: 129990 }
            ],
            direccionEnvio: "Pasaje Los Robles 456, Providencia, Santiago"
        },
        {
            id: 1003,
            cliente: {
                nombre: "Ana Silva",
                email: "ana@email.com",
                telefono: "+56 9 5555 6666"
            },
            fecha: "2025-01-22",
            estado: "procesando",
            total: 159980,
            productos: [
                { nombre: "Sneakers Deportivos", cantidad: 2, precio: 79990 }
            ],
            direccionEnvio: "Calle Principal 789, Ñuñoa, Santiago"
        }
    ];
}