import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";

const Eat = ({ onSubmit }) => {
  const [method, setMethod] = useState("");
  const [observation, setObservation] = useState("");

  const handleFormSubmit = async (type, data) => {
    const { result, error } = await saveEntry(type, data);
  
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
      <Button variant="contained" color="primary" onClick={handleFormSubmit} style={{marginBottom: "15px"}}>
        Adicionar Alimentação
      </Button>
    </Box>
  );
};

export default Eat;
