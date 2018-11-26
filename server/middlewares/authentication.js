const jwt = require('jsonwebtoken')
const ADMIN_ROLE = 'ADMIN_ROLE';

let verifyToken = (req,res,next) => {

    let token = req.get('Authorization');
   
    jwt.verify(token, process.env.TOKEN_SEED, (err, decoded) => {

        if(err){
            return res.status(401).json({
                ok: false,
                err
            });
        }

        req.user = decoded.user;
        next();

    });

};

let verifyAdminRole = (req, res, next) => {

        if(req.user.role != ADMIN_ROLE){
            return res.status(401).json({
                ok: false,
                message: "You are not able to perform this action"
            });
        }

        next();

}


module.exports = {
    verifyToken,
    verifyAdminRole
}