const mongoose = require('mongoose');
const blog = require('./schema-blog');

//const frase = 'Pesquisa de Preços do sistema Compras.gov.br ganha duas novas funcionalidades';
const frase ='dfasdfasdf';
mongoose.connect('mongodb+srv://ws-tutorial:Sophia995211390@cluster0.ukb1f.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    //useNewUrlParser: true,
    //useUnifiedTopology: true
})
    .then(() => {
        console.log('Conexion funcionando');
        
        // Cambiamos el uso de callback a Promesa
        return blog.find({ 'titulo': frase });
    })
    .then((etitulo) => {
        if (etitulo.length === 0) {
            console.log('Datos no registrados');
        } else {
            console.log('Datos ya registrados');
        }
    })
    .catch((error) => {
        console.log('Dio problema: ' + error);
    });
    
setTimeout(() => {
    mongoose.connection.close();
    console.log('Cerrando conexiones');
}, 25000);