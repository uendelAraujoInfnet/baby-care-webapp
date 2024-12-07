import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { supabase } from "../services/supabaseClient";
import AuthContext from "../contexts/AuthContext";
import SettingsButton from "../components/SettingsButton";
import AlertComponent from "../components/AlertComponent";
import { useTranslation } from "react-i18next";

const Login = () => {
  const [email, setEmail] = useState(""); // Corrigido para usar email
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
    if (!email || !password) {
      setAlertConfig({
        message: "Por favor, preencha todos os campos.",
        severity: "warning",
      });
      setAlertOpen(true);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Erro ao tentar fazer login:", error);
        setAlertConfig({
          message: error.message || "Erro ao tentar fazer login. Tente novamente.",
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

      // Atualiza o contexto global e redireciona
      login(data.user);
      navigate("/home");
    } catch (err) {
      console.error("Erro inesperado ao tentar fazer login:", err);
      setAlertConfig({
        message: "Erro inesperado. Tente novamente.",
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
          label={t("email")} // Corrigido para "email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          style={{ marginTop: "10px", fontWeight: "bold" }}
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
