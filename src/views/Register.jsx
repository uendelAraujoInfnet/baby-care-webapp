import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { createUser } from "../services/supabaseClient";
import { saveToLocalStorage } from "../utils/localStorage";
import AlertComponent from "../components/AlertComponent";
import { supabase } from "../services/supabaseClient";
import { useTranslation } from "react-i18next";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { t } = useTranslation();
  const [avatar, setAvatar] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    message: "",
    severity: "info",
  });
  const navigate = useNavigate();

  const handleFileUpload = (event) => {
    setAvatar(event.target.files[0]);
  };

  const handleRegister = async () => {
    if (!username || !password || !avatar) {
      setAlertConfig({
        message: "Por favor, preencha todos os campos e selecione uma imagem.",
        severity: "warning",
      });
      setAlertOpen(true);
      return;
    }

    try {
      // Validar o tipo de arquivo antes de enviar
      const validFormats = ["image/jpeg", "image/png", "image/jpg"];
      if (!validFormats.includes(avatar.type)) {
        setAlertConfig({
          message: "Formato de imagem inválido. Use PNG ou JPG.",
          severity: "error",
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
          message: "Erro ao fazer upload da imagem.",
          severity: "error",
        });
        setAlertOpen(true);
        return;
      }

      // Gera a URL pública do avatar
      const avatarUrl = supabase.storage
        .from("avatars")
        .getPublicUrl(uploadData.path || "https://i.pinimg.com/236x/bb/09/d7/bb09d7f7be9dae964057426e13c7461b.jpg").publicUrl;

      // Cadastro do usuário com o avatar
      const { data, error } = await createUser(username, password, avatarUrl);

      if (error) {
        console.error("Erro ao cadastrar usuário:", error);
        setAlertConfig({
          message: "Erro ao cadastrar usuário! Tente novamente.",
          severity: "error",
        });
        setAlertOpen(true);
        return;
      }

      setAlertConfig({
        message: "Usuário cadastrado com sucesso!",
        severity: "success",
      });
      setAlertOpen(true);

      // Redireciona para login após 1.5 segundos
      setTimeout(() => {
        saveToLocalStorage("user", data[0]);
        navigate("/");
      }, 1500);
    } catch (err) {
      console.error("Erro ao processar o cadastro:", err);
      setAlertConfig({
        message: "Erro inesperado! Tente novamente.",
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

        {/*BOTÃO DE UPLOAD DE AVATAR*/}
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

        {/*BOTÃO DE CADASTRO*/}
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
