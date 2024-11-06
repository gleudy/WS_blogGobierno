const mysql = require('mysql');

//const titulo='Compras.gov.br já tem mais de 700 mil fornecedores e 4 mil municípios credenciados';
const titulo='no existe este titulo';
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'blog',
    charset: 'utf8mb4'
});

const consulta = (msg) => {
    pool.getConnection(function (err, connection) {
        if (err) throw err;
        connection.query('select * from `noticias` where `titulo`=?',msg,function(error,result,fields){
            let countResult=result.length
            if(countResult===0){
                console.log('TITULO no registrado!');
            }else{
                console.log('Titulo registrado :-)')
            }
            if(error) throw error;
        });
    })
}

consulta(titulo);