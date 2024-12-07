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
import Diaper from "../components/Diaper";
import Sleep from "../components/Sleep";
import Eat from "../components/Eat";

const Home = () => {
  const { user, logout } = useContext(AuthContext);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [babyInfo, setBabyInfo] = useState(null);
  const [sessionError, setSessionError] = useState(null); 
  const [currentForm, setCurrentForm] = useState(null); 

  // Verificar sessão do usuário
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: session, error } = await supabase.auth.getSession();
        if (error || !session?.session) {
          console.error("Sessão inválida ou usuário não autenticado.");
          navigate("/"); 
          return;
        }
        console.log("Sessão válida:", session);
      } catch (err) {
        console.error("Erro ao verificar a sessão:", err);
        navigate("/");
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

        const { data: entriesData, error: entriesError } = await getEntries(user.id);
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

  const handleFormSubmit = (type, data) => {
    handleAddEntry(type, data);
    setCurrentForm(null); 
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
            <Button variant="contained" color="error" onClick={handleLogout}>
              {t("logout")}
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

      {currentForm ? (
        <>
          {currentForm === "diaper" && <Diaper onSubmit={handleFormSubmit} />}
          {currentForm === "sleep" && <Sleep onSubmit={handleFormSubmit} />}
          {currentForm === "eat" && <Eat onSubmit={handleFormSubmit} />}
          <Button variant="contained" onClick={() => setCurrentForm(null)}>
            {t("back")}
          </Button>
        </>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography variant="h5">{t("diaper")}</Typography>
                <Button
                  variant="contained"
                  onClick={() => setCurrentForm("diaper")}
                >
                 {t("add")} {t("diaper")}
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography variant="h5">{t("sleep")}</Typography>
                <Button
                  variant="contained"
                  onClick={() => setCurrentForm("sleep")}
                >
                 {t("add")} {t("sleep")}
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography variant="h5">{t("breast-feeding")}</Typography>
                <Button
                  variant="contained"
                  onClick={() => setCurrentForm("eat")}
                >
                 {t("add")} {t("breast-feeding")}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

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
