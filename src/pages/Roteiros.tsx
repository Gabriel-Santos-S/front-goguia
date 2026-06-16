import React, { useEffect, useState } from 'react';
import { Heart, MapPin, User, Clock, Map } from 'lucide-react';

// IMPORTAÇÃO DA LOGO CUSTOMIZADA
import Logo from '../components/Logo';

// 1. IMPORTAÇÃO DAS IMAGENS LOCAIS DA PASTA ASSETS
import imgBikeBrasilia from '../assets/bike_Eixo_Monumental.jpg';
import imgAngra from '../assets/Angra.jpg';
import imgPaulista from '../assets/Av_Paulista.jpg';
import imgFazendinhaDF from '../assets/fazendinha_df.jpg';
import imgHipismoBrasilia from '../assets/hipismo.jpg'; // Certifique-se de que o arquivo está aqui
import { Roteiro } from '@/types';
import { arquivoApi, roteiroApi } from '@/services/api';
import { useQuery } from '@tanstack/react-query';
import SidebarHeader from '@/components/layout/SidebarHeader';
import { useNavigate } from 'react-router-dom';

export default function Roteiros() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [imagens, setImagens] = useState<Record<number, string>>({});


  const { data: roteiros, isLoading } = useQuery({
    queryKey: ["all_roteiros"],
    queryFn: () => roteiroApi.get<Roteiro[]>("", { skipAuth: true })
  })

  useEffect(() => {
    const carregarImagens = async () => {
      if (!roteiros?.length) return;

      const resultado: Record<number, string> = {};

      await Promise.all(
        roteiros.map(async (roteiro) => {
          resultado[roteiro.id] = await buscarImagem(roteiro.id);
        })
      );

      setImagens(resultado);
    };

    carregarImagens();

    const intervalId = setInterval(() => {
      carregarImagens();
    }, 30000);

    return () => clearInterval(intervalId);
  }, [roteiros]);

  const buscarImagem = async (id: number) => {
    try {
      const response = await arquivoApi.get<{ url: string }>(`/buscar/${id}`);

      return response.url as string;
    } catch (error) {
      console.error("Erro ao buscar imagem");
      return "";
    }
  };

  // Filtros aplicados na listagem de forma reativa
  const filteredroteiros = roteiros?.filter(roteiro => {
    const matchesSearch = roteiro.titulo.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch;
  });

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#f4f4f6] font-sans antialiased text-gray-700">

      <SidebarHeader />

      {/* 2. CONTEÚDO DA TELA (GRID LATERAL + PRODUTOS) */}
      <div className="flex flex-1 max-w-[1300px] w-full mx-auto p-6 gap-8">

        {/* COLUNA DIREITA: BARRA DE PESQUISA + LISTA DE CARDS */}
        <main className="flex-1 flex flex-col gap-6">

          {/* Barra de Pesquisa */}
          <div className="w-full bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex items-center gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar pelo nome ou local . . ."
              className="flex-1 bg-[#eaeaea]/60 text-sm text-gray-700 placeholder-gray-500 rounded px-4 py-2 focus:outline-none"
            />
            <button className="bg-[#1F3A66] text-white font-bold text-xs px-6 py-2 rounded shadow hover:bg-[#152847] transition-colors">
              Buscar
            </button>
          </div>

          {/* Listagem de Roteiros Reativa */}
          <div className="flex flex-col gap-5">
            {filteredroteiros?.length > 0 ? (
              filteredroteiros?.map((roteiro) => (
                <div
                  key={roteiro.id}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex p-4 gap-5 relative group hover:shadow-md transition-shadow"
                >

                  {/* Container da Imagem com Badge de Favorito */}
                  <div className="w-[260px] h-[170px] rounded-lg overflow-hidden relative flex-shrink-0 bg-gray-100">
                    <img
                      src={imagens[roteiro.id] || ""}
                      alt={roteiro.titulo}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                    <button className="absolute top-2 left-2 bg-white/90 p-1.5 rounded-full shadow-md hover:bg-white transition-colors">
                      <Heart className="w-4 h-4 text-gray-600 hover:text-red-500 transition-colors" />
                    </button>
                  </div>

                  {/* Informações Completas do Roteiro */}
                  <div className="flex flex-col justify-between flex-1 min-w-0 pr-4">
                    <div>
                      {/* Título */}
                      <h2 className="text-xl font-bold text-gray-900 leading-tight truncate">
                        {roteiro.titulo}
                      </h2>

                      {/* Descrição Curta */}
                      <p className="text-xs text-gray-500 mt-2 line-clamp-3 leading-relaxed">
                        {roteiro.descricao}
                      </p>
                    </div>

                    {/* Metadados: Localização e Guia */}
                    <div className="flex flex-col gap-1.5 mt-3">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1F3A66]">
                        <MapPin className="w-3.5 h-3.5 text-[#1F3A66]" />
                        <span>{roteiro.local}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                        <User className="w-3.5 h-3.5 text-gray-500" />
                        <span>{roteiro.preco}</span>
                      </div>
                    </div>
                  </div>

                  {/* Detalhes de Duração, Distância, Valor e Botão (Canto Direito) */}
                  <div className="w-[140px] flex flex-col justify-between items-end flex-shrink-0 pl-2 border-l border-gray-100">
                    {/* Duração / Distância */}
                    <div className="flex items-center gap-2 text-[11px] text-gray-500 font-bold bg-gray-50 px-2 py-1 rounded">
                      <Clock className="w-3 h-3" />
                      <span>10H</span>
                      <span>/</span>
                      <Map className="w-3 h-3" />
                      <span>12km</span>
                    </div>

                    {/* Bloco de Preço e Ação */}
                    <div className="w-full text-right mt-auto">
                      <div className="text-xs text-[#1F3A66] font-bold">R$</div>
                      <div className="text-2xl font-black text-[#1F3A66] -mt-1">
                        {roteiro.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                      <button className="w-full mt-2 bg-[#1F3A66] text-white text-sm font-bold py-2 rounded-md shadow-sm hover:bg-[#152847] transition-colors" onClick={() => navigate(`/home/tela-avaliacao/${roteiro.id}/detalhes`)}>
                        Ver
                      </button>
                    </div>

                  </div>

                </div>
              ))
            ) : (
              <div className="bg-white p-8 rounded-lg border text-center text-gray-400 font-medium text-sm">
                Nenhum roteiro encontrado para os filtros selecionados.
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
}