import Logo from '@/components/Logo';
import { Bookmark, Home as HomeIcon, List, MessageSquare, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


export const SidebarHeader = () => {
  const navigate = useNavigate();
  
  return (
    <header className="w-full p-4 border-b flex flex-wrap items-center justify-between gap-4">
      {/* Logo */}
      <button onClick={() => navigate("/home")}>
        <Logo />
      </button>

      {/* Ícones de Navegação Central */}
      <nav className="flex items-center gap-6 text-indigo-900">
        <button onClick={() => navigate('/home')} className="hover:text-orange-500 transition-colors">
          <HomeIcon size={28} />
        </button>
        <button onClick={() => navigate('/favoritos')} className="hover:text-orange-500 transition-colors">
          <Bookmark size={28} />
        </button>
        <button onClick={() => navigate('/roteiros')} className="hover:text-orange-500 transition-colors">
          <List size={28} />
        </button>
      </nav>

      {/* Ações da Direita */}
      <div className="flex items-center gap-6">
        <button className="text-gray-600 hover:text-orange-500 transition-colors">
          <MessageSquare size={28} />
        </button>
        <button
          onClick={() => navigate('/configuracoes')}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-full flex items-center gap-2 transition-colors"
        >
          <User size={20} />
          Minha Conta
        </button>
      </div>
    </header>
  )

}

export default SidebarHeader