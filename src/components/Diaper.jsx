import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";

const Diaper = ({ onSubmit }) => {
  const [status, setStatus] = useState("");
  const [observation, setObservation] = useState("");

  const handleSubmit = () => {
    if (!status) {
      alert("Por favor, preencha o status!");
      return;
    }
    onSubmit({ status, observation });
    setStatus("");
    setObservation("");
  };

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <TextField
        label="Status"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
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
        Adicionar Fralda
      </Button>
    </Box>
  );
};

export default Diaper;
