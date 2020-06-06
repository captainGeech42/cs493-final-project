const jwt = require("jsonwebtoken");

const secretKey = "THIS IS A GREAT SECRET 42 EnTr0pYyYyY"; // pls don't in prod thx

exports.generateAuthToken = function (id, admin) {
    const payload = {
        sub: id
    }
    if (admin) {
        payload.admin = admin;
    }

    return jwt.sign(payload, secretKey, { expiresIn: "24h" });
}

exports.requireAuthentication = function (req, res, next) {
    // pretty much just https://github.com/osu-cs493-sp20/auth/blob/master/lib/auth.js#L10
    const payload = exports.parseAuthToken(req.get("Authorization"));

    if (payload) {
        req.user = payload.sub;
        req.admin = payload.admin === 1;
        next();
    } else {
        res.status(401).send({
            error: "Invalid authentication token"
        });
    }
}

// return JWT payload if valid, else null
exports.parseAuthToken = function (header) {
    if (!header || header === "") return null;
    const parts = header.split(" ");
    const token = parts[0] === "Bearer" ? parts[1] : null;

    try {
        const payload = jwt.verify(token, secretKey);
        return payload;
    } catch (err) {
        console.error(err);
        return null;
    }
}