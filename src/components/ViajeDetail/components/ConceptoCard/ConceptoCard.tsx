// React component that takes a Concepto and renders it as a card named ConceptoCard.tsx
// Concepto has a titulo, a fecha, number of unidades, a precio and some participantes
// ConceptoCard.tsx
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  Typography,
} from "@mui/material";
import React from "react";
import { Concepto } from "../../../../slices/concepto.slice";
import ConceptoForm from "../../../ConceptoForm/ConceptoForm";
import FormDialog from "../../../FormDialog/FormDialog";

const ConceptoCard = ({
  concepto,
  onSubmitCallback,
}: {
  concepto: Concepto;
  onSubmitCallback: () => void;
}) => {

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClickClose = () => {
    setOpen(false);
  };

  const dialogOnSubmitCallback = () => {
    handleClickClose();
    onSubmitCallback();
  };

  return (
    <Card
      sx={{
        width: "100%",
        maxWidth: 500,
        margin: 2,
      }}
    >
      <CardHeader title={concepto.titulo} />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body2">Fecha</Typography>
            <Typography variant="body1">
              {new Date(concepto.fecha.toString()).toLocaleDateString("es-ES")}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2">Pagador</Typography>
            <Typography variant="body1">
              💰 {(concepto.pagador as any).name} 💰
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2">Unidades</Typography>
            <Typography variant="body1">{concepto.unidades}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2">Precio por unidad</Typography>
            <Typography variant="body1">
              {concepto.precio.toFixed(2)} €
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2">Participantes</Typography>
            {concepto.participantes.map((participante, i) => {
              return (
                <Typography key={i} variant="body1">
                  {(participante as any).pagado ||
                  (participante as any).usuario._id ===
                    (concepto.pagador as any)._id
                    ? "❤️"
                    : "💸"}{" "}
                  {(participante as any).usuario.name}
                </Typography>
              );
            })}
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2">Precio por persona</Typography>
            <Typography variant="body1">
              {(
                (concepto.precio * concepto.unidades) /
                concepto.participantes.length
              ).toFixed(2)}{" "}
              €
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2">Precio total</Typography>
            <Typography variant="body1">
              {(concepto.precio * concepto.unidades).toFixed(2)} €
            </Typography>
          </Grid>
        </Grid>
        <CardActions>
          <FormDialog
            buttonText="Actualizar"
            title="Actualizar Concepto"
            open={open}
            handleClose={handleClickClose}
            handleClickOpen={handleClickOpen}
          >
            <ConceptoForm
              onSubmitCallback={dialogOnSubmitCallback}
              isUpdate
              propsChecked={(concepto.participantes as any).filter(
                (p: any) => p.pagado
              )}
              _id={concepto._id}
              propsFecha={concepto.fecha}
              propsPagador={(concepto.pagador as any)._id}
              propsPrecio={concepto.precio}
              propsTitulo={concepto.titulo}
              propsUnidad={concepto.unidades}
              propsViaje={(concepto.viaje as any)._id}
            />
          </FormDialog>
        </CardActions>
      </CardContent>
    </Card>
  );
};

export default ConceptoCard;
