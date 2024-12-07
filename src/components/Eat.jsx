import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";

const Eat = ({ onSubmit }) => {
  const [method, setMethod] = useState("");
  const [observation, setObservation] = useState("");

  const handleSubmit = () => {
    if (!method) {
      alert("Por favor, preencha o método de alimentação!");
      return;
    }
    onSubmit({ method, observation });
    setMethod("");
    setObservation("");
  };

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <TextField
        label="Método (Seio, Mamadeira, etc.)"
        value={method}
        onChange={(e) => setMethod(e.target.value)}
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
        Adicionar Alimentação
      </Button>
    </Box>
  );
};

export default Eat;
