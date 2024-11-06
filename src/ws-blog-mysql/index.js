const axios = require('axios');
const cheerio = require('cheerio');
const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'blog',
    charset: 'utf8mb4'
}); 
const salvandoDatos=(dt)=>{

}
function grabando(lineas) {
    const datos = {
        titulo: lineas.titulo,
        linkimg: lineas.linkimg,
        texto: lineas.texto
    }
    pool.getConnection(function (err, connection) {
        if (err) throw err;
        connection.query('INSERT INTO noticias set ?', datos, function (error, result, fields) {
            console.log(datos);
            connection.release();

            if (error) throw error;
        })

    })
}

const url = 'https://www.gov.br/compras/pt-br/acesso-a-informacao/noticias';

function extraerDatos(link) {
    axios.get(link).then(resp => {

        const datosHtml = resp.data;
        const $ = cheerio.load(datosHtml);
        const titulo = $('h1').text();
        const linkimg = $('img').attr('src');
        //const fechaPublicacion = $('.documentPublished >.value').text()
        const texto = $('div[property="rnews:articleBody"] p:first-of-type').text();
        const datos = { titulo, linkimg, texto }; //fechaPublicacion

        //console.log(datos);
        grabando(datos);
    });
};

const links = axios.get(url).then(resp => {
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