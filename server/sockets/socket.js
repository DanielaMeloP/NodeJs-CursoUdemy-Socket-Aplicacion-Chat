const { io } = require('../server');
const { Usuarios } = require("../clases/usuarios");
const { crearMensaje } = require("../utilidades/utilidades");

const usuarios = new Usuarios();

io.on('connection', (client) => {


    client.on("entrarChat", (data, callback) => {
        
        //console.log(data);

        if(!data.nombre || !data.sala) {
            return callback({
                error: true,
                mensaje: "Debe ingresar el nombre y la sala"
            });
        }

        client.join(data.sala);

        usuarios.agregarPersona( client.id, data.nombre, data.sala );
        
        client.broadcast.to(data.sala).emit("listaPersona", usuarios.getPersonasPorSala(data.sala));
        client.broadcast.to(data.sala).emit("crearMensaje", crearMensaje("Administrador", `${data.nombre} se unió al chat`));
       
       // console.log(usuario);

        //callback(personas);
        callback(usuarios.getPersonasPorSala(data.sala));

    });


    client.on("crearMensaje", (data, callback) => {

        let persona = usuarios.getPersona(client.id);

        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(persona.sala).emit("crearMensaje", mensaje);
         

        callback(mensaje);

    });


    client.on("disconnect", (data) => {

        let personaBorrada = usuarios.borrarPersona( client.id );
        
        client.broadcast.to(personaBorrada.sala).emit("crearMensaje", crearMensaje("Administrador", `${personaBorrada.nombre} salio del chat`));
        client.broadcast.to(personaBorrada.sala).emit("listaPersona", usuarios.getPersonasPorSala(data.sala));
       
    });

    client.on("mensajePrivado", data => {
        
        let persona = usuarios.getPersona(client.id);
        client.broadcast.to(data.para).emit("mensajePrivado", crearMensaje(persona.nombre, data.mensaje));


    });



});