import {
  Box,
  Button,
  Checkbox,
  Container,
  Fab,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { Unstable_DateField as DateField } from '@mui/x-date-pickers/DateField';
import Navigation from '@mui/icons-material/Navigation';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAllViajes } from '../../slices/viajes.slice';
import { AppDispatch, RootState } from '../../store/store';
import { selectAccessToken, selectUser, User } from '../../slices/login.slice';
import { createConcepto, updateConcepto } from '../../slices/concepto.slice';
import { Divisas } from '../../constants';

const ConceptoForm = ({
  isUpdate = false,
  propsTitulo = '',
  propsFecha = new Date(),
  propsPagador = '',
  propsUnidad = 0,
  propsPrecio = 0,
  propsViaje = '',
  propsChecked = [],
  propsDivisa = '',
  _id = '',
  propsCategoria = '',
  propsParticipantes = [],
  onSubmitCallback = () => {},
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => selectUser(state));

  const viajes = useSelector((state: RootState) =>
    selectAllViajes(state)
  ).filter(
    (v) =>
      (v.participantes as any).filter((p: User) => p._id === user.user?._id)
        .length > 0 || user.user?.role === 'admin'
  );
  const access_token = useSelector((state: RootState) =>
    selectAccessToken(state)
  );

  const [titulo, setTitulo] = React.useState(propsTitulo);
  const [fecha, setFecha] = React.useState(propsFecha);
  const [pagador, setPagador] = React.useState(propsPagador);
  const [unidades, setUnidades] = React.useState(propsUnidad);
  const [precio, setPrecio] = React.useState(propsPrecio);
  const [viaje, setViaje] = React.useState(propsViaje);
  const [participantes, setParticipantes] = React.useState<[]>(
    propsParticipantes as any
  );
  const [checked, setChecked] = React.useState<any[]>(propsChecked);
  const [categoria, setCategoria] = React.useState(propsCategoria);
  const [divisa, setDivisa] = React.useState(propsDivisa);

  const handleCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    let updatedList: any[] = [...checked];
    if (event.target.checked) {
      updatedList = [...checked, event.target.value];
    } else {
      updatedList.splice(checked.indexOf(event.target.value), 1);
    }
    setChecked(updatedList);
  };

  const [selectedViaje, setSelectedViaje] = React.useState<any>({
    participantes: [],
  });

  const resetForm = () => {
    setTitulo('');
    setFecha(new Date());
    setPagador('');
    setUnidades(0);
    setPrecio(0);
    setViaje('');
    setChecked([]);
  };

  useEffect(() => {
    const selectedViaje = viajes.filter((v) => v._id === viaje)[0];
    setParticipantes(
      isUpdate
        ? propsParticipantes
        : (selectedViaje?.participantes as any) ?? []
    );
    setSelectedViaje(selectedViaje ?? { participantes: [] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viaje]);

  const handleFormInput = () => {
    if (
      titulo === '' ||
      fecha === null ||
      pagador === '' ||
      unidades === 0 ||
      precio === 0 ||
      viaje === '' ||
      checked.length === 0
    ) {
      alert('Rellena todos los campos');
      return;
    }

    const concepto = {
      _id: _id ? _id : undefined,
      titulo,
      fecha,
      pagador,
      unidades,
      precio,
      viaje,
      categoria,
      divisa,
      participantes: isUpdate
        ? participantes.map((p: any) => ({
            usuario: p,
            pagado: checked.includes(p._id),
          }))
        : participantes
            .filter((usuario: any) => checked.includes(usuario._id))
            .map((usuario: any) => ({ usuario, pagado: false })),
    };
    isUpdate
      ? dispatch(
          updateConcepto({
            concepto: concepto as any,
            access_token: access_token ?? '',
          })
        )
      : dispatch(
          createConcepto({
            concepto: concepto as any,
            access_token: access_token ?? '',
          })
        );

    resetForm();
    onSubmitCallback();
  };

  return (
    <>
      <Container
        sx={{
          margin: 'auto',
        }}
      >
        {isUpdate ? (
          <></>
        ) : (
          <Typography
            variant='h2'
            gutterBottom
            component='div'
            sx={{
              color: 'var(--color-text)',
            }}
          >
            {' '}
            Subir un Concepto{' '}
          </Typography>
        )}
      </Container>
      <Container>
        <Grid
          container
          justifyContent='center'
          alignItems='center'
          sx={{
            width: '60%',
            height: '100%',
            borderRadius: '20px',
            margin: 'auto',
            marginTop: '2rem',
            backgroundColor: 'var(--color-bg-card)',
            padding: '2rem',
          }}
        >
          <Grid>
            <Grid
              item
              container
              justifyContent='space-between'
              rowSpacing={3}
              sx={{
                maxWidth: { sm: '45rem' },
                marginInline: 'auto',
                gap: '4rem',
              }}
            >
              <FormControl>
                <TextField
                  label='Título'
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  variant='standard'
                  sx={{
                    width: '100%',
                    minWidth: '12rem',
                  }}
                />
              </FormControl>

              <FormControl>
                <DateField
                  label='Fecha'
                  value={fecha}
                  onChange={(newValue) => setFecha(newValue ?? new Date())}
                  format='DD/MM/YYYY'
                  sx={{
                    width: '100%',
                    minWidth: '12rem',
                  }}
                />
              </FormControl>
              <FormControl>
                <InputLabel id='viaje-label'>Viaje</InputLabel>
                <Select
                  labelId='viaje-label'
                  label='Viaje'
                  value={viaje}
                  disabled={isUpdate}
                  onChange={(e) => setViaje(e.target.value as string)}
                  sx={{
                    width: '100%',
                    minWidth: '12rem',
                  }}
                >
                  <MenuItem value=''></MenuItem>
                  {viajes?.map((viaje) => (
                    <MenuItem key={viaje._id} value={viaje._id}>
                      {viaje.destino}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <InputLabel id='categoria-label'>Categoria</InputLabel>
                <Select
                  labelId='categoria-label'
                  label='Categoria'
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value as string)}
                  sx={{
                    width: '100%',
                    minWidth: '12rem',
                  }}
                >
                  <MenuItem value=''></MenuItem>
                  {['', 'comida', 'transporte', 'alojamiento', 'otros'].map(
                    (categoria) => (
                      <MenuItem key={categoria} value={categoria}>
                        {categoria}
                      </MenuItem>
                    )
                  )}
                </Select>
              </FormControl>
              <FormControl>
                <InputLabel id='divisa-label'>Divisa</InputLabel>
                <Select
                  labelId='divisa-label'
                  label='Divisa'
                  value={divisa}
                  onChange={(e) => setDivisa(e.target.value as string)}
                  sx={{
                    width: '100%',
                    minWidth: '12rem',
                  }}
                >
                  <MenuItem value=''></MenuItem>
                  {Divisas.map((divisa) => (
                    <MenuItem key={divisa} value={divisa}>
                      {divisa}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <InputLabel id='pagador-label'>Pagador</InputLabel>
                <Select
                  labelId='pagador-label'
                  label='Pagador'
                  value={pagador}
                  disabled={isUpdate}
                  onChange={(e) => setPagador(e.target.value as string)}
                  sx={{
                    width: '100%',
                    minWidth: '12rem',
                  }}
                >
                  <MenuItem value=''></MenuItem>
                  {selectedViaje.participantes?.map((usuario: User) => (
                    <MenuItem key={usuario._id} value={usuario._id}>
                      {usuario.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <TextField
                  label='Unidades'
                  type={'number'}
                  value={unidades}
                  onChange={(e) => setUnidades(Number(e.target.value))}
                  variant='standard'
                  sx={{
                    width: '100%',
                    minWidth: '12rem',
                  }}
                />
              </FormControl>
              <FormControl>
                <TextField
                  label='Precio por unidad'
                  type={'number'}
                  value={precio}
                  variant='standard'
                  onChange={(e) => setPrecio(Number(e.target.value))}
                  InputProps={{
                    startAdornment: <span>{divisa}</span>,
                  }}
                  sx={{
                    width: '100%',
                    minWidth: '12rem',
                  }}
                />
              </FormControl>
              <FormControl component='fieldset' variant='standard'>
                <FormLabel component='legend'>Participantes</FormLabel>
                <FormGroup>
                  {(isUpdate
                    ? propsParticipantes
                    : selectedViaje.participantes
                  )?.map((_: any) => {
                    return (
                      <FormControlLabel
                        control={
                          <Checkbox value={_._id} onChange={handleCheck} />
                        }
                        label={_.name}
                      />
                    );
                  })}
                </FormGroup>
              </FormControl>
              {isUpdate ? (
                <FormControl>
                  <Button
                    variant='contained'
                    onClick={handleFormInput}
                    sx={{
                      width: '100%',
                      minWidth: '12rem',
                    }}
                  >
                    Actualizar
                  </Button>
                </FormControl>
              ) : (
                <></>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Container>
      {isUpdate ? (
        <></>
      ) : (
        <Box sx={{ '& > :not(style)': { m: 1 } }}>
          <Fab
            variant='extended'
            sx={{
              position: 'fixed',
              bottom: (theme) => theme.spacing(4),
              right: (theme) => theme.spacing(4),
              backgroundColor: 'var(--color-primary)',
            }}
            onClick={handleFormInput}
          >
            <Navigation sx={{ mr: 1 }} />
            Enviar
          </Fab>
        </Box>
      )}
    </>
  );
};

export default ConceptoForm;
