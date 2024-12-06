import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Button, Select, MenuItem, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import AuthContext from '../contexts/AuthContext';
import i18n from '../i18n'; 
import { useTranslation } from 'react-i18next'; // Hook para tradução

const languageOptions = [
  { value: 'en', label: 'English', icon: '🇺🇸' },
  { value: 'pt', label: 'Português', icon: '🇧🇷' },
  { value: 'es', label: 'Español', icon: '🇪🇸' },
];

const Settings = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // Verifica se o usuário está logado
  const { t, i18n } = useTranslation(); // Faz a obtenção das funções tradutoras
  const [language, setLanguage] = useState(i18n.language); // Idioma atual

  // Carrega o idioma salvo no LocalStorage ao inicializar
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      setLanguage(savedLanguage);
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  const handleConfirm = () => {
    i18n.changeLanguage(language);
    localStorage.setItem('language', language); // Salva o idioma no LocalStorage
    navigate(user ? '/home' : '/'); // Redireciona para Home se logado, Login se não
  };

  const handleCancel = () => {
    navigate(user ? '/home' : '/'); // Redireciona para Home ou Login
  };

  return (
    <Container>
      <Box mt={4} textAlign="center">
        <Typography variant="h4">{t('settings')}</Typography>
        <Box mt={4}>
          <Typography variant="h6">{t('select_language')}</Typography>
          <Select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            fullWidth
            displayEmpty
          >
            {languageOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <ListItem>
                  <ListItemIcon>{option.icon}</ListItemIcon>
                  <ListItemText>{option.label}</ListItemText>
                </ListItem>
              </MenuItem>
            ))}
          </Select>
        </Box>
        <Box mt={4} display="flex" justifyContent="space-between">
          <Button variant="contained" color="primary" onClick={handleConfirm}>
          {t('confirm')}
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleCancel}>
          {t('cancel')}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Settings;
