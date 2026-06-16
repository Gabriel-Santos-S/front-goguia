import { Roteiro } from "@/types";
import { Box, Stack, Typography } from "@mui/material";
import 'dayjs/locale/pt-br';
import { MessagesSquare, Star } from "lucide-react";


const ORANGE = "#F47B2A";
const NAVY = "#1F3A66";
const BG = "#eef0f2";

interface TabDetalhesProps {
    roteiro: Roteiro
}

export default function TabDetalhes({ roteiro }: TabDetalhesProps) {

    return (
        <>
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "200px 1fr" },
                    gap: 4,
                    mt: 3,
                }}
            >
                <Stack spacing={2}>
                    <Box>
                        <Typography sx={{ color: NAVY, fontWeight: 700 }}>Local</Typography>
                        <Typography sx={{ color: "#3a4554" }}>{roteiro?.local}</Typography>
                    </Box>
                    <Box>
                        <Typography sx={{ color: NAVY, fontWeight: 700 }}>
                            Distância
                        </Typography>
                        <Typography sx={{ color: "#3a4554" }}>2 Km</Typography>
                    </Box>
                </Stack>

                <Box>
                    <Typography sx={{ color: NAVY, fontWeight: 700, mb: 1 }}>
                        Descrição do roteiro
                    </Typography>
                    <Box
                        sx={{
                            borderLeft: `3px solid ${NAVY}`,
                            pl: 2,
                            color: "#3a4554",
                            lineHeight: 1.6,
                            fontSize: 14,
                        }}
                    >
                        <Typography sx={{ mb: 1 }}>
                            {roteiro?.descricao}
                        </Typography>
                    </Box>
                </Box>
            </Box>
            {/* <Stack
                direction="row"
                spacing={3}
                sx={{ justifyContent: "flex-end", mt: 6, mb: 4 }}
            >
                {[
                    { icon: <MessagesSquare color="#ffffff" size={"30px"} />, label: "Chat" },
                    { icon: <Star color="#ffffff" size={"30px"} />, label: "Avaliações" },
                ].map((c) => (
                    <Box
                        key={c.label}
                        sx={{
                            bgcolor: "#fff",
                            border: `1.5px solid ${ORANGE}`,
                            borderRadius: 2,
                            px: 4,
                            py: 2,
                            minWidth: 220,
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            cursor: "pointer",
                        }}
                    >
                        <Box
                            sx={{
                                width: 54,
                                height: 54,
                                borderRadius: "50%",
                                bgcolor: ORANGE,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            {c.icon}
                        </Box>
                        <Typography sx={{ color: NAVY, fontSize: 24, fontWeight: 500 }}>
                            {c.label}
                        </Typography>
                    </Box>
                ))}
            </Stack> */}
        </>
    )

}