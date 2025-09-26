// Funcionalidades del formulario de contacto

document.addEventListener('DOMContentLoaded', function() {
    // Configurar formulario de contacto
    const contactoForm = document.getElementById('contacto-form');
    if (contactoForm) {
        contactoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            validarFormularioContacto();
        });
    }

    // Configurar contador de caracteres para comentario
    const comentarioTextarea = document.getElementById('contacto-comentario');
    const contarCaracteres = document.getElementById('contar-caracteres');

    if (comentarioTextarea && contarCaracteres) {
        comentarioTextarea.addEventListener('input', function() {
            const currentLength = this.value.length;
            contarCaracteres.textContent = currentLength;

            // Cambiar color si se acerca al límite
            if (currentLength > 450) {
                contarCaracteres.style.color = '#ff4757';
            } else if (currentLength > 400) {
                contarCaracteres.style.color = '#ffa502';
            } else {
                contarCaracteres.style.color = '#747d8c';
            }
        });
    }
});

// Validar formulario de contacto
function validarFormularioContacto() {
    const contactoForm = document.getElementById('contacto-form');
    const nombre = document.getElementById('contacto-nombre');
    const correo = document.getElementById('contacto-correo');
    const comentario = document.getElementById('contacto-comentario');
    
    let esValido = true;
    
    // Validar nombre
    if (!nombre.value.trim()) {
        mostrarError('contacto-nombre-error', 'El nombre es requerido');
        esValido = false;
    } else if (nombre.value.trim().length > 100) {
        mostrarError('contacto-nombre-error', 'El nombre no puede tener más de 100 caracteres');
        esValido = false;
    } else {
        ocultarError('contacto-nombre-error');
    }
    
    // Validar correo
    if (!correo.value.trim()) {
        mostrarError('contacto-correo-error', 'El correo es requerido');
        esValido = false;
    } else if (!validarEmail(correo.value)) {
        mostrarError('contacto-correo-error', 'Ingresa un correo válido');
        esValido = false;
    } else if (correo.value.length > 100) {
        mostrarError('contacto-correo-error', 'El correo no puede tener más de 100 caracteres');
        esValido = false;
    } else if (!estaPermitidoEmail(correo.value)) {
        mostrarError('contacto-correo-error', 'Solo se permiten correos @duoc.cl, @profesor.duoc.cl y @gmail.com');
        esValido = false;
    } else {
        ocultarError('contacto-correo-error');
    }
    
    // Validar comentario
    if (!comentario.value.trim()) {
        mostrarError('contacto-comentario-error', 'El comentario es requerido');
        esValido = false;
    } else if (comentario.value.length > 500) {
        mostrarError('contacto-comentario-error', 'El comentario no puede tener más de 500 caracteres');
        esValido = false;
    } else {
        ocultarError('contacto-comentario-error');
    }

    if (esValido) {
        // Crear objeto con datos del contacto
        const datosContacto = {
            nombre: nombre.value.trim(),
            correo: correo.value.toLowerCase().trim(),
            comentario: comentario.value.trim(),
            fecha: new Date().toISOString()
        };
        
        // Guardar en localStorage (simulando envío)
        const contactos = JSON.parse(localStorage.getItem('contactos')) || [];
        contactos.push(datosContacto);
        localStorage.setItem('contactos', JSON.stringify(contactos));
        
        // Mostrar mensaje de éxito
        alert('¡Gracias por contactarnos! Tu mensaje ha sido enviado correctamente. Te responderemos pronto.');
        
        // Limpiar formulario
        if (contactoForm) {
            contactoForm.reset();
        }
        
        const charCountElement = document.getElementById('char-count');
        if (charCountElement) {
            charCountElement.textContent = '0';
            charCountElement.style.color = '#747d8c';
        }
        
        // Redirigir al inicio después de 1 segundo
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }
}

// Nota: validarEmail está definida en main.js

// Función para verificar si el email está permitido
function estaPermitidoEmail(email) {
    const dominiosPermitidos = ['duoc.cl', 'profesor.duoc.cl', 'gmail.com'];
    const dominio = email.split('@')[1];
    return dominiosPermitidos.includes(dominio);
}

// Función para mostrar errores
function mostrarError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

// Función para ocultar errores
function ocultarError(elementId) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}