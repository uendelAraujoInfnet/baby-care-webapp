import React, { useContext, useState, useEffect } from "react";
import {
  Typography,
  Container,
  Box,
  Card,
  CardContent,
  Button,
  Grid,
  Pagination,
} from "@mui/material";
import AuthContext from "../contexts/AuthContext";
import {
  getBabyData,
  getEntries,
  addEntry,
  updateEntry,
  deleteEntry,
} from "../services/supabaseClient";
import SettingsButton from "../components/SettingsButton";
import { useTranslation } from "react-i18next";
import AvatarComponent from "../components/AvatarComponent";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import Diaper from "../components/Diaper";
import Sleep from "../components/Sleep";
import Eat from "../components/Eat";
import { format } from "date-fns";

const ITEMS_PER_PAGE = 10; // Máximo de itens por página

const Home = () => {
  const { user, logout } = useContext(AuthContext);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [babyInfo, setBabyInfo] = useState(null);
  const [sessionError, setSessionError] = useState(null);
  const [currentForm, setCurrentForm] = useState(null);
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [editingEntry, setEditingEntry] = useState(null);

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
        const { data: session, error: sessionError } =
          await supabase.auth.getSession();
        if (sessionError || !session?.session?.user) {
          console.error("Usuário não autenticado!");
          return;
        }

        const userId = session.session.user.id;

        const { data: babyData, error: babyError } = await getBabyData();
        if (babyError || !babyData) {
          throw new Error("Nenhum dado encontrado.");
        }
        setBabyInfo(babyData);

        const { data: entriesData, error: entriesError } = await getEntries(
          userId
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
  }, []);

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

    setEntries([newEntry, ...entries]);
    setCurrentForm(null);
  };

  const handleEditEntry = (entry) => {
    setEditingEntry(entry);
    setCurrentForm(entry.type); // Abre o formulário correspondente
  };

  const handleDeleteEntry = async (entryId) => {
    const { error } = await deleteEntry(entryId);
    if (error) {
      alert("Erro ao deletar entrada. Tente novamente.");
      return;
    }
    setEntries(entries.filter((entry) => entry.id !== entryId));
  };

  const handleFormSubmit = async (type, data) => {
    if (editingEntry) {
      // Atualizar entrada existente
      const { error } = await updateEntry(editingEntry.id, { ...data, type });
      if (error) {
        alert("Erro ao atualizar entrada. Tente novamente.");
        return;
      }
      setEntries(
        entries.map((entry) =>
          entry.id === editingEntry.id ? { ...entry, ...data } : entry
        )
      );
    } else {
      // Adicionar nova entrada
      handleAddEntry(type, data);
    }
    setEditingEntry(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleNavigateToBabyForm = () => {
    navigate("/form");
  };

  const handleEdit = (entry) => {
    navigate(`/edit/${entry.id}`, { state: entry });
  };

  const handleDelete = async (id) => {
    const confirmation = window.confirm(
      "Tem certeza que deseja excluir este item?"
    );
    if (!confirmation) return;

    const { error } = await deleteEntry(id);
    if (error) {
      alert("Erro ao deletar o item. Tente novamente.");
      console.error("Erro ao deletar:", error);
      return;
    }

    // Atualiza a lista de entradas no estado local
    setEntries((prevEntries) => prevEntries.filter((entry) => entry.id !== id));
  };

  const currentItems = entries.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(entries.length / ITEMS_PER_PAGE);

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
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </Button>
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
        <>
          {/* Botões para Adicionar Novo Diaper, Sleep e Eat */}
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

          {/* Histórico com Botões de Editar e Deletar */}
          <Box mt={4}>
            <Typography variant="h5">{t("history")}</Typography>
            <Grid container spacing={2}>
              {entries
                .slice(
                  (currentPage - 1) * itemsPerPage,
                  currentPage * itemsPerPage
                )
                .map((entry) => (
                  <Grid item xs={12} sm={6} md={4} key={entry.id}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6">
                          {entry.type} -{" "}
                          {format(
                            new Date(entry.timestamp),
                            "dd/MM/yyyy HH:mm"
                          )}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {entry.observation || t("no-observation")}
                        </Typography>
                        <Box
                          mt={2}
                          display="flex"
                          justifyContent="space-between"
                        >
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleEdit(entry)}
                          >
                            {t("edit")}
                          </Button>
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => handleDelete(entry.id)}
                          >
                            {t("delete")}
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
            </Grid>
            {/* Paginação */}
            <Box mt={4} display="flex" justifyContent="center">
              <Pagination
                count={Math.ceil(entries.length / itemsPerPage)}
                page={currentPage}
                onChange={(event, value) => setCurrentPage(value)}
              />
            </Box>
          </Box>
        </>
      )}
    </Container>
  );
};

export default Home;
