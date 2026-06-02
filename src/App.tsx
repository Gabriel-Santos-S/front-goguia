import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import EsqueciSenha from './pages/EsqueciSenha';
import ConfirmacaoEmail from './pages/Confirmacaoemail'; // Ajustado para o nome que você salvou
import Home from './pages/home'; // Ajustado para o nome que você salvou
import TelaAvaliacao from './pages/TelaAvaliacao';
import Agendamentos from './pages/Agendamentos';
import Pagamento from './pages/Pagamento';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/esqueci-senha" element={<EsqueciSenha />} />
        <Route path="/confirmacao-email" element={<ConfirmacaoEmail />} />

        <Route path="/home" element={<Home />} />
        <Route path="/home/tela-avaliacao" element={<TelaAvaliacao />} />
        <Route path="/home/tela-avaliacao/detalhes" element={<Agendamentos />} />

        <Route path="/home/pagamento" element={<Pagamento />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;