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
import { syncData } from "../services/syncService";
import { addEntry } from "../services/supabaseClient";
import { saveToLocalStorage, getFromLocalStorage } from "../utils/localStorage";
import SettingsButton from "../components/SettingsButton";
import { useTranslation } from "react-i18next";
import AvatarComponent from "../components/AvatarComponent";

const Home = () => {
  const { user } = useContext(AuthContext);
  const { t } = useTranslation();
  const [entries, setEntries] = useState([]);
  const [babyInfo, setBabyInfo] = useState({
    name: "Bebê",
    weight: "3kg",
    length: "50cm",
  });

  // Sincronização dos dados na inicialização
  useEffect(() => {
    const fetchEntries = async () => {
      const storedEntries = await syncData(user.id, "babyEntries", "entries");
      if (storedEntries) setEntries(storedEntries);

      // Carregar informações do bebê do LocalStorage
      const storedBabyInfo = getFromLocalStorage("babyInfo");
      if (storedBabyInfo) setBabyInfo(storedBabyInfo);
    };
    fetchEntries();
  }, [user]);

  const handleAddEntry = async (type, data) => {
    const newEntry = { type, ...data, timestamp: new Date().toISOString() };

    // Salvar no Supabase
    const { result, error } = await addEntry(type, data, user.id);
    if (error) {
      alert("Erro ao salvar entrada no Supabase!");
      return;
    }

    // Atualizar LocalStorage e estado
    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);
    saveToLocalStorage("babyEntries", updatedEntries);
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
          <SettingsButton />
        </Box>

        <Typography variant="h6">
          {t("baby")}: {babyInfo.name}, {t("weight")}: {babyInfo.weight},{" "}
          {t("length")}: {babyInfo.length}
        </Typography>
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

      {/* Lista de Entradas */}
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
