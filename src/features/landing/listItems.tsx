import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import FlightIcon from '@mui/icons-material/Flight';
import DescriptionIcon from '@mui/icons-material/Description';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import BarChartIcon from '@mui/icons-material/BarChart';

import { useNavigate } from 'react-router-dom';

export const MainListItems: React.FC = () => {
  const navigate = useNavigate();
  return (
    <React.Fragment>
      <ListItemButton onClick={() => navigate('/')}>
        <ListItemIcon>
          <FlightIcon
            sx={{
              color: 'var(--color-primary)',
            }}
          />
        </ListItemIcon>
        <ListItemText primary='Viajes' />
      </ListItemButton>
      <ListItemButton onClick={() => navigate('/concepto')}>
        <ListItemIcon>
          <DescriptionIcon
            sx={{
              color: 'var(--color-primary)',
            }}
          />
        </ListItemIcon>
        <ListItemText primary='Subir Concepto' />
      </ListItemButton>
      <ListItemButton onClick={() => navigate('/stats')}>
        <ListItemIcon>
          <BarChartIcon
            sx={{
              color: 'var(--color-primary)',
            }}
          />
        </ListItemIcon>
        <ListItemText primary='Ver Estadísticas' />
      </ListItemButton>
      <ListItemButton onClick={() => navigate('/perfil')}>
        <ListItemIcon>
          <AccountBoxIcon
            sx={{
              color: 'var(--color-primary)',
            }}
          />
        </ListItemIcon>
        <ListItemText primary='Perfil' />
      </ListItemButton>
    </React.Fragment>
  );
};

export const secondaryListItems = <React.Fragment></React.Fragment>;
