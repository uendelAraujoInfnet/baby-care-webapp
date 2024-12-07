import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { createUser } from "../services/supabaseClient";
import AlertComponent from "../components/AlertComponent";
import { supabase } from "../services/supabaseClient";
import { useTranslation } from "react-i18next";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState(null);
  const { t } = useTranslation();
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    message: "",
    severity: "info",
  });
  const navigate = useNavigate();

  // Validação de email
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleFileUpload = (event) => {
    setAvatar(event.target.files[0]);
  };

  const handleRegister = async () => {
    try {
      if (!email || !password || !username || !avatar) {
        setAlertConfig({
          message:
            "Por favor, preencha todos os campos e selecione uma imagem.",
          severity: "warning",
        });
        setAlertOpen(true);
        return;
      }

      if (!isValidEmail(email)) {
        setAlertConfig({
          message: "Por favor, insira um email válido.",
          severity: "warning",
        });
        setAlertOpen(true);
        return;
      }

      if (password.length < 6) {
        setAlertConfig({
          message: "A senha deve ter pelo menos 6 caracteres.",
          severity: "warning",
        });
        setAlertOpen(true);
        return;
      }

      // Upload do avatar para o Supabase
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(`public/${Date.now()}_${avatar.name}`, avatar, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        console.error("Erro ao fazer upload do avatar:", uploadError);
        setAlertConfig({
          message: "Erro ao fazer upload da imagem. Tente novamente.",
          severity: "error",
        });
        setAlertOpen(true);
        return;
      }

      const avatarUrl = supabase.storage
        .from("avatars")
        .getPublicUrl(uploadData.path).publicUrl;

      console.log("URL do Avatar:", avatarUrl);

      // Registrar o usuário no Supabase
      const { data, error } = await createUser(email, password, username, avatarUrl);

      if (error) {
        console.error("Erro ao registrar usuário:", error);
        setAlertConfig({
          message: "Erro ao registrar usuário. Tente novamente.",
          severity: "error",
        });
        setAlertOpen(true);
        return;
      }

      setAlertConfig({
        message: "Usuário registrado com sucesso!",
        severity: "success",
      });
      setAlertOpen(true);

      // Redirecionar após 1.5 segundos
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      console.error("Erro ao processar registro:", err);
      setAlertConfig({
        message:
          "Erro inesperado. Verifique as configurações e tente novamente.",
        severity: "error",
      });
      setAlertOpen(true);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box mt={10} display="flex" flexDirection="column" alignItems="center">
        <Typography variant="h5">{t("register")}</Typography>
        <TextField
          fullWidth
          margin="normal"
          label={t("user")}
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <TextField
          fullWidth
          margin="normal"
          label={t("email")}
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          type="password"
          label={t("password")}
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Botão para upload de avatar */}
        <Button
          variant="contained"
          component="label"
          style={{ marginTop: "10px", fontWeight: "bold" }}
        >
          {t("select an image")}
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleFileUpload}
          />
        </Button>
        {avatar && <Typography variant="body2">{avatar.name}</Typography>}

        {/* Botão de registro */}
        <Button
          variant="contained"
          color="success"
          fullWidth
          onClick={handleRegister}
          style={{ marginTop: "10px", fontWeight: "bold" }}
        >
          {t("register")}
        </Button>
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

export default Register;
