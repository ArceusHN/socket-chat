const { io } = require('../server'),
      {Usuarios} = require('../classes/usuarios'),
      {crearMensaje}= require('../utils/utilidades')



const   usuarios = new Usuarios()


io.on('connection', (client) => {

    // Escuchamos el evento y recibimos la data del Frontend
    client.on('entrarChat', (data,callback)=>{

        

        if(!data.nombre || !data.sala){ //Sino proporciona el nombre mandaremos un error
            
            return callback({
                error: true,
                mensaje: 'El nombre/sala es necesario'
            })

        }

        client.join(data.sala)

        usuarios.agregarPersona(client.id, data.nombre, data.sala) // Estamos almacenando las credenciales del cliente


        client.broadcast.to(data.sala).emit('listaPersona', usuarios.getPersonasPorSala(data.sala)) //Enviando la lista de personas


        callback( usuarios.getPersonasPorSala(data.sala) ) //Enviando la lista de las personas al cliente
    })


    //Un usuario enviando mensaje a todos
    client.on('crearMensaje', (data)=>{ 

        let persona = usuarios.getPersona(client.id)

        let mensaje = crearMensaje( persona.nombre, data.mensaje )

        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje)

    })


    client.on('disconnect', ()=>{

        let personaBorrada = usuarios.borrarPersona( client.id )

        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} salió`)) //Enviando un mensaje de que alguien salio
        client.broadcast.to(personaBorrada.sala).emit('listaPersona', usuarios.getPersonasPorSala()) //Enviando la lista de personas actualizada

    })

    //Escuchar Mensajes privados
    client.on('mensajePrivado', data=>{

        let persona = usuarios.getPersona(client.id)

        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre,data.mensaje))


    })
});

