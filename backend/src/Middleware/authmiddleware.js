const jwt = require("jsonwebtoken")

async function authmiddle(req,res,next){
    try{
        const token = req.cookies.token
        if(!token){
            return res.status(401).json({message:"Token not found"
            })
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        req.user = decoded
        next()
    }
    catch(err){
        console.log(err)
    }
}

module.exports = {authmiddle}