import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { saveBabyData} from "../services/supabaseClient";
import { useTranslation } from "react-i18next";

const Form = () => {
  const {t} = useTranslation();

  const [babyInfo, setBabyInfo] = useState({
    name: "",
    weight: "",
    length: "",
    birthDate: "",
    diseases: [],
  });

  const diseasesList = [
    "Asma",
    "Diabetes",
    "Alergias",
    "Doenças cardíacas",
    "Outros",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBabyInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDiseaseChange = (event) => {
    const {
      target: { value },
    } = event;
    setBabyInfo((prev) => ({
      ...prev,
      diseases: typeof value === "string" ? value.split(",") : value,
    }));
  };

  const handleSubmit = async () => {
    if (
      !babyInfo.name ||
      !babyInfo.weight ||
      !babyInfo.length ||
      !babyInfo.birthDate
    ) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    // Salvar as informações no Supabase
    const { data, error } = await saveBabyData(babyInfo);

    if (error) {
      alert("Erro ao salvar informações do bebê!");
      console.error(error);
      return;
    }

    alert("Informações salvas com sucesso!");
  };

  return (
    <Container maxWidth="sm">
      <Box mt={4}>
        <Typography variant="h4" align="center" gutterBottom>
          {t("baby-info")}
        </Typography>
        <TextField
          label={t("baby-name")}
          name="name"
          value={babyInfo.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label={t("weight")}
          name="weight"
          value={babyInfo.weight}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label={t("length")}
          name="length"
          value={babyInfo.length}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label={t("birth")}
          name="birthDate"
          type="date"
          value={babyInfo.birthDate}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          required
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>{t("disease")}</InputLabel>
          <Select
            multiple
            value={babyInfo.diseases}
            onChange={handleDiseaseChange}
            renderValue={(selected) => selected.join(", ")}
          >
            {diseasesList.map((disease) => (
              <MenuItem key={disease} value={disease}>
                <Checkbox checked={babyInfo.diseases.includes(disease)} />
                <ListItemText primary={disease} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box mt={2} display="flex" justifyContent="center">
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            {t("save-info")}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Form;
