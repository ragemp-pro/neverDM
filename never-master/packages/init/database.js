const mysql = require('mysql');
global.DB = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'server'
});

DB.connect((err) => {
    if (err) return console.log('error connect: ' + err.stack);
    console.log('[DATABASE] Connected to database');
});


    