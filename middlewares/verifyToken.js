const jwt = require('jsonwebtoken');

const authorizedApiRequest = (req,res,next)=>{
    const AuthToken = req.headers.authorization;
    if(!AuthToken){
        return res.status(401).json({msg:'you are not authorized to call this api' , success:'access denied'});
    }
    const token = AuthToken.split(' ')[1];
    if(!token){
        return res.status(401).json({msg:'token missing', status:'access denied'});
    }
    const Secret_Key = process.env.AUTH_SECRET_KEY;
    jwt.verify(token,Secret_Key,(error,decoded)=>{
        if(error){
            if(error.name === 'tokenExpiredError'){
                return res.status(401).json({msg:'token expired ', status:'access denied'});
            }else{
                return res.status(401).json({msg:'token verification failed', status:'access denied'});
            }
        }
        next();
    })
}

module.exports={authorizedApiRequest}