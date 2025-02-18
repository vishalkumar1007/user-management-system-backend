const mysql2 = require("mysql2/promise");

const db  = mysql2.createPool({
    host: "localhost",
    user: "root",
    password: "Vishal@17",
    database: "mysql_db",
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




module.exports = db;
