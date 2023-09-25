const mysql = require("mysql2"); //เรียกใช้ mysql2 (link in database)
const dbconfig = require("../config/db.config"); //เรียกตัว module จาก  db.config 

const connection = mysql.createConnection({ //link เข้ากับ sql โดยใช้ข้อมูลจาก dbconfig.js
    host: dbconfig.HOST, //Host from db.config
    user: dbconfig.USER, //user from db.config
    password: dbconfig.PASSWORD, //password from db.config
    database: dbconfig.DB,// database from db.config
    port:3306
});
connection.connect((error)=>{ //check error
    if(error) console.log("MYsql connection " +error);//error : show error
    else console.log("Successfully connected to database");//not error : show success that can connnect to database
});
module.exports = connection; //exprots เพื่อให้ file อื่นใช้ได้โดย require("ที่อยู่ไฟล์นี้")