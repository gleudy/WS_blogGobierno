const axios = require('axios');
const cheerio = require('cheerio');
const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 25, // Si quiero que se registren mas datos a la vez aumento este numero
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'blog',
    charset: 'utf8mb4'
});

const salvandoDatos = (dt) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) return reject(err);
            connection.query('INSERT INTO noticias SET ?', dt, function (error, result) {
                console.log('Registrando noticias');
                connection.release();
                if (error) return reject(error);
                resolve(result);
            });
        });
    });
};

function grabando(lineas) {
    return new Promise((resolve, reject) => {
        const datos = {
            titulo: lineas.titulo,
            linkimg: lineas.linkimg,
            texto: lineas.texto
        };
        pool.getConnection((err, connection) => {
            if (err) return reject(err);
            connection.query('SELECT * FROM `noticias` WHERE `titulo` = ?', datos.titulo, (error, result) => {
                if (error) return reject(error);
                if (result.length === 0) {
                    salvandoDatos(datos).then(resolve).catch(reject);
                } else {
                    console.log('Titulo registrado :-)');
                    resolve();
                }
                connection.release();
            });
        });
    });
}

const url = 'https://www.gov.br/compras/pt-br/acesso-a-informacao/noticias';

function extraerDatos(link) {
    return axios.get(link).then(resp => {
        const datosHtml = resp.data;
        const $ = cheerio.load(datosHtml);
        const titulo = $('h1').text();
        const linkimg = $('img').attr('src');
        const texto = $('div[property="rnews:articleBody"] p:first-of-type').text();
        const datos = { titulo, linkimg, texto };

        return grabando(datos);
    });
}

const links = axios.get(url).then(resp => {
    const datosHtml = resp.data;
    const $ = cheerio.load(datosHtml);
    const datos = [];
    $('a[class="summary url"]').each((i, e) => {
        const link = $(e).attr('href');
        datos.push(link);
    });
    return datos;
});

async function main() {
    const linkList = await links;
    await Promise.all(linkList.map(link => extraerDatos(link))); // Asegúrate de que extraerDatos retorna una promesa
    pool.end(); // Cierra el pool solo después de que todas las promesas se completen
}

main();
