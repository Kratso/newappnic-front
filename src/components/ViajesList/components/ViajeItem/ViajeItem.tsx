import { Button, Card, CardActions, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import { Viaje } from "../../../../slices/viajes.slice";
import CardContent from "@mui/material/CardContent";
import {Unstable_DateField as DateField} from "@mui/x-date-pickers/DateField";
import { useNavigate } from "react-router-dom";

interface IProps {
  viaje: Viaje;
}

export const ViajeItem: React.FC<IProps> = ({ viaje }) => {
  const { _id, start_date, end_date, destino, participantes } = viaje;
  const navigate = useNavigate();
  return (
    <Card variant="outlined" sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {destino}
        </Typography>
        <div className="dates">
        <DateField label="fecha de incio" value={start_date} disabled />
        <DateField label="fecha de fin" value={end_date} disabled />
        </div>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          Participantes
        </Typography>
        {participantes.map(participante => {
            console.log("::::::::::::::", participante)
            return (
            <Typography variant="body2">
                {(participante as any).name}
          </Typography>
        )})}
        <CardActions>
          <Button onClick={()=>navigate(`/viaje/${_id}`)} size="small">Más Detalles</Button>
        </CardActions>
      </CardContent>
    </Card>
  );
};
