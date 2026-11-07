const express = require ("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const db = require("./database/Connection");
const app = express();


app.use(cors({
    origin: "http://localhost:5173"
}));

app.use(express.json())

//Teste de servidor
app.get("/", (req, res) =>{
    res.json({
        mensagem: "API funcionando!"
    });
});

//Teste do banco de dados
app.get("/teste-banco", async(req, res) => {
    try {
        const resultado = await db.query(
            "SELECT NOW() AS horario"
        );

        res.json({
            mensagem: "PostgreSQL conectado!",
            horario: resultado.rows[0].horario
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensagem: "Erro ao conectar com PostgreSQL."
        });
    }
});

app.post("/cadastro", async(req, res) => {
    try{
        const{nome, email, senha} = req.body;

        if(!nome || !email || !senha){
            return res.status(400).json({
                mensagem: "Preencha todos os campos."
            })
        }

        const usuarioExistente = await db.query(
            "SELECT id FROM usuarios WHERE email = $1",
            [email]
        );
        if(usuarioExistente.rows.length > 0){
            return res.status(409).json({
                mensagem: "Este e-mail já está cadastrado."
            })
        }

        const senhaCriptografia = await bcrypt.hash(senha, 10);

        const resultado = await db.query(
            `INSERT INTO usuarios (nome, email, senha)
             VALUES ($1, $2, $3)
             RETURNING id, nome, email`,
             [nome, email, senhaCriptografia]
        )

        return res.status(201).json({
            mensagem: "Cadastro realizado com sucesso.",
            usuario: resultado.rows[0]
        })
    }catch (error){
        console.error("Erro no cadastro:", error);

        return res.status(500).json({
            mensagem: "Erro interno ao realizar cadastro."
        })
    }
})

app.post("/login", async(req, res) => {
    try{
        const {email, senha} = req.body;

        if(!email || !senha){
            return res.status(400).json({
                mensagem: "Informe seu  e-mail e sua senha"
            });
        }

        const resultado = await db.query(
            "SELECT id, nome, email, senha FROM usuarios WHERE email = $1",
            [email]
        );

        if(resultado.rows.length === 0){
            return res.status(401).json({
                mensagem: "E-mail ou senha incorretos."
            })
        }

        const usuario = resultado.rows[0];

        const senhaValida = await bcrypt.compare(
            senha,
            usuario.senha
        );

        if(!senhaValida){
            return res.status(401).json({
                mensagem: "E-mail ou senha incorretos."
            })
        }

        const token = jwt.sign(
            {
                id: usuario.id,
                email: usuario.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || "1h"
            }
        );

        return res.status(200).json({
            mensagem: "Login realizado com sucesso!",
            token,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email
            }
        });
    }catch(error){
        console.error("Erro no login:", error);

        return res.status(500).json({
            mensagem: "Erro ao realizar login."
        })
    }
})
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});