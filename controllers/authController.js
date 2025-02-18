const jwt = require('jsonwebtoken');
const {verifyEmailId} = require('../models/userModel')

const verifyUserToken = async (req,res)=>{
    try {
        const authHeaderToken = req.headers.authorization;
        if (!authHeaderToken) {
            console.log('Auth token required');
            return res.status(401).json({ msg: 'Auth token required', status: 'access denied' });
        }

        const token = authHeaderToken.toString().split(' ')[1];
        if (!token) {
            console.log('Token missing in authorization header');
            return res.status(401).json({ msg: 'Token missing', status: 'access denied' });
        }
        
        // Decode the payload without verifying the signature
        const base64Url = token.split('.')[1];
        const decodedData = JSON.parse(Buffer.from(base64Url, 'base64').toString('utf-8'));
        const email = decodedData.email;
        const isValidUser = await verifyEmailId(email)
        if (!isValidUser) {
            return res.status(401).json({ msg: 'Token verification failed user not exist', status: 'access denied' });
        }        
        const Secret_Key = process.env.AUTH_SECRET_KEY;
        
        jwt.verify(token, Secret_Key, (error, decoded) => {
            if (error) {
                console.log('10')
                if (error.name === 'TokenExpiredError') {
                    console.log('Token expired');
                    return res.status(401).json({ msg: 'Token Expired', status: 'access denied' });
                } else {
                    console.log('Token verification failed');
                    return res.status(401).json({ msg: 'Token verification failed', status: 'access denied' });
                }
            }
            console.log('Token verified successfully');
            res.status(200).json({ msg: 'Token verified successfully', status: 'access granted', decoded });
        });

    } catch (error) {
        console.log('Internal server error: ',error);
        res.status(500).json({ msg: 'Internal server error', status: 'access denied' });
    }
}

module.exports = {verifyUserToken}