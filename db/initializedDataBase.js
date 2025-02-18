const db = require('./db');

const initializedDataBase = async ()=>{
    try {
        const connection = await db.getConnection();
        // create allUser Database Table 
        const createAllUserTable =  `
        CREATE TABLE IF NOT EXISTS allUsers (
            id INT AUTO_INCREMENT PRIMARY KEY,
            avatar LONGTEXT,
            first_name VARCHAR(255) NOT NULL,
            last_name VARCHAR(255) NOT NULL,
            bio VARCHAR(255) ,
            email VARCHAR(255) UNIQUE NOT NULL,
            date_of_birth VARCHAR(255),
            password VARCHAR(255) NOT NULL,
            phone_number VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            `;
        
        const res =  await connection.query(createAllUserTable);

        // create allUser Database Table 
        if(res[0].warningStatus===0){
            console.log('initialized the data base with schema' , );
        }
        connection.release();
    } catch (error) {
        console.log(`Error while initialized data base`)
    }
}

module.exports = initializedDataBase;