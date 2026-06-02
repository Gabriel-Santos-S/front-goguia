import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import EsqueciSenha from './pages/EsqueciSenha';
import ConfirmacaoEmail from './pages/Confirmacaoemail'; // Ajustado para o nome que você salvou
import Home from './pages/home'; // Ajustado para o nome que você salvou
import TelaHistorico from './pages/TelaHistorico';
import GestaoAgendamentos from './pages/GestaoAgendamentos';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/gestor/historico" element={<TelaHistorico />} />
        <Route path="/gestor/agendamento" element={<GestaoAgendamentos />} />
        <Route path="/confirmacao-email" element={<ConfirmacaoEmail />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;