// Funcionalidades
document.addEventListener('DOMContentLoaded', function() {
    cargarArticulosBlog();
    configurarFiltrosBlog();
    configurarPaginacionBlog();
});

// Base de datos de artículos del blog 
const articulosBlog = [
    {
        id: 1,
        titulo: "Tendencias Otoño 2025",
        resumen: "Los estilos que marcarán esta temporada.",
        categoria: "tendencias",
        fecha: "2025-09-20",
        imagen: "./assets/img/blog/tendenciasotono2025.avif",
        contenido: "Este otoño trae botines con texturas, colores tierra y materiales sustentables que están dominando las tendencias de calzado."
    },
    {
        id: 2,
        titulo: "Cuidar Zapatos de Cuero",
        resumen: "Mantén tus zapatos como nuevos.",
        categoria: "cuidado",
        fecha: "2025-09-18",
        imagen: "./assets/img/blog/cuidarzapatoscuero.avif",
        contenido: "El cuero requiere cuidados específicos. Limpia, nutre y protege tus zapatos regularmente para que duren años."
    },
    {
        id: 3,
        titulo: "5 Zapatos Esenciales",
        resumen: "Los básicos que no pueden faltar.",
        categoria: "consejos",
        fecha: "2025-09-15",
        imagen: "./assets/img/blog/zapatosesenciales.avif",
        contenido: "Sneakers blancos, zapatos oxford, botines versátiles, sandalias cómodas y zapatos deportivos. Estos cinco tipos cubren todas las ocasiones."
    },
    {
        id: 4,
        titulo: "Combinar con Estilo",
        resumen: "Aprende las reglas básicas del matching.",
        categoria: "estilo",
        fecha: "2025-09-12",
        imagen: "./assets/img/blog/combinarestilo.avif",
        contenido: "La combinación correcta de zapatos puede transformar cualquier outfit. Conoce las reglas fundamentales y cuándo romperlas."
    }
];

// Variables de paginación
let paginaActual = 1;
const articulosPorPagina = 6;
let categoriaActual = 'todos';

// Cargar artículos del blog
function cargarArticulosBlog() {
    const articulosFiltrados = filtrarArticulos();
    const totalPaginas = Math.ceil(articulosFiltrados.length / articulosPorPagina);
    
    const inicio = (paginaActual - 1) * articulosPorPagina;
    const fin = inicio + articulosPorPagina;
    const articulosPagina = articulosFiltrados.slice(inicio, fin);
    
    const contenedorArticulos = document.getElementById('blog-articulos');
    
    // Limpiar contenedor
    while (contenedorArticulos.firstChild) {
        contenedorArticulos.removeChild(contenedorArticulos.firstChild);
    }
    
    // Crear elementos DOM para cada artículo
    articulosPagina.forEach(articulo => {
        const articleElement = crearElementoArticulo(articulo);
        contenedorArticulos.appendChild(articleElement);
    });
    
    // Actualizar información de paginación
    document.getElementById('current-page').textContent = paginaActual;
    document.getElementById('total-pages').textContent = totalPaginas;
    
    // Actualizar botones de paginación
    document.getElementById('prev-page').disabled = paginaActual === 1;
    document.getElementById('next-page').disabled = paginaActual === totalPaginas;
}

// Crear elemento DOM para un artículo (versión minimalista)
function crearElementoArticulo(articulo) {
    // Crear elemento principal del artículo
    const article = document.createElement('article');
    article.className = 'blog-tarjeta';
    article.setAttribute('data-category', articulo.categoria);
    
    // Crear contenedor de imagen
    const imageContainer = document.createElement('div');
    imageContainer.className = 'blog-imagen';
    
    const img = document.createElement('img');
    img.src = articulo.imagen;
    img.alt = articulo.titulo;
    
    const categoryBadge = document.createElement('div');
    categoryBadge.className = 'blog-categoria';
    categoryBadge.textContent = capitalizarTexto(articulo.categoria);
    
    imageContainer.appendChild(img);
    imageContainer.appendChild(categoryBadge);
    
    // Crear contenedor de contenido
    const contentContainer = document.createElement('div');
    contentContainer.className = 'blog-contenido';
    
    // Crear título
    const title = document.createElement('h3');
    title.className = 'blog-titulo';
    title.textContent = articulo.titulo;
    
    // Crear extracto
    const excerpt = document.createElement('p');
    excerpt.className = 'blog-extracto';
    excerpt.textContent = articulo.resumen;
    
    // Crear botón leer más
    const readMoreBtn = document.createElement('button');
    readMoreBtn.className = 'blog-leer-mas';
    readMoreBtn.textContent = 'Leer más';
    
    // Agregar evento al botón
    readMoreBtn.addEventListener('click', () => abrirArticulo(articulo.id));
    
    // Ensamblar contenido
    contentContainer.appendChild(title);
    contentContainer.appendChild(excerpt);
    contentContainer.appendChild(readMoreBtn);
    
    // Ensamblar artículo completo
    article.appendChild(imageContainer);
    article.appendChild(contentContainer);
    
    return article;
}

// Filtrar artículos por categoría
function filtrarArticulos() {
    if (categoriaActual === 'todos') {
        return articulosBlog;
    }
    return articulosBlog.filter(articulo => articulo.categoria === categoriaActual);
}

// Configurar filtros del blog
function configurarFiltrosBlog() {
    const botonesFiltro = document.querySelectorAll('.filter-btn');
    
    botonesFiltro.forEach(boton => {
        boton.addEventListener('click', function() {
            // Remover clase active de todos los botones
            botonesFiltro.forEach(btn => btn.classList.remove('active'));
            
            // Agregar clase active al botón clickeado
            this.classList.add('active');
            
            // Actualizar categoría actual y resetear paginación
            categoriaActual = this.dataset.category;
            paginaActual = 1;
            
            // Recargar artículos
            cargarArticulosBlog();
        });
    });
}

// Configurar paginación
function configurarPaginacionBlog() {
    document.getElementById('prev-page').addEventListener('click', function() {
        if (paginaActual > 1) {
            paginaActual--;
            cargarArticulosBlog();
            window.scrollTo(0, 0);
        }
    });
    
    document.getElementById('next-page').addEventListener('click', function() {
        const articulosFiltrados = filtrarArticulos();
        const totalPaginas = Math.ceil(articulosFiltrados.length / articulosPorPagina);
        
        if (paginaActual < totalPaginas) {
            paginaActual++;
            cargarArticulosBlog();
            window.scrollTo(0, 0);
        }
    });
}

// Abrir artículo completo 
function abrirArticulo(id) {
    const articulo = articulosBlog.find(art => art.id === id);
    
    if (articulo) {
        // Crear modal para mostrar el artículo completo
        const modal = crearModalArticulo(articulo);
        document.body.appendChild(modal);
        
        // Mostrar modal
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
    }
}

// Crear modal para mostrar artículo completo
function crearModalArticulo(articulo) {
    const modal = document.createElement('div');
    modal.className = 'blog-modal';
    
    // Crear contenido del modal
    const modalContent = document.createElement('div');
    modalContent.className = 'blog-modal-contenido';
    
    // Crear header del modal
    const modalHeader = document.createElement('div');
    modalHeader.className = 'blog-modal-encabezado';
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'blog-modal-cerrar';
    closeBtn.textContent = '×';
    
    modalHeader.appendChild(closeBtn);
    
    // Crear body del modal
    const modalBody = document.createElement('div');
    modalBody.className = 'blog-modal-cuerpo';
    
    // Crear imagen
    const modalImage = document.createElement('img');
    modalImage.src = articulo.imagen;
    modalImage.alt = articulo.titulo;
    modalImage.className = 'blog-modal-imagen';
    
    // Crear categoría simplificada
    const categorySpan = document.createElement('span');
    categorySpan.className = 'blog-categoria';
    categorySpan.textContent = capitalizarTexto(articulo.categoria);
    
    // Crear título
    const modalTitle = document.createElement('h1');
    modalTitle.className = 'blog-modal-titulo';
    modalTitle.textContent = articulo.titulo;
    
    // Crear contenido de texto simplificado
    const modalText = document.createElement('div');
    modalText.className = 'blog-modal-texto';
    
    const paragraph = document.createElement('p');
    paragraph.textContent = articulo.contenido;
    
    modalText.appendChild(paragraph);
    
    // Ensamblar body del modal
    modalBody.appendChild(modalImage);
    modalBody.appendChild(categorySpan);
    modalBody.appendChild(modalTitle);
    modalBody.appendChild(modalText);
    
    // Ensamblar modal completo
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modal.appendChild(modalContent);
    
    // Agregar evento para cerrar modal
    closeBtn.addEventListener('click', function() {
        modal.classList.remove('active');
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    });
    
    // Cerrar modal al hacer clic fuera
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                if (modal.parentNode) {
                    modal.parentNode.removeChild(modal);
                }
            }, 300);
        }
    });
    
    return modal;
}

// Funciones auxiliares
function formatearFecha(fechaString) {
    const fecha = new Date(fechaString);
    const opciones = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return fecha.toLocaleDateString('es-CL', opciones);
}

function capitalizarTexto(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}