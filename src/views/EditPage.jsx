import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TextField, Button, Container, Box, Typography, CircularProgress } from "@mui/material";
import { supabase } from "../services/supabaseClient";

const EditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: "",
    start: "",
    end: "",
    observation: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Buscar dados para edição
  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const { data, error } = await supabase
          .from("entries")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          console.error("Erro ao buscar entrada:", error);
          alert("Erro ao buscar entrada.");
          navigate("/"); // Voltar para a página inicial em caso de erro
          return;
        }

        // Configura os dados no formulário com valores padrão se forem `null`
        setFormData({
          type: data.type || "",
          start: data.start || "",
          end: data.end || "",
          observation: data.observation || "",
        });
        setLoading(false);
      } catch (err) {
        console.error("Erro inesperado:", err);
        alert("Erro inesperado.");
        navigate("/");
      }
    };

    fetchEntry();
  }, [id, navigate]);

  // Manipular mudanças no formulário
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Salvar alterações
  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("entries")
        .update({
          type: formData.type,
          start: formData.start,
          end: formData.end,
          observation: formData.observation,
        })
        .eq("id", id);

      if (error) {
        console.error("Erro ao salvar entrada:", error);
        alert("Erro ao salvar entrada.");
        setSaving(false);
        return;
      }

      alert("Entrada atualizada com sucesso!");
      setTimeout(() => {
        navigate("/home"); // Voltar para Home após 1,5 segundos
      }, 1500);
    } catch (err) {
      console.error("Erro inesperado:", err);
      alert("Erro inesperado ao salvar.");
      setSaving(false);
    }
  };

  // Cancelar e voltar para a página inicial
  const handleCancel = () => {
    navigate("/home");
  };

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
      <Box mt={5}>
        <Typography variant="h4" gutterBottom>
          Editar Entrada
        </Typography>
        <Box component="form" display="flex" flexDirection="column" gap={3}>
          <TextField
            label="Tipo"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            fullWidth
            disabled // Tipo geralmente é fixo
          />
          <TextField
            label="Início"
            name="start"
            value={formData.start}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label="Término"
            name="end"
            value={formData.end}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label="Observação"
            name="observation"
            value={formData.observation}
            onChange={handleInputChange}
            multiline
            rows={4}
            fullWidth
          />
          <Box display="flex" justifyContent="space-between">
            <Button variant="outlined" color="error" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default EditPage;
