require("dotenv").config();
const mysql2 = require("mysql2/promise");

const db  = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

(async()=>{
    try {
        const connection = await db.getConnection();
        console.log('Database connection successful');
        connection.release();
    } catch (err) {
        console.error('Database connection error:', err);
    }
})()
mysql://root:CbfKhXWXvOMRrnhrZICXxmXMPMiJDPZM@tramway.proxy.rlwy.net:48949/railway



module.exports = db;
