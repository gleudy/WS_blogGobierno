/* 
Objetivo:
Extraciones: 
    titulo
    linkimg
    Fehca de publicacion 
    texto
*/

const axios=require('axios');
const cheerio=require('cheerio');

const urlHijo='https://www.gov.br/compras/pt-br/acesso-a-informacao/noticias/pesquisa-de-precos-do-sistema-compras-gov-br-ganha-duas-novas-funcionalidades';

axios.get(urlHijo).then(resp=>{
    const datos=[];
    const datosHtml=resp.data;
    const $=cheerio.load(datosHtml);
    const titulo=$('h1').text();
    const linkimg=$('img').attr('src');
    const fechaPublicacion=$('.documentPublished >.value').text()
    const texto=$('div[property="rnews:articleBody"] p:first-of-type').text();
    const dato={titulo,linkimg,fechaPublicacion,texto};
    datos.push(dato);
    console.log(datos);
})
