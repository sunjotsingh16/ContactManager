const jwt = require("jsonwebtoken");
const config = require("config");


module.exports = function(req, res, next) {
    
    const token = req.header("x-auth-token");

    if (!token) {
        return res.status(401).json({ msg: "No Token Found.. Authorization Denied.."});
    }

    try {
        const decoded = jwt.verify(token, config.get("jwtSecretKey"));
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: "Invalid Token"});
    }
    
}