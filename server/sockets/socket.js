const { io } = require('../server');
/** Modelo de usuarios para el chat */
const { Usuarios } = require('../classes/usuarios');
const users = new Usuarios();

/** Funcion utils para envio de mensaje */
const { crearMsg } = require('../utils/utils');

/** Valida la conecxión */
io.on('connection', (client) => {
    /** Valida cuando alguien entra al chat */
    client.on('entrarChat', (data, callback) => {
        if (!data.nombre || !data.sala)
            return callback({ error: true, msg: 'El nombre del Usuario y la sala son requeridos' });

        /** UNE AL USUARIO A UNA SALA */
        client.join(data.sala);

        let usersList = users.agregarPersona(client.id, data.nombre, data.sala);
        let mensaje = crearMsg('Administrador', `${data.nombre} Ingresó`);
        // envía la lista los nuevos participantes a todas las personas de la sala
        client.broadcast.to(data.sala).emit('listaPersonas', mensaje);
        callback(users.getPersonasSala(data.sala));
    });

    /** Valida cuando alquien se desconecta del chat */
    client.on('disconnect', () => {
        let userDelete = users.borrarPersona(client.id);
        // informa a todos los usuarios que alguien se desconecto
        client.broadcast.to(userDelete.sala).emit('crearMsg', crearMsg('Administrador', `${userDelete.nombre} salió`));
        // envía el nuevo listado de participantes a todos en la sala
        client.broadcast.to(userDelete.sala).emit('listaPersonas', users.getPersonasSala(userDelete.sala));
    });

    /** escucha cuando un usuario ha enviado un mensaje a todos */
    client.on('crearMensaje', (data, callback) => {
        if (!data.mensaje)
            return callback({ error: true, msg: 'Es necesario enviar el mensaje' });

        let usuario = users.getpersona(client.id);
        let mensaje = crearMsg(usuario.nombre, data.mensaje);
        client.broadcast.to(usuario.sala).emit('listaPersonas', mensaje);
        callback({ msg: 'Mensaje enviado' });
    });

    client.on('mensajePrivado', (data, callback) => {
        if ((!data.to) || (!data.mensaje))
            return callback({ error: true, msg: 'Es necesario enviar el destinatario y el mensaje' });

        let usuario = users.getpersona(client.id);
        let mensaje = crearMsg(usuario.nombre, data.mensaje);
        client.broadcast.to(data.to).emit('mensajePrivado', mensaje);
    });
});