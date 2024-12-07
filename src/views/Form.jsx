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
import { saveBabyData } from "../services/supabaseClient";
import { useNavigate } from "react-router-dom";
import AlertComponent from "../components/AlertComponent";
import { useTranslation } from "react-i18next";

const Form = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [babyInfo, setBabyInfo] = useState({
    name: "",
    weight: "",
    length: "",
    birthDate: "",
    diseases: [],
  });

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    message: "",
    severity: "info",
  });

  const diseasesList = ["Asma", "Diabetes", "Alergias", "Doenças cardíacas", "Outros"];

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
    try {
      if (!babyInfo.name || !babyInfo.weight || !babyInfo.length || !babyInfo.birthDate) {
        setAlertConfig({
          message: t("please-fill-all-fields"),
          severity: "warning",
        });
        setAlertOpen(true);
        return;
      }

      const { data, error } = await saveBabyData(babyInfo);

      if (error) {
        throw error;
      }

      setAlertConfig({
        message: t("baby-data-saved-successfully"),
        severity: "success",
      });
      setAlertOpen(true);

      // Redirecionar após 1.5 segundos
      setTimeout(() => {
        navigate("/home");
      }, 1500);
    } catch (err) {
      console.error("Erro ao salvar dados do bebê:", err);
      setAlertConfig({
        message: t("error-saving-baby-data"),
        severity: "error",
      });
      setAlertOpen(true);
    }
  };

  const handleNavigateHome = () => {
    navigate("/home");
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
          label={t("birth-date")}
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
          <InputLabel>{t("diseases")}</InputLabel>
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
          <Button variant="contained" color="primary" onClick={handleSubmit} style={{width: "48%", fontWeight: "bold"}}>
            {t("save-info")}
          </Button>
          <Button variant="contained" color="error" onClick={handleNavigateHome} style={{marginLeft: '4%', width: "48%", fontWeight: "bold"}}>
            {t("back-to-home")}
          </Button>
        </Box>
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

export default Form;
