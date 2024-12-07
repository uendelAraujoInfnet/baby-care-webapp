import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";

const Sleep = ({ onSubmit }) => {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [observation, setObservation] = useState("");

  const handleFormSubmit = async (type, data) => {
    const { result, error } = await saveEntry(type, data);
    const sleepStart = new Date(`1970-01-01T${formData.start}:00`);
    const sleepEnd = new Date(`1970-01-01T${formData.end}:00`);
    const minutesSlept = (sleepEnd - sleepStart) / 60000; // Calcula minutos

    onSubmit("sleep", { ...formData, minutesSlept });

    if (error) {
      alert("Erro ao salvar entrada!");
      return;
    }

    alert("Entrada salva com sucesso!");
    setCurrentForm(null); // Fecha o formulário após salvar
  };

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <TextField
        label="Início (HH:MM)"
        value={start}
        onChange={(e) => setStart(e.target.value)}
        fullWidth
        required
      />
      <TextField
        label="Término (HH:MM)"
        value={end}
        onChange={(e) => setEnd(e.target.value)}
        fullWidth
        required
      />
      <TextField
        label="Observação"
        value={observation}
        onChange={(e) => setObservation(e.target.value)}
        fullWidth
      />
      <Button variant="contained" color="primary" onClick={handleFormSubmit} style={{marginBottom: "15px"}}>
        Adicionar Sono
      </Button>
    </Box>
  );
};

export default Sleep;
