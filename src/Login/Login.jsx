import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login(){

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);

  const navegar = useNavigate();

 async function handleLogin(e){
    e.preventDefault();
    setMensagem("");

    try{
      setCarregando(true);

      const resposta = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          senha
        })
      });

      const dados = await resposta.json();

      if(!resposta.ok){
          setMensagem(dados.mensagem || "Erro ao realizar login.")
          return;
      }

     
      sessionStorage.setItem("token", dados.token);
      sessionStorage.setItem("usuario", JSON.stringify(dados.usuario));

      setMensagem(dados.mensagem);
      navegar("/inicio");


    }catch(error){
      console.error("Erro:", error);
      setMensagem("Não foi possível conectar o servidor.")
    }finally{
      setCarregando(false)
    }
  }

    return(
        <> 
          <div className="login-container">

            <div className="formulario-login">
              <h2>Bem-vindo!</h2>

              <p>Entre na sua conta Zoom Technology</p>

              <form onSubmit={handleLogin}>

                <input 
                type="email" 
                placeholder="Seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required />

                <input 
                type="password" 
                placeholder="Sua senha" 
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required/>
                
                {mensagem && (
                  <p role="status">{mensagem}</p>
                )}
                <button type="submit" disabled={carregando}>
                  {carregando ? "Entrando..." : "Entrar"}
                </button>

              </form>

              <p>
                Ainda não tem conta?
                <a href="/cadastro">Cadastre-se</a>
              </p>
            </div>
          </div>
        </>
    )
}
export default Login