import React, { useContext, useState, useEffect } from 'react';
import {
  Typography,
  Container,
  Box,
  Card,
  CardContent,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import AuthContext from '../contexts/AuthContext';
import { syncData } from '../services/syncService';
import { addEntry } from '../services/supabaseClient';
import { saveToLocalStorage, getFromLocalStorage } from '../utils/localStorage';

const Home = () => {
  const { user } = useContext(AuthContext);
  const [entries, setEntries] = useState([]);
  const [babyInfo, setBabyInfo] = useState({
    name: 'Bebê',
    weight: '3kg',
    length: '50cm',
  });

  // Sincronização dos dados na inicialização
  useEffect(() => {
    const fetchEntries = async () => {
      const storedEntries = await syncData(user.id, 'babyEntries', 'entries');
      if (storedEntries) setEntries(storedEntries);

      // Carregar informações do bebê do LocalStorage
      const storedBabyInfo = getFromLocalStorage('babyInfo');
      if (storedBabyInfo) setBabyInfo(storedBabyInfo);
    };
    fetchEntries();
  }, [user]);

  const handleAddEntry = async (type, data) => {
    const newEntry = { type, ...data, timestamp: new Date().toISOString() };

    // Salvar no Supabase
    const { result, error } = await addEntry(type, data, user.id);
    if (error) {
      alert('Erro ao salvar entrada no Supabase!');
      return;
    }

    // Atualizar LocalStorage e estado
    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);
    saveToLocalStorage('babyEntries', updatedEntries);
  };

  return (
    <Container>
      <Box my={4}>
        <Typography variant="h4">Bem-vindo, {user.username}</Typography>
        <Typography variant="h6">
          Bebê: {babyInfo.name}, Peso: {babyInfo.weight}, Comprimento: {babyInfo.length}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Card Fralda */}
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h5">Fralda</Typography>
              <Button
                variant="contained"
                onClick={() =>
                  handleAddEntry('fralda', { status: 'Limpa', observation: 'Tudo ok!' })
                }
              >
                Adicionar Fralda
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Card Sono */}
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h5">Sono</Typography>
              <Button
                variant="contained"
                onClick={() =>
                  handleAddEntry('sono', { start: '22:00', end: '06:00', observation: '' })
                }
              >
                Adicionar Sono
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Card Amamentação */}
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h5">Amamentação</Typography>
              <Button
                variant="contained"
                onClick={() =>
                  handleAddEntry('amamentação', { method: 'Seio', observation: '20 min lado direito' })
                }
              >
                Adicionar Amamentação
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Lista de Entradas */}
      <Box mt={4}>
        <Typography variant="h5">Histórico</Typography>
        <List>
          {entries.map((entry, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={`${entry.type} - ${entry.timestamp}`}
                secondary={entry.observation || 'Sem observação'}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
};

export default Home;
