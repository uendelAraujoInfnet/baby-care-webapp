import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const [babyName, setBabyName] = useState('');
  const [weight, setWeight] = useState('');
  const [length, setLength] = useState('');
  const [language, setLanguage] = useState('pt');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <Container>
      <Box my={4}>
        <Typography variant="h5">Configurações</Typography>
        <TextField
          fullWidth
          margin="normal"
          label="Nome do Bebê"
          value={babyName}
          onChange={(e) => setBabyName(e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Peso do Bebê"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Comprimento do Bebê"
          value={length}
          onChange={(e) => setLength(e.target.value)}
        />
        <Select
          fullWidth
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <MenuItem value="pt">Português</MenuItem>
          <MenuItem value="en">Inglês</MenuItem>
          <MenuItem value="es">Espanhol</MenuItem>
        </Select>
        <Button variant="contained" color="secondary" fullWidth onClick={handleLogout}>
          Logout
        </Button>
      </Box>
    </Container>
  );
};

export default Settings;
