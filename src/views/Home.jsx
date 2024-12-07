import React, { useContext, useState, useEffect } from "react";
import {
  Typography,
  Container,
  Box,
  Card,
  CardContent,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import AuthContext from "../contexts/AuthContext";
import { getBabyData, getEntries, addEntry } from "../services/supabaseClient";
import SettingsButton from "../components/SettingsButton";
import { useTranslation } from "react-i18next";
import AvatarComponent from "../components/AvatarComponent";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";

const Home = () => {
  const { user, logout } = useContext(AuthContext);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [babyInfo, setBabyInfo] = useState(null);
  const [sessionError, setSessionError] = useState(null); // Novo estado para erros de sessão

  // Verificar sessão do usuário
  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();

      if (!session || !session.user) {
        console.error("Sessão inválida ou usuário não autenticado.");
        navigate("/"); // Redireciona para a página de login
      }
    };

    checkSession();
  }, [navigate]);

  // Sincronizar dados na inicialização
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: babyData, error: babyError } = await getBabyData();
        if (babyError || !babyData) {
          throw new Error("Nenhum dado encontrado.");
        }
        setBabyInfo(babyData);

        const { data: entriesData, error: entriesError } = await getEntries(
          user.id
        );
        if (entriesError || !entriesData) {
          throw new Error("Erro ao carregar histórico.");
        }
        setEntries(entriesData);
      } catch (error) {
        console.error("Erro ao carregar informações:", error.message);
      }
    };

    fetchData();
  }, [user]);

  if (sessionError) {
    return (
      <Container>
        <Typography variant="h6" color="error">
          {sessionError}
        </Typography>
      </Container>
    );
  }

  const handleAddEntry = async (type, data) => {
    const newEntry = { type, ...data, timestamp: new Date().toISOString() };

    const { result, error } = await addEntry(type, data, user.id);
    if (error) {
      alert("Erro ao salvar entrada no Supabase!");
      return;
    }

    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleNavigateToBabyForm = () => {
    navigate("/form");
  };

  return (
    <Container>
      <Box my={4}>
        <Box
          my={4}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <AvatarComponent src={user?.avatar} alt={user?.username} size={80} />
          <Typography variant="h4">
            {t("welcome")}, {user?.username || "User"}
          </Typography>
          <Box display="flex" gap={2}>
            <SettingsButton />
            <Button variant="outlined" color="error" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </Box>

        <Box>
          {babyInfo ? (
            <Typography variant="h6">
              {t("baby")}: {babyInfo.name}, {t("weight")}: {babyInfo.weight}kg,{" "}
              {t("length")}: {babyInfo.length}cm
            </Typography>
          ) : (
            <Typography variant="body1" color="textSecondary">
              {t("no-baby-info")}
            </Typography>
          )}
        </Box>
      </Box>

      <Box mb={4} display="flex" justifyContent="center">
        <Button
          variant="contained"
          color="primary"
          onClick={handleNavigateToBabyForm}
        >
          {t("register-baby")}
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Card Fralda */}
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h5">{t("diaper")}</Typography>
              <Button
                variant="contained"
                onClick={() =>
                  handleAddEntry(t("diaper"), {
                    status: "Limpa",
                    observation: "Tudo ok!",
                  })
                }
              >
                Adicionar {t("diaper")}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Card Sono */}
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h5">{t("sleep")}</Typography>
              <Button
                variant="contained"
                onClick={() =>
                  handleAddEntry(t("sleep"), {
                    start: "22:00",
                    end: "06:00",
                    observation: "",
                  })
                }
              >
                Adicionar {t("sleep")}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Card Amamentação */}
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h5">{t("breast-feeding")}</Typography>
              <Button
                variant="contained"
                onClick={() =>
                  handleAddEntry(t("breast-feeding"), {
                    method: "Seio",
                    observation: "20 min lado direito",
                  })
                }
              >
                Adicionar {t("breast-feeding")}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box mt={4}>
        <Typography variant="h5">{t("history")}</Typography>
        <List>
          {entries.map((entry, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={`${entry.type} - ${entry.timestamp}`}
                secondary={entry.observation || "Sem observação"}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
};

export default Home;
