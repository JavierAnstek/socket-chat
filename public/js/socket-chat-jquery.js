/** Toma los datos que vienen por parametro */
var params = new URLSearchParams(window.location.search);
var nombre = params.get('nombre');
var sala = params.get('sala');

/** Referencias JQUERY */
var divUsuarios = $('#divUsuarios');
var formSend = $('#formSend');
var txtMsg = $('#txtMsg');
var divChatbox = $('#divChatbox');

/** Funciones para renderizar usuarios */
function renderUsers(usersList) {
    var html = '';

    // Cabecera de la sala
    html += '<li>';
    html += '<a href="javascript:void(0)" class="active"> Chat de <span>' + sala + '</span></a>';
    html += '</li>';

    for (let i = 0; i < usersList.length; i++) {
        html += '<li>';
        html += '<a data-id="' + usersList[i].id + '" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>' + usersList[i].nombre + '<small class="text-success">online</small></span></a>';
        html += '</li>';
    }

    divUsuarios.html(html);
}

/** Renderiza los mensajes */
function rendesMsg(mensaje, yo) {
    var fecha = new Date(mensaje.fecha);
    var hora = fecha.getHours() + ':' + fecha.getMinutes();
    var adminCss = 'info';
    if (mensaje.nombre === 'Administrador')
        adminCss = 'danger';

    if (yo) {
        html = '<li class="reverse">';
        html += '<div class="chat-content">';
        html += '<h5>' + mensaje.nombre + '</h5>';
        html += '<div class="box bg-light-inverse">' + mensaje.msg + '</div>';
        html += '</div>';
        html += '<div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';
        html += '<div class="chat-time">' + hora + '</div>';
        html += '</li>';
    } else {
        html = '<li class="animated fadeIn">';
        if (mensaje.nombre != 'Administrador')
            html += '<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
        html += '<div class="chat-content">';
        html += ' <h5>' + mensaje.nombre + '</h5>';
        html += '<div class="box bg-light-' + adminCss + '">' + mensaje.msg + '</div>';
        html += '</div>';
        html += ' <div class="chat-time">' + hora + '</div>';
        html += '</li>';
    }

    divChatbox.append(html);
}
/** Listener selecciona usuario */
divUsuarios.on('click', 'a', function() {
    var id = $(this).data('id');
    if (id) {
        console.log(id);
    }
});

/** Contról de envío de mensaje */
formSend.on('submit', function(e) {
    e.preventDefault();
    if (txtMsg.val().trim().length === 0) return;

    // Enviar información
    socket.emit('crearMensaje', { nombre: nombre, mensaje: txtMsg.val() }, function(mensaje) {
        txtMsg.val('').focus();
        rendesMsg(mensaje, true);
        scrollBottom();
    });
});

/** gestiona el scroll */
function scrollBottom() {
    // selectors
    var newMessage = divChatbox.children('li:last-child');
    //heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}