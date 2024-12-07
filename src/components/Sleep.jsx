import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";

const Sleep = ({ onSubmit }) => {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [observation, setObservation] = useState("");

  const handleSubmit = () => {
    if (!start || !end) {
      alert("Por favor, preencha o horário de início e término!");
      return;
    }
    onSubmit({ start, end, observation });
    setStart("");
    setEnd("");
    setObservation("");
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
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Adicionar Sono
      </Button>
    </Box>
  );
};

export default Sleep;
