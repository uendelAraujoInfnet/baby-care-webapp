import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Box, CircularProgress, Button } from "@mui/material";
import { supabase } from "../services/supabaseClient";

const Dashboard = () => {
  const [diaperCount, setDiaperCount] = useState(0);
  const [totalSleepTime, setTotalSleepTime] = useState(0); // Em minutos
  const [eatCount, setEatCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Verifica a sessão do usuário
        const { data: session, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !session?.session?.user) {
          console.error("Usuário não autenticado!");
          return;
        }

        const userId = session.session.user.id;

        // Busca os dados de entradas
        const { data: entries, error: entriesError } = await supabase
          .from("entries")
          .select("*")
          .eq("user_id", userId);

        if (entriesError) {
          console.error("Erro ao buscar entradas:", entriesError);
          return;
        }

        // Calcula os totais
        const diaperEntries = entries.filter((entry) => entry.type === "diaper");
        const sleepEntries = entries.filter((entry) => entry.type === "sleep");
        const eatEntries = entries.filter((entry) => entry.type === "eat");

        const totalSleep = sleepEntries.reduce((total, entry) => total + entry.duration, 0);

        setDiaperCount(diaperEntries.length);
        setTotalSleepTime(totalSleep);
        setEatCount(eatEntries.length);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box mt={5} textAlign="center">
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Box mt={3}>
          <Typography variant="h6">Quantidade de fraldas trocadas:</Typography>
          <Typography variant="h5">{diaperCount}</Typography>
        </Box>
        <Box mt={3}>
          <Typography variant="h6">Tempo total de sono (em minutos):</Typography>
          <Typography variant="h5">{totalSleepTime} minutos</Typography>
        </Box>
        <Box mt={3}>
          <Typography variant="h6">Quantidade de vezes que o bebê comeu:</Typography>
          <Typography variant="h5">{eatCount}</Typography>
        </Box>
        <Box mt={4}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate("/home")}
            style={{ fontWeight: "bold", width: "70%" }}
          >
            Voltar para Home
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Dashboard;
