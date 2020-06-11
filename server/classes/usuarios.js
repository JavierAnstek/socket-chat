class Usuarios {

    constructor() {
        this.personasChat = [];
    }

    /** Agrega personas al chat */
    agregarPersona(id, nombre, sala) {
        // defino la estructura del objeto
        let persona = { id, nombre, sala };
        // agrego al listado del chat
        this.personasChat.push(persona);
        return this.personasChat;
    }

    /** obtine info de la persona por el id 
     * [0]: se pone este valor porque este metodo
     * retorna un arreglo y solo necesitamos la
     * primera posición
     */
    getpersona(id) {
        let persona = this.personasChat.filter(persona => persona.id === id)[0];
        return persona;
    }

    /** Obtiene a todas las personas */
    getPersonasChat() {
        return this.personasChat;
    }

    /** retorna personas por sala */
    getPersonasSala(sala) {
        let personasChat = this.personasChat.filter(persona => persona.sala === sala);
        return personasChat;
    }

    /** Elimina un usuario del listado */
    borrarPersona(id) {
        let personaBorrada = this.getpersona(id);
        this.personasChat = this.personasChat.filter(persona => persona.id != id);
        return personaBorrada;
    }
}

module.exports = { Usuarios };