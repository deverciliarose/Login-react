const jwt = require("jsonwebtoken");

function autenticarToken(req, res, next) {
    const cabecalho = req.headers.authorization;

    const token = cabecalho && cabecalho.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            mensagem: "Faça login para continuar."
        });
    }

    try {
        const usuario = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.usuario = usuario;

        next();

    } catch (error) {
        return res.status(403).json({
            mensagem: "Token inválido ou expirado."
        });
    }
}

module.exports = autenticarToken;