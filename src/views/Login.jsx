import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { loginUser } from "../services/supabaseClient";
import { saveToLocalStorage } from "../utils/localStorage";
import AuthContext from "../contexts/AuthContext";
import SettingsButton from "../components/SettingsButton";
import AlertComponent from "../components/AlertComponent";
import { useTranslation } from "react-i18next";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    message: "",
    severity: "info",
  });

  const { login } = useContext(AuthContext);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      setAlertConfig({
        message: "Por favor, preencha todos os campos.",
        severity: "warning",
      });
      setAlertOpen(true);
      return;
    }

    try {
      const { data, error } = await loginUser(username, password);

      if (error || !data) {
        setAlertConfig({
          message: "Usuário ou senha inválidos!",
          severity: "error",
        });
        setAlertOpen(true);
        return;
      }

      setAlertConfig({
        message: "Login realizado com sucesso!",
        severity: "success",
      });
      setAlertOpen(true);

      // Redireciona para a página Home após 1.5 segundos
      setTimeout(() => {
        login(data); // Atualiza o estado global com os dados do usuário
        saveToLocalStorage("user", data);
        navigate("/home");
      }, 1500);
    } catch (err) {
      console.error("Erro ao tentar fazer login:", err);
      setAlertConfig({
        message: "Erro ao tentar fazer login. Tente novamente.",
        severity: "error",
      });
      setAlertOpen(true);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box mt={10} display="flex" flexDirection="column" alignItems="center">
        <Typography variant="h5">Login</Typography>
        <TextField
          fullWidth
          margin="normal"
          label={t("user")}
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          type="password"
          label={t("password")}
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          variant="contained"
          color="success"
          fullWidth
          onClick={handleLogin}
        >
          {t("connect")}
        </Button>
      </Box>

      <Box mt={2}>
        <Typography variant="body2">
          {t("don't have an account?")} <Link to="/register">{t("register")}</Link>
        </Typography>
      </Box>

      <Box mt={3} display="flex" justifyContent="flex-end" width="100%">
        <SettingsButton />
      </Box>

      <AlertComponent
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
        message={alertConfig.message}
        severity={alertConfig.severity}
      />
    </Container>
  );
};

export default Login;
