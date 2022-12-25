import { Card, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import { Viaje } from "../../../../slices/viajes.slice";
import CardContent from "@mui/material/CardContent";
import {Unstable_DateField as DateField} from "@mui/x-date-pickers/DateField";

interface IProps {
  viaje: Viaje;
}

export const ViajeItem: React.FC<IProps> = ({ viaje }) => {
  const { start_date, end_date, destino, participantes, conceptos } = viaje;
  console.log(
    "A",
    start_date,
    "B",
    end_date,
    "C",
    destino,
    "D",
    participantes,
    "E",
    conceptos
  );
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
      </CardContent>
    </Card>
  );
};
