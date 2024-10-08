import React, { useEffect } from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { MainListItems, secondaryListItems } from './listItems';
import {
  mainColor,
  secondaryColor,
  textColor,
} from '../login/Login';
import { Route, Routes } from 'react-router';
import ViajesList from '../../components/ViajesList/ViajesList';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import viajesService from '../../services/viajes.service';
import { setViajes } from '../../slices/viajes.slice';
import { selectAccessToken } from '../../slices/login.slice';
import { useSelector } from 'react-redux/es/hooks/useSelector';
import { RootState } from '../../store/store';
import ViajeDetail from '../../components/ViajeDetail/ViajeDetail';
import userService from '../../services/user.service';
import { setUsers } from '../../slices/users.slice';
import ConceptoForm from '../../components/ConceptoForm/ConceptoForm';
import ErrorView from '../../app/error/ErrorView';
import Stats from '../stats/Stats';
import Perfil from '../perfil/Perfil';

const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  backgroundColor: secondaryColor,
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    backgroundColor: '#111b21',
    boxSizing: 'border-box',
    ...(!open && {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const mdTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#49b1d7',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#111b21',
      paper: '#111b21',
    },
    text: {
      primary: '#aebacc',
    },
  },
});

function DashboardContent() {
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position='absolute' open={open}>
          <Toolbar
            sx={{
              pr: '24px', // keep right padding when drawer closed
              color: textColor,
            }}
          >
            <IconButton
              edge='start'
              color='inherit'
              aria-label='open drawer'
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component='h1'
              variant='h6'
              color='inherit'
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Dashboard
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer variant='permanent' open={open} sx={{
          backgroundColor: '#111b21',
        }}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              backgroundColor: '#202629',
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component='nav'>
            <MainListItems />
            <Divider sx={{ my: 1 }} />
            {secondaryListItems}
          </List>
        </Drawer>
        <Box
          component='main'
          sx={{
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              <Routes>
                <Route path='/' element={<ViajesList />} />
                <Route path='/viaje/:_id' element={<ViajeDetail />} />
                <Route path='/concepto' element={<ConceptoForm />} />
                <Route path='/stats' element={<Stats />} />
                <Route path='/perfil' element={<Perfil />} />
¡              </Routes>
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();

  const accessToken = useSelector((state: RootState) =>
    selectAccessToken(state)
  );

  useEffect(() => {
    const fetchData = async () => {
      const viajes = await viajesService.fetchViajes(accessToken ?? '');
      const usuarios = await userService.getAllUsers(accessToken ?? '');

      dispatch(setViajes(viajes.viajes));
      dispatch(setUsers(usuarios.data.users));
    };
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  return <DashboardContent />;
}
