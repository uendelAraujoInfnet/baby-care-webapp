import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { saveEntry } from "../services/supabaseClient";
import { supabase } from "../services/supabaseClient";

const Sleep = ({ onSubmit }) => {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [observation, setObservation] = useState("");

  const handleFormSubmit = async () => {
    if (!start || !end) {
      alert("Por favor, preencha os campos de início e término.");
      return;
    }
  
    // Calcula a duração em minutos
    const startTime = new Date(`1970-01-01T${start}:00`);
    const endTime = new Date(`1970-01-01T${end}:00`);
    const duration = (endTime - startTime) / (1000 * 60); // Duração em minutos
  
    if (duration <= 0) {
      alert("O horário de término deve ser após o horário de início.");
      return;
    }
  
    // Obtém o usuário autenticado
    const { data: session, error } = await supabase.auth.getSession();
    if (error || !session?.session?.user) {
      alert("Usuário não autenticado!");
      return;
    }
  
    const userId = session.session.user.id;
  
    const sleepData = {
      type: "sleep",
      start,
      end,
      duration,
      observation,
      user_id: userId,
      data: new Date().toISOString(),
      timestamp: new Date().toISOString()
    };
  
    // Salva a entrada no Supabase
    const { result, saveError } = await saveEntry("sleep", sleepData, userId);
    if (saveError) {
      alert("Erro ao salvar entrada de sono. Tente novamente.");
      return;
    }
  
    onSubmit("sleep", sleepData); // Adiciona ao histórico
    setStart("");
    setEnd("");
    setObservation("");
  };  
  

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Adicionar Sono
      </Typography>

      <Box mb={2}>
        <Typography variant="body1">Horário de Início:</Typography>
        <TextField
          type="time"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          fullWidth
        />
      </Box>

      <Box mb={2}>
        <Typography variant="body1">Horário de Término:</Typography>
        <TextField
          type="time"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          fullWidth
        />
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

      <Button variant="contained" color="success" onClick={handleFormSubmit} style={{marginBottom: "15px", fontWeight: "bold", width: "100%"}}>
        Salvar
      </Button>
    </Box>
  );
};

export default Sleep;
