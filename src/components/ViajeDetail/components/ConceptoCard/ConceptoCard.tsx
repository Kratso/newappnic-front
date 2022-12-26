// React component that takes a Concepto and renders it as a card named ConceptoCard.tsx
// Concepto has a titulo, a fecha, number of unidades, a precio and some participantes
// ConceptoCard.tsx
import { Card, CardContent, CardHeader, Grid, Typography } from "@mui/material";
import React from "react";
import { Concepto } from '../../../../slices/concepto.slice';
import { User } from "../../../../slices/login.slice";

const ConceptoCard = ({ concepto }: { concepto: Concepto }) => {
  return (
    <Card sx={{
        width: '100%',
        maxWidth: 500,
    }}>
      <CardHeader title={concepto.titulo} />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body2">Fecha</Typography>
            <Typography variant="body1">{new Date(concepto.fecha.toString()).toLocaleDateString()}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2">Unidades</Typography>
            <Typography variant="body1">{concepto.unidades}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2">Precio por unidad</Typography>
            <Typography variant="body1">{concepto.precio.toFixed(2)} €</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2">Participantes</Typography>
                {
                    concepto.participantes.map((participante, i) => {
                        return <Typography key={i} variant="body1">{(participante as any).usuario.name}</Typography>
                    })
                }
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2">Precio por persona</Typography>
            <Typography variant="body1">{((concepto.precio * concepto.unidades) / concepto.participantes.length).toFixed(2)} €</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2">Precio total</Typography>
            <Typography variant="body1">{(concepto.precio * concepto.unidades).toFixed(2)} €</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};


export default ConceptoCard;
