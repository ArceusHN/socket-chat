var socket = io();

const params = new URLSearchParams(window.location.search)

if(!params.has('nombre') || !params.has('sala')){
    window.location = 'index.html'
    throw new Error('El nombre y sala son necesarios')
}

const usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
}


socket.on('connect', function() { //Conexion al servidor
    console.log('Conectado al servidor');
    

    socket.emit('entrarChat', usuario, function(resp){//Emitmos un evento para entrar al chat y mandamos las credenciales
        console.log('Usuarios conectados', resp)
    })


});

// escuchar
socket.on('disconnect', function() {

   

});


// Enviar información
// socket.emit('enviarMensaje', {
//     usuario: 'Fernando',
//     mensaje: 'Hola Mundo'
// }, function(resp) {
//     console.log('respuesta server: ', resp);
// });

// Escuchar información
socket.on('crearMensaje', function(mensaje) {

    console.log('Servidor:', mensaje);

});


//Escuchar cambios de usuarios - Cuando un usuario entre o sale del chat

socket.on('listaPersona', function(personas) {

    console.log(personas);

});


//Escuchar Mensajes privados

socket.on('mensajePrivado', function(mensaje){

    console.log('Mensaje Privado', mensaje)

})
