var socket = io();

//lee por parametros entregados
var params = new URLSearchParams(window.location.search);

// Si no viene nombre
if(!params.has("txt_nombre") || !params.has("txt_sala")){

    window.location = "index.html";
    throw new Error("El nombre y sala son necesarios");

}

var usuario = {
    nombre: params.get("txt_nombre"),
    sala: params.get("txt_sala")
}


socket.on('connect', function() {

    console.log('Conectado al servidor');
    
    socket.emit("entrarChat", usuario, function (resp) {
        console.log("Usuarios conectados",resp );
    });
});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


// Enviar información a todos los usuarios
/*
socket.emit('crearMensaje', {
    usuario: 'Fernando',
    mensaje: 'Hola Mundo'
}, function(resp) {
    console.log('respuesta server: ', resp);
});
*/

// Escuchar información
socket.on('crearMensaje', function(mensaje) {

    console.log('Servidor:', mensaje);

});

// Escuchar cuando un usuario entra o sale del chat
socket.on('listaPersona', function(personas) {

    console.log('Servidor:', personas);

});

// Mensajes privados
socket.on("mensajePrivado", function(mensaje) {
    console.log("Mensaje Privado: ", mensaje);
});