import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton, Tooltip } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';

const SettingsButton = () => {
  const navigate = useNavigate();

  return (
    <Tooltip title="Configurações">
      <IconButton onClick={() => navigate('/settings')} color="error" size='50'>
        <SettingsIcon />
      </IconButton>
    </Tooltip>
  );
};

export default SettingsButton;