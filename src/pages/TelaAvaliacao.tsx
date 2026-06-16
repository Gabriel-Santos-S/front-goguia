
import SidebarHeader from "@/components/layout/SidebarHeader";
import { arquivoApi, roteiroApi } from "@/services/api";
import { Roteiro } from "@/types";
import { AppBar, Avatar, Box, Button, Container, CssBaseline, Divider, IconButton, LinearProgress, Rating, Stack, ThemeProvider, Toolbar, Typography, createTheme } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { User, MapPin, Home as HomeIcon, Bookmark, List, MessageSquare, Heart, Star } from 'lucide-react';
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";


const ORANGE = "#F47B2A";


const ratings = [
  { label: "Excelente", value: 92 },
  { label: "Muito bom", value: 18 },
  { label: "Razoável", value: 4 },
  { label: "Ruim", value: 10 },
  { label: "Horrível", value: 2 },
];

const reviews = [
  {
    name: "Anthony C",
    text: "Excursão de um dia fantástico com o nosso guia Samuel! Aprendemos muito e nos divertimos muito! Recomendamos vivamente este tour.",
    date: "mar. de 2026",
  },
  {
    name: "Aris",
    text: "Samuel foi incrível, ele é muito informado e tem uma paixão pelo que faz. Ele é muito útil e assegurou que todos nos sentimos seguros e confortáveis durante todo o passeio. Eu definitivamente vou indicar para familiares.",
    date: "nov. de 2025",
  },
];

export default function TelaAvaliacao() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>();
  const [imagen, setImagen] = useState<string | null>("");


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

  if (isLoadingRoteiro) {
    return (
      <h1>Carregando</h1>
    )
  }

  return (
    <Box sx={{ bgcolor: "#fff", minHeight: "100vh" }}>
      <SidebarHeader />
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.2fr 1fr" },
            gap: 6,
            alignItems: "start",
          }}
        >
          <Box sx={{ position: "relative" }}>
            <Box
              component="img"
              src={imagen || ""}
              alt="Catedral da fé"
              sx={{
                width: "100%",
                height: { xs: 280, md: 360 },
                objectFit: "cover",
                borderRadius: 2,
                display: "block",
              }}
            />
            <IconButton
              sx={{
                position: "absolute",
                top: 16,
                right: 16,
                bgcolor: "#fff",
                width: 48,
                height: 48,
                boxShadow: 2,
                "&:hover": { bgcolor: "#f5f5f5" },
              }}
            >
              <Heart />
            </IconButton>
          </Box>

          <Stack spacing={3} sx={{ pt: { md: 4 } }}>
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 800, color: "#111", fontSize: 36 }}>
                {roteiro?.titulo}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center", mt: 1 }}>
                <Typography sx={{ color: "#555" }}>Samuel Dantas · 5.0</Typography>
                <Star />
              </Stack>
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: "flex", justifyContent: { xs: "flex-start", md: "flex-start" } }}>
              <Button
                variant="contained"
                sx={{
                  bgcolor: ORANGE,
                  color: "#fff",
                  borderRadius: 999,
                  px: 5,
                  py: 1.6,
                  fontSize: 16,
                  fontWeight: 700,
                  textTransform: "none",
                  "&:hover": { bgcolor: "#e06d20" },
                }}
                onClick={() => navigate(`/home/tela-avaliacao/${id}/detalhes`)}
              >
                Reserve Agora!
              </Button>
            </Box>
          </Stack>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1.4fr" },
            gap: 6,
            mt: 8,
          }}
        >
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                color: "#111",
                textDecoration: "underline",
                textUnderlineOffset: 4,
                mb: 3,
              }}
            >
              Avaliações
            </Typography>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 2 }}>
              <Typography sx={{ fontWeight: 700 }}>5.0</Typography>
              <Rating value={5} readOnly size="small" sx={{ color: ORANGE }} />
              <Typography sx={{ color: "#555" }}>(427)</Typography>
            </Stack>
            <Stack spacing={1.2}>
              {ratings.map((r) => (
                <Stack key={r.label} direction="row" spacing={2} sx={{ alignItems: "center" }}>
                  <Typography sx={{ width: 90, fontSize: 14, color: "#222" }}>
                    {r.label}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={r.value}
                    sx={{
                      flexGrow: 1,
                      height: 8,
                      borderRadius: 4,
                      bgcolor: "#eee",
                      "& .MuiLinearProgress-bar": { bgcolor: ORANGE },
                    }}
                  />
                </Stack>
              ))}
            </Stack>
          </Box>

          <Stack spacing={2} divider={<Divider />}>
            {reviews.map((rev) => (
              <Stack key={rev.name} spacing={1} sx={{ pt: 2 }}>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                  <Avatar sx={{ width: 32, height: 32 }}>{rev.name[0]}</Avatar>
                  <Typography sx={{ fontWeight: 700 }}>{rev.name}</Typography>
                </Stack>
                <Typography sx={{ color: "#222", lineHeight: 1.5 }}>{rev.text}</Typography>
                <Typography sx={{ color: "#666", fontSize: 14 }}>{rev.date}</Typography>
              </Stack>
            ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}