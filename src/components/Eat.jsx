import React, { useState } from "react";
import { Box, TextField, Button, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { supabase, saveEntry } from "../services/supabaseClient";

const Eat = ({ onSubmit }) => {
  const [method, setMethod] = useState("");
  const [observation, setObservation] = useState("");

  const handleFormSubmit = async () => {
    if (!method || !observation) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    // Obtém o usuário autenticado
    const { data: session, error } = await supabase.auth.getSession();
    if (error || !session?.session?.user) {
      alert("Usuário não autenticado!");
      return;
    }

    const userId = session.session.user.id;

    const eatData = {
      type: "eat",
      method,
      observation,
      user_id: userId,
      timestamp: new Date().toISOString(),
      data: new Date().toISOString()
    };

    // Salva a entrada no Supabase
    const { result, saveError } = await saveEntry("eat", eatData, userId);
    if (saveError) {
      alert("Erro ao salvar entrada de alimentação. Tente novamente.");
      return;
    }

    onSubmit("eat", eatData); // Adiciona ao histórico
    setMethod("");
    setObservation("");
  };

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <FormControl fullWidth required>
        <InputLabel id="method-label">Método</InputLabel>
        <Select
          labelId="method-label"
          value={method}
          onChange={(e) => setMethod(e.target.value)}
        >
          <MenuItem value="Seio">Seio</MenuItem>
          <MenuItem value="Mamadeira">Mamadeira</MenuItem>
          <MenuItem value="Sólidos">Sólidos</MenuItem>
          <MenuItem value="Papinha">Papinha</MenuItem>
          <MenuItem value="Outro">Outro</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Observação"
        value={observation}
        onChange={(e) => setObservation(e.target.value)}
        fullWidth
      />
      <Button variant="contained" color="success" onClick={handleFormSubmit} style={{ marginBottom: "15px" }}>
        Adicionar Alimentação
      </Button>
    </Box>
  );
};

export default Eat;
