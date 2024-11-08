const axios = require('axios');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const blog = require('./schema-blog'); // Ruta relativa, asumiendo que ambos archivos están en la misma carpeta

const urlPais = 'https://www.gov.br/compras/pt-br/acesso-a-informacao/noticias';

async function conectarDB() {
    try {
        await mongoose.connect('mongodb+srv://ws-tutorial:Sophia995211390@cluster0.ukb1f.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
        console.log('Conexión funcionando');
    } catch (error) {
        console.error('Dio problema: ' + error);
    }
}

async function salvandoDatos(dt) {
    const nuevoDato = new blog({
        titulo: dt.titulo,
        linkimg: dt.linkimg,
        fechaPublicacion: dt.fechaPublicacion,
        texto: dt.texto
    });

    try {
        const etitulo = await blog.find({ 'titulo': dt.titulo });
        if (etitulo.length === 0) {
            await nuevoDato.save();
            console.log('Datos no registrados, guardando ahora.');
        } else {
            console.log('Datos ya registrados.');
        }
    } catch (err) {
        console.error('Error al guardar datos: ' + err);
    }
}

async function extraerDatos(link) {
    try {
        const resp = await axios.get(link);
        const datosHtml = resp.data;
        const $ = cheerio.load(datosHtml);
        
        const titulo = $('h1').text();
        const linkimg = $('img').attr('src');
        const fechaPublicacion = $('.documentPublished > .value').text();
        const texto = $('div[property="rnews:articleBody"] p:first-of-type').text();
        
        const datos = { titulo, linkimg, fechaPublicacion, texto };
        await salvandoDatos(datos);
    } catch (error) {
        console.error('Error al extraer datos: ' + error);
    }
}

async function obtenerLinks() {
    try {
        const resp = await axios.get(urlPais);
        const datosHtml = resp.data;
        const $ = cheerio.load(datosHtml);
        
        const links = [];
        $('a[class="summary url"]').each((i, e) => {
            const link = $(e).attr('href');
            links.push(link);
        });

        return links;
    } catch (error) {
        console.error('Error al obtener links: ' + error);
        return [];
    }
}

async function main() {
    await conectarDB();
    
    const links = await obtenerLinks();
    await Promise.all(links.map(link => extraerDatos(link)));

    // Cerrar la conexión después de procesar todos los datos
    await mongoose.connection.close();
    console.log('Conexión cerrada');
}

main();
