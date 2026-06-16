import { Navigate, Outlet } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { useAuth } from "./AuthContext";
import { useEffect } from "react";
// import { validacaoApi } from "@/services/api";


export const ProtectdRouts = () => {
  const { isAuthenticated, isLoading, logout } = useAuth();
//   const tempoVerificação = 20 * 60 * 1000;

//   useEffect(() => {
//     try {
//       const localStorageTimer = localStorage.getItem("tempoSessao");

//       if (!localStorageTimer) {
//         console.warn("Não foi possivel buscar o tempo da sessão");
//         logout()
//         return;
//       }

//       const intervalo = setInterval(() => {
//         validacaoApi.get("/validar")
//       }, tempoVerificação);

//       return () => clearInterval(intervalo);
//     } catch (error) {
//       console.warn("Erro na validação da sessão:", error);
//       logout()
//     }
//   }, [])

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress size={100} color="primary" />
      </Box>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={"/"} replace />
  }

  return <Outlet />
}