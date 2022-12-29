import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  Fab,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  MenuItem,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAccessToken, User } from "../../slices/login.slice";
import { selectUsers } from "../../slices/users.slice";
import { Add } from "@mui/icons-material";

import "dayjs/locale/en-gb";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AppDispatch, RootState } from "../../store/store";
import { Viaje, viajeCreate, viajeUpdate } from "../../slices/viajes.slice";
import Select from "@mui/material/Select";
import viajesService from "../../services/viajes.service";

interface ViajeFormProps {
  variant?: "text" | "outlined" | "contained";
  fab?: boolean;
  _id?: string;
  destinoProps?: string;
  startDateProps?: Date;
  endDateProps?: Date;
  contableProps?: string;
  participantesProps?: any[];
  conceptos?: any[];
  update?: boolean;
}

const ViajeFormDialog: React.FC<ViajeFormProps> = ({
  variant = "outlined",
  _id = "",
  destinoProps = "",
  startDateProps = new Date(),
  endDateProps = new Date(),
  participantesProps = [],
  contableProps = "",
  conceptos = [],
  update = false,
  fab = false,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const access_token = useSelector((state: RootState) =>
    selectAccessToken(state)
  );
  const usuarios = useSelector(selectUsers);

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClickClose = () => {
    setOpen(false);
  };

  const [destino, setDestino] = React.useState(destinoProps);
  const [startDate, setStartDate] = React.useState(startDateProps);
  const [endDate, setEndDate] = React.useState(endDateProps);
  const [contable, setContable] = React.useState(contableProps);
  const [participantes, setParticipantes] = React.useState(participantesProps);
  const [checked, setChecked] = React.useState<any[]>(
    participantesProps.map((p: User) => p._id)
  );

  const handleCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    let updatedList: any[] = [...checked];
    if (event.target.checked) {
      updatedList = [...checked, event.target.value];
    } else {
      updatedList.splice(checked.indexOf(event.target.value), 1);
    }
    setChecked(updatedList);
    setParticipantes(
      usuarios?.filter((u) => updatedList.includes(u._id)) ?? []
    );
  };

  const viaje = {
    _id: update ? _id : undefined,
    destino,
    start_date: startDate,
    end_date: endDate,
    participantes,
    conceptos,
    contable: usuarios?.filter((u) => u._id === contable)[0],
  };

  const handleUpdate = async () => {
    if (destino && startDate && endDate && participantes && conceptos) {
      dispatch(viajeUpdate(await viajesService.updateViaje(viaje as Viaje, access_token ?? "")));
      handleClickClose();
    }
  };

  const handleCreate = () => {
    if (destino && startDate && endDate && participantes && conceptos) {
      dispatch(viajeCreate({ viaje, access_token: access_token ?? "" }));
      handleClickClose();
    }
  };

  return (
    <>
      {fab ? (
        <Fab
          sx={{ position: "fixed", bottom: "2rem", right: "2rem" }}
          color="primary"
          onClick={handleClickOpen}
        >
          <Add />
        </Fab>
      ) : (
        <Button variant={variant} color="primary" onClick={handleClickOpen}>
          Editar
        </Button>
      )}
      <Dialog open={open} onClose={handleClickClose}>
        <DialogTitle>{update ? "Editar" : "Crear"} Viaje</DialogTitle>
        <DialogContent
          sx={{
            padding: "2rem",
            paddingTop: "1rem!important",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <FormControl>
            <TextField
              label="Destino"
              id="destino"
              value={destino}
              onChange={(e) => setDestino(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <LocalizationProvider dateAdapter={AdapterDayjs} locale="en-gb">
              <DatePicker
                label="Fecha de inicio"
                value={startDate}
                onChange={(newValue: any) => {
                  const date = newValue.add(13, "hour");
                  setStartDate(date ?? new Date());
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </FormControl>
          <FormControl>
            <LocalizationProvider dateAdapter={AdapterDayjs} locale="en-gb">
              <DatePicker
                label="Fecha de fin"
                value={endDate}
                minDate={startDate}
                onChange={(newValue: any) => {
                  const date = newValue.add(13, "hour");
                  setEndDate(date ?? new Date());
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </FormControl>
          <FormControl>
            <Select
              value={contable}
              onChange={(e) => setContable(e.target.value)}
            >
              <MenuItem key={0} value="contable">Contable</MenuItem>
              {checked.map((id) => {
                const user = usuarios?.find((u) => u._id === id);
                return <MenuItem key={user?._id} value={user?._id}>{user?.name}</MenuItem>;
              })}
            </Select>
          </FormControl>
          <FormControl
            component="fieldset"
            variant="standard"
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            }}
          >
            <FormLabel component="legend">Participantes</FormLabel>
            <FormGroup>
              {usuarios?.map((user: User) => {
                return (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checked.indexOf(user._id) !== -1}
                        onChange={handleCheck}
                        value={user._id}
                        color="primary"
                      />
                    }
                    label={user.name}
                  />
                );
              })}
            </FormGroup>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            onClick={update ? handleUpdate : handleCreate}
          >
            {update ? "Actualizar" : "Subir"}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ViajeFormDialog;
