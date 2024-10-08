import {
  Button,
  Card,
  CardActions,
  CardHeader,
  Grid,
  Typography,
} from "@mui/material";
import React from "react";
import { Viaje } from "../../../../slices/viajes.slice";
import CardContent from "@mui/material/CardContent";
import { Unstable_DateField as DateField } from "@mui/x-date-pickers/DateField";
import { useNavigate } from "react-router-dom";
import ViajeFormDialog from "../../../ViajeForm/ViajeForm";
import { useSelector } from "react-redux";
import { selectUserRole } from "../../../../slices/login.slice";
import { CountDown } from "./CountDown/CountDown";

interface IProps {
  viaje: Viaje;
}

export const ViajeItem: React.FC<IProps> = ({ viaje }) => {
  const {
    _id,
    start_date,
    end_date,
    destino,
    participantes,
    conceptos,
    contable,
    timers,
  } = viaje;
  const navigate = useNavigate();
  const role = useSelector(selectUserRole);
  return (
    <Card
      variant="outlined"
      sx={{ minWidth: 275, backgroundColor: "var(--color-bg-card)" }}
    >
      <CardHeader title={destino} />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" component="div">
              Contable
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {contable ? contable.name : "😶‍🌫️😶‍🌫️😶‍🌫️"}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" component="div">
              Fechas
            </Typography>
            <div
              className="dates"
              style={{
                padding: 4,
                display: "flex",
                flexDirection: "row",
                gap: 4,
              }}
            >
              <DateField label="fecha de incio" value={start_date} disabled />
              <DateField label="fecha de fin" value={end_date} disabled />
            </div>
          </Grid>
          <Grid item xs={12} sm={6}>
            {timers ? (
              timers.map(({ name, start_date, end_date }, i) => {
                return (
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 4 }}
                    key={`timer-${_id}-${i}`}
                  >
                    <Typography variant="h6" component="div">
                      {name}
                    </Typography>
                    <CountDown endDate={end_date} startDate={start_date} />
                  </div>
                );
              })
            ) : (
              <CountDown endDate={end_date} startDate={start_date} />
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              Participantes
            </Typography>
            {participantes.map((participante) => {
              return (
                <Typography variant="body2">
                  {(participante as any).name}
                </Typography>
              );
            })}
          </Grid>
        </Grid>
        <CardActions>
          <Button onClick={() => navigate(`/viaje/${_id}`)} size="small">
            Más Detalles
          </Button>
          {role === "admin" && (
            <ViajeFormDialog
              variant="text"
              update
              _id={_id ?? ""}
              destinoProps={destino}
              startDateProps={start_date}
              endDateProps={end_date}
              participantesProps={participantes}
              conceptos={conceptos}
            />
          )}
        </CardActions>
      </CardContent>
    </Card>
  );
};
