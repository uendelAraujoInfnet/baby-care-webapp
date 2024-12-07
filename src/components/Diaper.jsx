import React, { useState } from "react";
import { Box, Button, TextField, Typography, Select, MenuItem } from "@mui/material";

const Diaper = ({ onSubmit }) => {
  const [status, setStatus] = useState(""); // Estado para o campo de Status
  const [observation, setObservation] = useState(""); // Estado para o campo de Observação

  const handleSubmit = () => {
    if (!status) {
      alert("Por favor, selecione um status.");
      return;
    }

    onSubmit("diaper", { status, observation });
    setStatus("");
    setObservation("");
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Adicionar Fralda
      </Typography>

      <Box mb={2}>
        <Typography variant="body1">Status:</Typography>
        <Select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          fullWidth
          displayEmpty
        >
          <MenuItem value="" disabled>
            Selecione o Status
          </MenuItem>
          <MenuItem value="Limpa">Limpa</MenuItem>
          <MenuItem value="Suja">Suja</MenuItem>
          <MenuItem value="Troca Necessária">Troca Necessária</MenuItem>
        </Select>
      </Box>

      <Box mb={2}>
        <Typography variant="body1">Observação:</Typography>
        <TextField
          value={observation}
          onChange={(e) => setObservation(e.target.value)}
          fullWidth
          placeholder="Adicione uma observação (opcional)"
        />
      </Box>

      <Button variant="contained" color="success" onClick={handleSubmit} style={{marginBottom: "15px", width: "100%", fontWeight: "bold"}}>
        Salvar
      </Button>
    </Box>
  );
};

export default Diaper;
