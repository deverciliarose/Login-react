import { useState } from "react";
import "./Cadastro.css";


function Cadastro(){

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSEnha, setConfirmarSenha] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [carregando, setCarregando] = useState(false);

    async function handleCadastro(e){
        e.preventDefault()
        setMensagem("");

        if(senha !== confirmarSEnha){
            setMensagem("As senhas não coincidem");
            return
        }

        try{
            setCarregando(true);

            const resposta = await fetch("http://localhost:3000/cadastro", {
                method: "POST",
                headers: {
                    "Content-Type": "Application/json"
                },
                body: JSON.stringify({
                    nome,
                    email,
                    senha
                })
            });
            const dados = await resposta.json();

            if(!resposta.ok){
                setMensagem(dados.mensagem || "Erro ao realizar cadastro.")
                return
            }

            setMensagem(dados.mensagem);

            setNome("");
            setEmail("");
            setSenha("");
            setConfirmarSenha("");
            
        }catch(error){
            console.error("Erro:", error)
            setMensagem("Não foi possível conectar ao servidor.")
        }finally{
            setCarregando(false)
        }
    }

    return(
        <>
         <div className="cadastro-container">

            <div className="formulario-cadastro">
               
               <h2>Criar conta</h2>
               <p>Cadastre-se para acessar a Zoom Tecnology</p>

            <form onSubmit={handleCadastro}>
               <input 
               type="text"
               placeholder="Digite seu nome completo"
               value={nome}
               onChange={(e) => setNome(e.target.value)}
               required/>

               <input 
               type="email"
               placeholder="Digite seu e-mail"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               required/>

               <input 
               type="password"
               placeholder="Digite sua senha"
               value={senha}
               onChange={(e) => setSenha(e.target.value)} 
               required />

               <input 
               type="password" 
               placeholder="Confirmar senha"
               value={confirmarSEnha}
               onChange={(e) => setConfirmarSenha(e.target.value)}/>

               {mensagem && (
                <p role="status">{mensagem}</p>
               )}

               <button type="submit" disabled={carregando}>
                 {carregando ? "Cadastrando..." : "Cadastrar"}
               </button>
            </form>
            
              <p>
                Já possui um conta?
                <a href="/login">Entrar</a>
              </p>
            </div>
         </div>
        </>
    )
}
export default Cadastro;