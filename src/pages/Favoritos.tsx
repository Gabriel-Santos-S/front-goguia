import React, { useEffect, useState } from 'react';
import { User, Home as HomeIcon, Bookmark, List, MessageSquare, Star, X, Search, Plus, Sidebar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { useQuery } from '@tanstack/react-query';
import { arquivoApi, favoritoApi, roteiroApi } from '@/services/api';
import { Favorito, Roteiro } from '@/types';
import { useAuth } from '@/context/AuthContext';
import SidebarHeader from '@/components/layout/SidebarHeader';

// Interface para o modal
interface ModalBuscaProps {
  onClose: () => void;
  adicionarFavorito: (roteiroId: number) => Promise<void>;
}

function ModalBusca({ onClose, adicionarFavorito }: ModalBuscaProps) {
  const [busca, setBusca] = useState('');
  const [imagens, setImagens] = useState<Record<number, string>>({});

  const { data: roteiros, isLoading } = useQuery({
    queryKey: ["all_roteiros"],
    queryFn: () => roteiroApi.get<Roteiro[]>("", { skipAuth: true })
  });

  useEffect(() => {
    const carregarImagens = async () => {
      if (!roteiros?.length) return;

      const resultado: Record<number, string> = {};

      await Promise.all(
        roteiros.map(async (roteiro) => {
          const imagem = await buscarImagem(roteiro.id);
          if (imagem) {
            resultado[roteiro.id] = imagem;
          }
        })
      );

      setImagens(resultado);
    };

    carregarImagens();
  }, [roteiros]);

  const buscarImagem = async (id: number) => {
    try {
      const response = await arquivoApi.get<{ url: string }>(`/buscar/${id}`);
      return response.url;
    } catch (error) {
      console.error("Erro ao buscar imagem:", error);
      return "";
    }
  };

  const filteredRoteiros = roteiros?.filter(roteiro =>
    roteiro.titulo.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-[600px] shadow-2xl overflow-hidden">
        {/* BUSCA */}
        <div className="p-5 border-b border-gray-100 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center bg-[#1F3A66] rounded-lg overflow-hidden">
            <input
              type="text"
              value={busca}
              onChange={e => setBusca(e.target.value)}
              placeholder="Buscar pelo nome ou local..."
              className="flex-1 bg-transparent text-white placeholder-white/60 text-sm px-4 py-2.5 outline-none"
            />
            <button
              className="px-4 py-2.5 text-white/80 hover:text-white transition-colors"
              aria-label="Buscar"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* RESULTADOS */}
        <div className="flex flex-col gap-3 p-5 max-h-[400px] overflow-y-auto">
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Carregando roteiros...</div>
          ) : filteredRoteiros?.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Nenhum roteiro encontrado</div>
          ) : (
            filteredRoteiros?.map(roteiro => (
              <div key={roteiro.id} className="flex items-start gap-4 border-2 border-[#F27420] rounded-xl p-3">
                <img
                  src={imagens[roteiro.id] || ""}
                  alt={roteiro.titulo}
                  className="w-16 h-16 rounded-full object-cover flex-shrink-0 mt-1"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-gray-900 mb-1">{roteiro.titulo}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{roteiro.descricao}</p>
                </div>
                <button
                  onClick={() => {
                    adicionarFavorito(roteiro.id);
                    onClose();
                  }}
                  className="w-12 h-12 bg-[#F27420] rounded-xl flex items-center justify-center flex-shrink-0 hover:bg-[#d65f15] transition-colors mt-1"
                  aria-label={`Favoritar ${roteiro.titulo}`}
                >
                  <Star className="w-5 h-5 text-white fill-white" />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-5 pt-0">
          <button
            onClick={onClose}
            className="w-full bg-[#F27420] hover:bg-[#d65f15] text-white font-bold py-3 rounded-xl text-sm transition-colors"
          >
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Favoritos() {
  const navigate = useNavigate();
  const [modalAberto, setModalAberto] = useState(false);
  const [busca, setBusca] = useState('');
  const [imagens, setImagens] = useState<Record<number, string>>({});
  const { user } = useAuth();

  const { data: favoritos, isLoading, refetch } = useQuery({
    queryKey: ["all_favorito"],
    queryFn: () => favoritoApi.get<Favorito[]>("", { skipAuth: true })
  });

  useEffect(() => {
    const carregarImagens = async () => {
      if (!favoritos?.length) return;

      const resultado: Record<number, string> = {};

      await Promise.all(
        favoritos.map(async (favorito) => {
          const imagem = await buscarImagem(favorito.roteiro.id);
          if (imagem) {
            resultado[favorito.roteiro.id] = imagem;
          }
        })
      );

      setImagens(resultado);
    };

    carregarImagens();
  }, [favoritos]);

  const buscarImagem = async (id: number) => {
    try {
      const response = await arquivoApi.get<{ url: string }>(`/buscar/${id}`);
      return response.url;
    } catch (error) {
      console.error("Erro ao buscar imagem:", error);
      return "";
    }
  };

  const removerFavorito = async (codFavorito: number) => {
    try {
      await favoritoApi.delete(`/delete/${codFavorito}`);
      await refetch();
    } catch (error) {
      console.error("Erro ao desfavoritar:", error);
    }
  };

  const adicionarFavorito = async (codRoteiro: number) => {
    try {
      const data = { codRoteiro, codPessoa: user?.id };
      await favoritoApi.post("/criar", data);
      await refetch();
    } catch (error) {
      console.error("Erro ao favoritar:", error);
    }
  };

  const favoritosFiltrados = favoritos?.filter(f =>
    f.roteiro.titulo.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#f4f4f6] font-sans text-gray-700">
      {/* HEADER */}
      <SidebarHeader />

      <main className="max-w-[1100px] w-full mx-auto p-6 flex flex-col gap-5">
        {/* BUSCA */}
        <div className="flex items-center bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <input
            type="text"
            value={busca}
            onChange={e => setBusca(e.target.value)}
            placeholder="Buscar favoritos..."
            className="flex-1 px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none"
          />
          <button
            className="bg-[#1F3A66] text-white font-bold text-xs px-6 py-2.5 hover:bg-[#152847] transition-colors"
            aria-label="Buscar favoritos"
          >
            Buscar
          </button>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            <div className="col-span-full text-center py-8 text-gray-500">
              Carregando favoritos...
            </div>
          ) : favoritosFiltrados?.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-500">
              Nenhum favorito encontrado
            </div>
          ) : (
            favoritosFiltrados?.map(favorito => (
              <div key={favorito.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex gap-3 items-start">
                <img
                  src={imagens[favorito.roteiro.id] || ""}
                  alt={favorito.roteiro.titulo}
                  className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-gray-900 mb-1">{favorito.roteiro.titulo}</h3>
                  <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                    {favorito.roteiro.descricao}
                  </p>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => removerFavorito(favorito.id)}
                      className="text-xs font-semibold border border-gray-300 text-gray-600 px-3 py-1.5 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Desfavoritar
                    </button>
                    <button
                      onClick={() => navigate(`/roteiro/${favorito.roteiro.id}`)}
                      className="text-xs font-bold bg-[#F27420] text-white px-4 py-1.5 rounded-md hover:bg-[#d65f15] transition-colors flex-1"
                    >
                      Abrir
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* CARD ADICIONAR */}
          <button
            onClick={() => setModalAberto(true)}
            className="border-2 border-dashed border-[#F27420] rounded-xl p-6 flex flex-col items-center justify-center gap-2 text-[#F27420] hover:bg-orange-50 transition-colors min-h-[140px]"
            aria-label="Adicionar favorito"
          >
            <div className="w-10 h-10 rounded-full border-2 border-[#F27420] flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
            <span className="font-bold text-sm">Adicionar Favorito</span>
          </button>
        </div>
      </main>

      {modalAberto && (
        <ModalBusca
          onClose={() => setModalAberto(false)}
          adicionarFavorito={adicionarFavorito}
        />
      )}
    </div>
  );
}