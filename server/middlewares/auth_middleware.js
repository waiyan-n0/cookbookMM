const jwt = require('jsonwebtoken');
const {getCacheUser} = require('./../utils/caches');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader) {
        next(new Error('Access Denied: No Token Provided'));
        return;
    }
    const token = authHeader.split(' ')[1];
    //console.log(token);
    jwt.verify(token, process.env.SECRET_KEY_HASH, async(err, decoded) => {
        if(err){
            console.log(err);
            if(err.message.includes('expired')){
                return next(new Error('Expired Token'));
            }else{
                return next(new Error('Tokenization Error'));
            }
        }
        try{
            req.userId = decoded.id;
            //console.log(decoded);
            req.user = await getCacheUser(decoded.id);
            next();
        }catch(err){
            console.log(err.message);
            next(new Error('Internal Server Error'));
        }
    });
}
module.exports = {
    verifyToken
};