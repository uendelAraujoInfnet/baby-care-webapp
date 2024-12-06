import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { createUser } from '../services/supabaseClient';
import { saveToLocalStorage } from '../utils/localStorage';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!username || !password) {
      alert('Por favor, preencha todos os campos.');
      return;
    }
  
    try {
      const { data, error } = await createUser(username, password);
  
      if (error) {
        console.error('Erro ao cadastrar usuário:', error);
        alert('Erro ao cadastrar usuário! Tente novamente.');
        return;
      }
  
      if (data && data.length > 0) {
        alert('Usuário cadastrado com sucesso!');
        saveToLocalStorage('user', data[0]);
        navigate('/'); // Redireciona para a página de login
      } else {
        console.error('Resposta inesperada do Supabase:', data);
        alert('Houve um problema ao cadastrar o usuário.');
      }
    } catch (err) {
      console.error('Erro ao processar o cadastro:', err);
      alert('Erro inesperado! Tente novamente.');
    }
  };  

  return (
    <Container maxWidth="xs">
      <Box mt={10} display="flex" flexDirection="column" alignItems="center">
        <Typography variant="h5">Cadastro</Typography>
        <TextField
          fullWidth
          margin="normal"
          label="Usuário"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          type="password"
          label="Senha"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained" color="primary" fullWidth onClick={handleRegister}>
          Cadastrar
        </Button>
      </Box>
    </Container>
  );
};

export default Register;