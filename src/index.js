const axios = require('axios');
const cheerio = require('cheerio');

const urlPais = 'https://www.gov.br/compras/pt-br/acesso-a-informacao/noticias';

function extraerDatos(link) {
    axios.get(link).then(resp => {

        const datosHtml = resp.data;
        const $ = cheerio.load(datosHtml);
        const titulo = $('h1').text();
        const linkimg = $('img').attr('src');
        const fechaPublicacion = $('.documentPublished >.value').text()
        const texto = $('div[property="rnews:articleBody"] p:first-of-type').text();
        const datos = { titulo, linkimg, fechaPublicacion, texto };

        console.log(datos);
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