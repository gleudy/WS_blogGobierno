const axios = require('axios');
const cheerio = require('cheerio');

const urlPais = 'https://www.gov.br/compras/pt-br/acesso-a-informacao/noticias';

axios.get(urlPais).then(resp => {
    const datosHtml = resp.data;
    const $ = cheerio.load(datosHtml);
    const datos=[]
    $('a[class="summary url"]').each((i, e) => {
        const link = $(e).attr('href');
        
        datos.push(link)
        
    })
    console.log(datos);
})