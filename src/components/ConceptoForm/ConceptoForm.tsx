import {
  Box,
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
} from "@mui/material";
import { Unstable_DateField as DateField } from "@mui/x-date-pickers/DateField";
import Navigation from "@mui/icons-material/Navigation";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAllViajes } from "../../slices/viajes.slice";
import { AppDispatch, RootState } from "../../store/store";
import { selectAccessToken, User } from "../../slices/login.slice";
import { createConcepto } from "../../slices/concepto.slice";

const ConceptoForm = ({propsTitulo='', propsFecha=new Date(), propsPagador='', propsUnidad=0, propsPrecio=0,propsViaje='',propsChecked=[]}) => {
  const dispatch = useDispatch<AppDispatch>();

  const viajes = useSelector((state: RootState) => selectAllViajes(state));
  const access_token = useSelector((state: RootState) =>
    selectAccessToken(state)
  );

  const [titulo, setTitulo] = React.useState(propsTitulo);
  const [fecha, setFecha] = React.useState(propsFecha);
  const [pagador, setPagador] = React.useState(propsPagador);
  const [unidades, setUnidades] = React.useState(propsUnidad);
  const [precio, setPrecio] = React.useState(propsPrecio);
  const [viaje, setViaje] = React.useState( propsViaje);
  const [participantes, setParticipantes] = React.useState<[]>([]);
  const [checked, setChecked] = React.useState<any[]>(propsChecked);

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

  useEffect(() => {
    const selectedViaje = viajes.filter((v) => v._id === viaje)[0];
    setParticipantes((selectedViaje?.participantes as any) ?? []);
    setSelectedViaje(selectedViaje ?? { participantes: [] });
  }, [viaje]);

  const handleFormInput = () => {
    if (
      titulo === "" ||
      fecha === null ||
      pagador === "" ||
      unidades === 0 ||
      precio === 0 ||
      viaje === "" ||
      checked.length === 0
    ) {
      alert("Rellena todos los campos");
      return;
    }
    const concepto = {
      titulo,
      fecha,
      pagador,
      unidades,
      precio,
      viaje,
      participantes: participantes.filter((usuario: any) =>
        checked.includes(usuario._id)
      ).map((usuario: any) => ({usuario, pagado: false})),
    };

    dispatch(createConcepto({concepto, access_token: access_token ?? ''}));
  };

  return (
    <>
      <Container
        sx={{
          margin: "auto",
        }}
      >
        <Typography
          variant="h2"
          gutterBottom
          component="div"
          sx={{
            color: "rgba(255,211,232,0.8)",
          }}
        >
          {" "}
          Subir un Concepto{" "}
        </Typography>
      </Container>
      <Container>
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          sx={{
            width: "60%",
            height: "100%",
            borderRadius: "20px",
            margin: "auto",
            marginTop: "2rem",
            backgroundColor: "rgba(255,211,232,0.8)",
            padding: "2rem",
          }}
        >
          <Grid>
            <Grid
              item
              container
              justifyContent="space-between"
              rowSpacing={3}
              sx={{
                maxWidth: { sm: "45rem" },
                marginInline: "auto",
                gap: "4rem",
              }}
            >
              <FormControl>
                <TextField
                  label="Título"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  variant="standard"
                  sx={{
                    width: "100%",
                    minWidth: "12rem",
                  }}
                />
              </FormControl>

              <FormControl>
                <DateField
                  label="Fecha"
                  value={fecha}
                  onChange={(newValue) => setFecha(newValue ?? new Date())}
                  sx={{
                    width: "100%",
                    minWidth: "12rem",
                  }}
                />
              </FormControl>
              <FormControl>
                <InputLabel id="viaje-label">Viaje</InputLabel>
                <Select
                  labelId="viaje-label"
                  label="Viaje"
                  value={viaje}
                  onChange={(e) => setViaje(e.target.value as string)}
                  sx={{
                    width: "100%",
                    minWidth: "12rem",
                  }}
                >
                  <MenuItem value=""></MenuItem>
                  {viajes?.map((viaje) => (
                    <MenuItem key={viaje._id} value={viaje._id}>
                      {viaje.destino}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <InputLabel id="pagador-label">Pagador</InputLabel>
                <Select
                  labelId="pagador-label"
                  label="Pagador"
                  value={pagador}
                  onChange={(e) => setPagador(e.target.value as string)}
                  sx={{
                    width: "100%",
                    minWidth: "12rem",
                  }}
                >
                  <MenuItem value=""></MenuItem>
                  {selectedViaje.participantes?.map((usuario: User) => (
                    <MenuItem key={usuario._id} value={usuario._id}>
                      {usuario.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <TextField
                  label="Unidades"
                  type={"number"}
                  value={unidades}
                  onChange={(e) => setUnidades(Number(e.target.value))}
                  variant="standard"
                  sx={{
                    width: "100%",
                    minWidth: "12rem",
                  }}
                />
              </FormControl>
              <FormControl>
                <TextField
                  label="Precio"
                  type={"number"}
                  value={precio}
                  variant="standard"
                  onChange={(e) => setPrecio(Number(e.target.value))}
                  InputProps={{
                    startAdornment: <span>€</span>,
                  }}
                  sx={{
                    width: "100%",
                    minWidth: "12rem",
                  }}
                />
              </FormControl>
              <FormControl component="fieldset" variant="standard">
                <FormLabel component="legend">Participantes</FormLabel>
                <FormGroup>
                  {participantes?.map((_: any, i) => {
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
            </Grid>
          </Grid>
        </Grid>
      </Container>
      <Box sx={{ "& > :not(style)": { m: 1 } }}>
        <Fab
          variant="extended"
          sx={{
            position: "fixed",
            bottom: (theme) => theme.spacing(4),
            right: (theme) => theme.spacing(4),
          }}
          onClick={handleFormInput}
        >
          <Navigation sx={{ mr: 1 }} />
          Enviar
        </Fab>
      </Box>
    </>
  );
};

export default ConceptoForm;
