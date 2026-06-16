import SidebarHeader from '@/components/layout/SidebarHeader';
import { arquivoApi, roteiroApi } from '@/services/api';
import { Roteiro } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { Heart, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
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

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header */}
      <SidebarHeader />

      {/* Conteúdo Principal */}
      <main className="max-w-6xl mx-auto p-8 mt-4">
        <h2 className="text-4xl font-extrabold text-black mb-8">Aonde voce quer ir ?</h2>

        <div className="mb-12">
          <h3 className="text-2xl font-extrabold text-black leading-snug">
            Bem vindos ao GoGuia !<br />
            Aqui você encontra os melhores guias da Região para roteiros<br />
            turísticos e afins etc e tals
          </h3>
        </div>

        <div>
          <h4 className="text-xl font-bold text-black">Você pode gostar</h4>
          <p className="text-sm text-gray-600 mb-6">Bem avaliados</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roteiros?.map((roteiro) => (
              <div key={roteiro.id} onClick={() => navigate(`/home/tela-avaliacao/${roteiro.id}`)} className="flex flex-col group cursor-pointer">
                <div className="w-full h-48 bg-gray-300 rounded-2xl relative mb-3 overflow-hidden">
                  <img src={imagens[roteiro.id] || ""}
                    alt={roteiro.titulo}
                    className="w-full h-full object-cover"
                  />

                  <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-sm hover:scale-110 transition-transform">
                    <Heart size={20} className="text-gray-500" />
                  </button>
                </div>
                <h5 className="font-bold text-sm text-center mb-1">{roteiro.titulo}</h5>
                <div className="flex items-center justify-between px-2">
                  <span className="text-[10px] text-gray-600 font-medium">{roteiro.descricao}</span>
                  <div className="flex items-center gap-1 text-[10px] font-bold">
                    {roteiro.preco ?? "0"}
                    <Star size={10} className="text-orange-400 fill-current" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}