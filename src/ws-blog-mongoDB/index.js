const axios = require('axios');
const cheerio = require('cheerio');
const mongoose = require('mongoose');

const blog = require('./schema-blog'); // Ruta relativa, asumiendo que ambos archivos están en la misma carpeta


const urlPais = 'https://www.gov.br/compras/pt-br/acesso-a-informacao/noticias';

mongoose.connect('mongodb+srv://ws-tutorial:Sophia995211390@cluster0.ukb1f.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    //useNewUrlParser: true,
    //useUnifiedTopology: true
})
    .then(result => {
        console.log('conexion funcionando')
    })
    .catch(error => {
        console.log('Dio problema' + error)
    })

function salvandoDatos(dt) {
    const nuevoDato = new blog({
        titulo: dt.titulo,
        linkimg: dt.linkimg,
        fechaPublicacion: dt.fechaPublicacion,
        texto: dt.texto
    })
    nuevoDato
        .save();
}
function extraerDatos(link) {
    axios.get(link)
        .then(resp => {

            const datosHtml = resp.data;
            const $ = cheerio.load(datosHtml);
            const titulo = $('h1').text();
            const linkimg = $('img').attr('src');
            const fechaPublicacion = $('.documentPublished >.value').text()
            const texto = $('div[property="rnews:articleBody"] p:first-of-type').text();
            const datos = { titulo, linkimg, fechaPublicacion, texto };

            //console.log(datos);
            salvandoDatos(datos);
        })
};

const links = axios.get(urlPais).then(resp => {
    const datosHtml = resp.data;
    const $ = cheerio.load(datosHtml);
    const datos = []
    $('a[class="summary url"]').each((i, e) => {
        const link = $(e).attr('href');

        datos.push(link)

    })
    //console.log(datos);
    return datos;
})

async function main() {
    const link = await links;
    link.map((i, e) => {
        extraerDatos(i);
    })
}

main();
