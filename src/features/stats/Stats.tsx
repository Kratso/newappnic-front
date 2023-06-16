import {
  Grid,
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Card,
  CardHeader,
  CardContent,
} from "@mui/material";
import Container from "@mui/material/Container";
import Select from "@mui/material/Select";
import React from "react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getAmountOwed } from "../../helpers/getOwedAmount";
import { getPrecioTotal } from "../../helpers/getViajeTotals";
import conceptosService from "../../services/concepto.service";
import { selectAccessToken, selectUser, User } from "../../slices/login.slice";
import { selectAllViajes } from "../../slices/viajes.slice";
import { RootState } from "../../store/store";

const Stats = () => {
  const user = useSelector((state: RootState) => selectUser(state));
  const viajes = useSelector((state: RootState) => selectAllViajes(state));
  const access_token = useSelector((state: RootState) =>
    selectAccessToken(state)
  );

  const [selectedViaje, setSelectedViaje] = useState<any>("");

  const [conceptos, setConceptos] = React.useState<any[]>([]);

  const [conceptosPorDivisa, setConceptosPorDivisa] = React.useState<any[]>([]);

  const fetchConceptos = async () => {
    let response;

    if (selectedViaje)
      response = await conceptosService.fetchConceptosFromId(
        selectedViaje ?? "",
        access_token ?? ""
      );
    setConceptos(response ? response.conceptos : []);
  };

  useEffect(() => {
    fetchConceptos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [access_token, selectedViaje]);
  
  useEffect(() => {
    if (conceptos.length > 0) {
      const conceptosPorDivisa = conceptos.reduce((acc: any, concepto: any) => {
        const divisa = concepto.divisa;
        if (acc[divisa]) {
          acc[divisa] = [...acc[divisa], concepto];
        } else {
          acc[divisa] = [concepto];
        }
        return acc;
      }, {});
      setConceptosPorDivisa(conceptosPorDivisa);
    }
  }, [conceptos]);


  return (
    <>
      <Container>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h1" style={{ color: "rgba(255,211,232,0.8)" }}>
              Estadísticas
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Card
              sx={{
                width: "fit-content",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <CardHeader title="Deuda Específica Personal" />
              <CardContent>
                <Grid item xs={12}>
                  <Select
                    native
                    value={selectedViaje}
                    onChange={(e) => setSelectedViaje(e.target.value)}
                  >
                    <option value={""}></option>
                    {viajes.map((viaje) => (
                      <option key={viaje._id} value={viaje._id}>
                        {viaje.destino}
                      </option>
                    ))}
                  </Select>
                </Grid>
                <Grid item xs={12}>
                  <Grid item xs={12}>
                    <Typography variant="h6">Total a Deber</Typography>
                    {Object.entries(conceptosPorDivisa).map((divisa) => (
                    <Typography variant="body1">
                      {getAmountOwed(divisa[1], user?.user as User, selectedViaje?.contable?._id === user?.user?._id).toFixed(2)}{" "}
                      {divisa[0]}
                    </Typography>
                    ))}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          {/* <Grid item xs={12}>
            <Grid container spacing={3}>
              {viajes.map((viaje) => (
                <Grid item xs={12} md={6} lg={4}>
                  <Card
                    sx={{
                      width: "fit-content",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <CardHeader title={viaje.destino} />
                    <CardContent>
                      <Grid item xs={12}>
                        <Typography variant="h6">
                          Número de Participantes
                        </Typography>
                        <Typography variant="body1">
                          {viaje.participantes.length}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="h6">Precio total</Typography>
                        <Typography variant="body1">
                          {getPrecioTotal(co)} €
                        </Typography>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid> */}
        </Grid>
      </Container>
    </>
  );
};

export default Stats;
