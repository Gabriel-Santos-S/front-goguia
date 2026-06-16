
import TabsElementos from "@/components/Agendamentos/TabsElementos";
import SidebarHeader from "@/components/layout/SidebarHeader";
import { arquivoApi, roteiroApi } from "@/services/api";
import { Roteiro } from "@/types";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useQuery } from "@tanstack/react-query";
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { ArrowLeft, Bookmark, HomeIcon, List, MapPin, MessageSquare, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";


const ORANGE = "#F47B2A";
const NAVY = "#1F3A66";
const BG = "#eef0f2";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('pt-br');
dayjs.tz.setDefault('America/Sao_Paulo');


export default function Agendamentos() {
  const [imagen, setImagen] = useState<string | null>("");
  const [formData, setFormData] = useState(dayjs.tz(new Date(), 'America/Sao_Paulo'));
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate()

  const { data: roteiro, isLoading: isLoadingRoteiro } = useQuery({
    queryKey: ["id_roteiro", id],
    queryFn: () => roteiroApi.get<Roteiro>(`/${id}`),
    enabled: !!id
  })

  useEffect(() => {
    const carregarImagens = async () => {
      if (!roteiro) return;

      const buscarImagem = async (id: number) => {
        try {
          const response = await arquivoApi.get<{ url: string }>(`/buscar/${id}`);

          return response.url as string;
        } catch (error) {
          console.error("Erro ao buscar imagem");
          return "";
        }
      };

      const url = await buscarImagem(roteiro.id)
      setImagen(url)

    };

    carregarImagens();
  }, [roteiro]);


  return (
    <Box sx={{ minHeight: "100vh", bgcolor: BG }}>
      <SidebarHeader />
      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* breadcrumb + voltar */}
        <Stack
          direction="row"
          sx={{ alignItems: "center", justifyContent: "space-between", mb: 2 }}
        >
          <Typography sx={{ color: "#8a93a0", fontSize: 14 }}>
            <Link to={`/home/tela-avaliacao/${id}`} style={{ color: "inherit", textDecoration: "none" }}>
              catalogo
            </Link>{" "}
            / <span style={{ color: ORANGE }}>{roteiro?.titulo}</span>
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowLeft />}
            sx={{
              bgcolor: NAVY,
              borderRadius: 2,
              px: 3,
              textTransform: "none",
              fontWeight: 700,
              "&:hover": { bgcolor: "#162a4a" },
            }}
            onClick={() => navigate(-1)}
          >
            Voltar
          </Button>
        </Stack>

        {/* hero card */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "minmax(0, 420px) 1fr" },
            gap: 4,
            alignItems: "start",
          }}
        >
          <Box
            component="img"
            src={imagen || ""}
            alt="Panteão Pátria Liberdade"
            sx={{
              width: "100%",
              height: 260,
              objectFit: "cover",
              borderRadius: 2,
              display: "block",
            }}
          />
          <Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: 800, color: NAVY, mb: 1.5 }}
            >
              {roteiro?.titulo}
            </Typography>
            <Typography sx={{ color: "#3a4554", lineHeight: 1.55, mb: 2 }}>
              {roteiro?.descricao}
            </Typography>
            <Typography
              sx={{ color: ORANGE, fontWeight: 800, fontSize: 22, mb: 2 }}
            >
              R$ {roteiro?.preco.toFixed(2)}
            </Typography>
            <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
              <Stack direction="row" spacing={1}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                  <DatePicker
                    label="Data"
                    value={formData}
                    onChange={(value) => setFormData(value)}
                    disablePast

                    sx={{ mb: 2, width: '70%' }}
                  />
                </LocalizationProvider>
              </Stack>
              <Box sx={{ flex: 1 }} />
              <Button
                variant="contained"
                sx={{
                  bgcolor: NAVY,
                  px: 5,
                  py: 1.5,
                  fontWeight: 800,
                  letterSpacing: 1,
                  borderRadius: 1.5,
                  "&:hover": { bgcolor: "#162a4a" },
                }}
                onClick={() => navigate("/home/pagamento")}
              >
                RESERVAR
              </Button>
            </Stack>
          </Box>
        </Box>

        <Box sx={{ mt: 4, borderBottom: "1px solid #d6dae0" }}>
          <TabsElementos roteiro={roteiro} />
        </Box>

      </Container>
    </Box>
  );
}