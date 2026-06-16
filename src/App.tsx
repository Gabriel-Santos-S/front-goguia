import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import EsqueciSenha from './pages/EsqueciSenha';
import Login from './pages/Login';

import Configuracoes from './pages/Configuracoes';
import ConfirmacaoEmail from './pages/Confirmacaoemail';
import Favoritos from './pages/Favoritos';
import Home from './pages/home';
import MeusRoteiros from './pages/MeusRoteiros';
import Agendamentos from './pages/Agendamentos';
import { AuthProvider } from './context/AuthContext';
import { ProtectdRouts } from './context/ProtectdRouts';
import TelaAvaliacao from './pages/TelaAvaliacao';
import Pagamento from './pages/Pagamento';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* <Route path="/" element={<Navigate to="/login" replace />} /> */}
            <Route path="/" element={<Login />} />
            <Route path="/esqueci-senha" element={<EsqueciSenha />} />

            <Route element={<ProtectdRouts />} >
              <Route path="/confirmacao-email" element={<ConfirmacaoEmail />} />
              <Route path="/home" element={<Home />} />


              <Route path="/home/tela-avaliacao/detalhes" element={<Agendamentos />} />
              <Route path="/home/tela-avaliacao" element={<TelaAvaliacao />} />
              <Route path="/home/pagamento" element={<Pagamento />} />
              <Route path="/meus-roteiros" element={<MeusRoteiros />} />

              <Route path="/favoritos" element={<Favoritos />} />
              <Route path="/configuracoes" element={<Configuracoes />} />
            </Route>

            {/* <Route path="*" element={<NotFound />} /> */}
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
