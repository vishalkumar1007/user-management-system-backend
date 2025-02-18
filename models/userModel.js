const db =  require('../db/db');

const createUser = async (userData)=>{
    const {avatar, first_name , last_name , bio , email , date_of_birth , password , phone_number} = userData;
    const query = `INSERT INTO allUsers (avatar,first_name,last_name,bio,email,date_of_birth,password,phone_number) VALUE (?, ?, ?, ?, ?, ?, ?,?)`;
    const [result]  = await db.execute(query,[avatar,first_name,last_name,bio,email,date_of_birth,password,phone_number]);
    return result;
}

const authLogin = async (userData)=>{
    const {email,password} = userData;
    const query = `SELECT * FROM allUsers WHERE email = ? AND password = ?`;
    
    const [result] = await db.execute(query,[email,password]);
    return result.length>0?result:null;
}

const verifyEmailId = async (email)=>{
    const query = `SELECT * FROM allUsers WHERE email = ?`;
    const [result] = await db.execute(query,[email]);
    return result.length>0?result:null
}

const getAllUserData = async ()=>{
    const query = `SELECT * FROM allUsers`;
    const [result] = await db.execute(query);
    return result.length>0?result:null
}

const updateUserData = async (Updating_data) => {
    const { avatar, first_name, last_name, bio, email, date_of_birth, phone_number } = Updating_data;

    const query = `
        UPDATE allUsers 
        SET avatar = ?, first_name = ?, last_name = ?, bio = ?, date_of_birth = ?, phone_number = ? 
        WHERE email = ? 
    `;

    const [result] = await db.execute(query, [avatar, first_name, last_name, bio, date_of_birth, phone_number, email]);
    console.log(result);
    return result.affectedRows > 0 ? result : null;
};

const updateUserPassword = async (userData)=>{
    const {email,password} = userData;
    const query =  `UPDATE allUsers SET password = ? WHERE email = ?`;
    const [result] = await db.execute(query,[password, email])
    console.log('xxxx ',result);
    return result.affectedRows>0?result:null;
}


module.exports = {createUser,authLogin, verifyEmailId, getAllUserData, updateUserData, updateUserPassword}