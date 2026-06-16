import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, MapPin, Phone } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Typography } from '@mui/material';
import { pessoaAPI } from '@/services/api';

export default function Login() {
  const navigate = useNavigate();
  const [errorSubmit, setErrorSubmit] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { login, isLoading } = useAuth();
  const [textoErro, setTextoErro] = useState(() => {
    const texto = localStorage.getItem("expiredSessionMessage")
    if (texto) setErrorSubmit(true)
    return texto
  });

  const [nameCadastr, setNameCadastr] = useState<string>("");
  const [telefone, setTelefone] = useState<string>("");
  const [senhaCadastr, setSenhaCadastr] = useState<string>("");
  const [emailCadastr, setEmailCadastr] = useState<string>("");


  const onVerifcPassword = async () => {
    const emailLimpo = email.replace(" ", "");

    try {
      const isLogin = await login(emailLimpo, password)
      if (isLogin) { navigate('/home') }

    } catch (error) {
      setErrorSubmit(true);
      setPassword("");
    }
  }

  const cadastra = async (e: React.FormEvent) => {
    e.preventDefault();

    
    try {
      const data = {
        nome: nameCadastr,
        email: emailCadastr,
        senha: senhaCadastr,
        numTelefone: telefone,
        codPerfil: 1
      }
      const pessoa = pessoaAPI.post("/criar", data)
      console.log(pessoa);
      


    } catch (error) {
      console.error('Erro ao cadastrar pessoa');

    } finally {
      setNameCadastr("")
      setEmailCadastr("")
      setTelefone("")
      setSenhaCadastr("")
      console.log("Limpo");
      
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorSubmit(false);
    setTextoErro("");
    onVerifcPassword();
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      {/* Barra Superior (Header) com a Logo */}
      <header className="w-full p-6 border-b flex items-center gap-2">
        <div className="relative text-orange-500">
          <MapPin size={36} className="fill-current" />
          <User size={18} className="absolute top-1.5 left-2 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-orange-500 tracking-tight">GoGuia</h1>
      </header>

      {/* Área Central da Tela */}
      <main className="flex-1 flex flex-col md:flex-row max-w-6xl w-full mx-auto p-4 gap-8 md:gap-16 items-center justify-center">

        {/* LADO ESQUERDO: Formulário de Login */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-10">Bem Vindo(a) de Volta !</h2>

          {errorSubmit && (
            <Typography color='error' sx={{ pb: 2 }}>
              {textoErro ? textoErro : "Usuário e/ou senha incorreto"}
            </Typography>
          )}

          <form autoComplete="on" method="post" onSubmit={handleLogin} className="w-full max-w-sm space-y-5">
            <input
              type="email"
              placeholder="E-mail"
              className="w-full p-3 bg-gray-200 text-gray-700 rounded-sm outline-none focus:ring-2 focus:ring-orange-500"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Senha"
              className="w-full p-3 bg-gray-200 text-gray-700 rounded-sm outline-none focus:ring-2 focus:ring-orange-500"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="pt-2">
              <button

                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-full transition-colors"
              >
                {isLoading ? "verificando..." : "Entrar"}
              </button>
            </div>
          </form>

          {/* Link para Esqueci a Senha */}
          <div className="mt-8 text-center text-sm font-bold text-gray-800">
            <p>Esqueceu sua senha?</p>
            <button
              onClick={() => navigate('/esqueci-senha')}
              className="hover:underline cursor-pointer text-orange-500"
            >
              Clique aqui
            </button>
          </div>
        </div>

        {/* LADO DIREITO: Bloco de Cadastro (Laranja) */}
        <div className="w-full md:w-1/2 bg-orange-500 text-white p-10 rounded-xl flex flex-col items-center justify-center shadow-lg">
          <h2 className="text-3xl font-bold mb-8">Cadastre-se</h2>

          {/* Upload de Foto */}
          <div className="flex items-center gap-4 mb-8 w-full max-w-sm">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center shrink-0">
              <User size={32} className="text-gray-300" />
            </div>
            <span className="text-sm font-bold">Faça o upload da sua foto</span>
          </div>

          {/* Campos do Cadastro */}
          <form className="w-full max-w-sm space-y-4" method="post" onSubmit={cadastra}>
            <div className="relative text-orange-500">
              <User className="absolute left-3 top-3.5" size={20} />
              <input
                required
                type="text"
                value={nameCadastr}
                placeholder="Nome Completo"
                className="w-full p-3 pl-10 bg-white text-gray-800 rounded-sm outline-none focus:ring-2 focus:ring-gray-300"
                onChange={(e) => setNameCadastr(e.target.value)}
              />
            </div>
            <div className="relative text-orange-500">
              <Phone className="absolute left-3 top-3.5" size={20} />
              <input
                required
                type="text"
                value={telefone}
                placeholder="Telefone"
                className="w-full p-3 pl-10 bg-white text-gray-800 rounded-sm outline-none focus:ring-2 focus:ring-gray-300"
                onChange={(e) => setTelefone(e.target.value)}
              />
            </div>
            <div className="relative text-orange-500">
              <Mail className="absolute left-3 top-3.5" size={20} />
              <input
                required
                type="email"
                value={emailCadastr}
                placeholder="e-mail"
                className="w-full p-3 pl-10 bg-white text-gray-800 rounded-sm outline-none focus:ring-2 focus:ring-gray-300"
                onChange={(e) => setEmailCadastr(e.target.value)}
              />
            </div>
            <div className="relative text-orange-500">
              <Lock className="absolute left-3 top-3.5" size={20} />
              <input
                required
                value={senhaCadastr}
                type="password"
                placeholder="Senha"
                className="w-full p-3 pl-10 bg-white text-gray-800 rounded-sm outline-none focus:ring-2 focus:ring-gray-300"
                onChange={(e) => setSenhaCadastr(e.target.value)}
              />
            </div>
            <div className="pt-6 flex justify-center">
              <button
                type="submit"
                className="border-2 border-white text-white font-bold py-2 px-12 rounded-full hover:bg-white hover:text-orange-500 transition-colors"
              >
                Cadastrar
              </button>
            </div>
          </form>
        </div>

      </main>
    </div>
  );
}