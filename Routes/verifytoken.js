const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    let token = req.header('Authorization');
    if (!token) res.status(401).send('Access denied');
    try {
        token = token.split("Bearer ");
        token = token[1];
        const verified = jwt.verify(token,process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send('Invalid token');
    }
}
