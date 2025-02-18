const db =  require('../db/db');

const createUser = async (userData)=>{
    const {avatar, first_name , last_name , bio , email , date_of_birth , password , phone_number} = userData;
    const query = `INSERT INTO allUsers (avatar,first_name,last_name,bio,email,date_of_birth,password,phone_number) VALUE (?, ?, ?, ?, ?, ?, ?,?)`;
    const [result]  = await db.execute(query,[avatar||null,first_name||null,last_name||null,bio||null,email||null,date_of_birth||null,password||null,phone_number||null]);
    return result;
}

const authLogin = async (userData)=>{
    const {email,password} = userData;
    const query = `SELECT * FROM allUsers WHERE email = ? AND password = ?`;
    
    const [result] = await db.execute(query,[email||null,password||null]);
    return result.length>0?result:null;
}

const verifyEmailId = async (email)=>{
    const query = `SELECT * FROM allUsers WHERE email = ?`;
    const [result] = await db.execute(query,[email||null]);
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

    const [result] = await db.execute(query, [avatar||null, first_name||null, last_name||null, bio||null, date_of_birth||null, phone_number||null, email||null]);
    console.log(result);
    return result.affectedRows > 0 ? result : null;
};

const updateUserPassword = async (userData)=>{
    const {email,password} = userData;
    const query =  `UPDATE allUsers SET password = ? WHERE email = ?`;
    const [result] = await db.execute(query,[password||null, email||null])
    return result.affectedRows>0?result:null;
}


module.exports = {createUser,authLogin, verifyEmailId, getAllUserData, updateUserData, updateUserPassword}