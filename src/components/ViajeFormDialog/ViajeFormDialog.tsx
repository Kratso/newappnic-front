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
import { viajeCreate, viajeUpdate } from "../../slices/viajes.slice";

interface ViajeFormProps {
  variant?: "text" | "outlined" | "contained";
  fab?: boolean;
  _id?: string;
  destinoProps?: string;
  startDateProps?: Date;
  endDateProps?: Date;
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
  };

  const handleUpdate = () => {
    if (destino && startDate && endDate && participantes && conceptos) {
      dispatch(viajeUpdate({ viaje, access_token: access_token ?? "" }));
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
        <DialogTitle>{update ? 'Editar' : 'Crear'} Viaje</DialogTitle>
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
