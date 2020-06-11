var socket = io();

/** Toma los datos que vienen por parametro */
var params = new URLSearchParams(window.location.search);
if ((!params.has('nombre') || !params.has('sala')) || (params.get('nombre') === "" || params.get('sala') === "")) {
    window.location = 'index.html';
    throw new Error('El nombre y la sala son necesarios');
}

/** estructura el objeto */
var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
};

/** Conecta el servidor de sockets 
 * usa el callback para presentar la nueva
 * lista de usuarios conectados
 */
socket.on('connect', function() {
    // envía info de conexión al chat
    socket.emit('entrarChat', usuario, function(resp) {
        if (resp.error === true)
            console.log(resp.msg);
        else
            console.log('Usuarios conectados: ', resp);
    });
    console.log('Conectado al servidor');
});

/** Escucha desconexión del servidor */
socket.on('disconnect', function() {
    console.log('Perdimos conexión con el servidor');
});

// Enviar información
socket.emit('crearMensaje', { mensaje: 'Hola Mundo' }, function(resp) {
    // console.log('respuesta server: ', resp);
});

// Escuchar cuando un usuario sale del chat
socket.on('crearMsg', function(mensaje) {
    console.log('Servidor:', mensaje);
});

// Escuchar cuando un usuario entra o sale del chat
socket.on('listaPersonas', function(mensaje) {
    console.log(`[${mensaje.nombre}]: ${mensaje.msg}`);
});

// envíe mensaje privado
socket.on('mensajePrivado', function(mensaje) {
    console.log('mensaje privado: ', mensaje);
});