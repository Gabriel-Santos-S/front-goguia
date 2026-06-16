import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import EsqueciSenha from './pages/EsqueciSenha';
import Login from './pages/Login';

import Configuracoes from './pages/Configuracoes';
import ConfirmacaoEmail from './pages/Confirmacaoemail';
import Favoritos from './pages/Favoritos';
import Home from './pages/home';
import MeusRoteiros from './pages/MeusRoteiros';
import Agendamentos from './pages/Agendamentos';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/esqueci-senha" element={<EsqueciSenha />} />
        <Route path="/confirmacao-email" element={<ConfirmacaoEmail />} />

        <Route path="/home" element={<Home />} />


        <Route path="/home/tela-avaliacao/detalhes" element={<Agendamentos />} />
        {/* <Route path="/home/tela-avaliacao" element={<TelaAvaliacao />} />
        <Route path="/home/pagamento" element={<Pagamento />} /> */}
        <Route path="/meus-roteiros" element={<MeusRoteiros />} />
        <Route path="/favoritos" element={<Favoritos />} />
        <Route path="/configuracoes" element={<Configuracoes />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
