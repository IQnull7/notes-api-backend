const jwt = require('jsonwebtoken')

function authenticate(req, res, next){
    const header = req.headers.authorization
    if(header === undefined){
        return res.status(401).json({
            message: "Unauthorized"
        })
    }
    const starts = header.startsWith("Bearer ")
    const authString = header.split(" ")
    const token = authString[1]

    if(!starts || !token){
        return res.status(401).json({
            message: "Unauthorized"
        })
    }
    try{
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        req.user = payload
        
    }catch(error){
        return res.status(401).json({
            message: "Unauthorized"
        })
    }
    next()
}

module.exports = {authenticate}