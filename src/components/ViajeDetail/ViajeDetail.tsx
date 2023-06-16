import { Card, CardContent, Container, Grid, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  getPrecioPerCapita,
  getPrecioPerDiem,
  getPrecioPerDiemPerCapita,
  getPrecioTotal,
} from '../../helpers/getViajeTotals';
import conceptosService from '../../services/concepto.service';
import { selectAccessToken } from '../../slices/login.slice';
import { selectViajeById, Viaje } from '../../slices/viajes.slice';
import { RootState } from '../../store/store';
import ConceptoCard from './components/ConceptoCard/ConceptoCard';

const ViajeDetail = () => {
  const { _id } = useParams();
  const access_token = useSelector((state: RootState) =>
    selectAccessToken(state)
  );
  const viaje = useSelector((state: RootState) =>
    selectViajeById(state, _id ?? '')
  );
  const [conceptos, setConceptos] = React.useState<any[]>([]);
  const [conceptosPorDivisa, setConceptosPorDivisa] = React.useState<any[]>([]);

  const fetchConceptos = async () => {
    const response = await conceptosService.fetchConceptosFromId(
      _id ?? '',
      access_token ?? ''
    );
    setConceptos(response.conceptos);
  };

  useEffect(() => {
    fetchConceptos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [access_token, _id]);

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
        <Grid>
          <h1
            style={{
              color: 'var(--color-text)',
            }}
          >
            {viaje?.destino}
          </h1>
          <Grid>
            <Card
              sx={{
                backgroundColor: 'var(--color-bg-header-card)',
                color: 'var(--color-text)',
              }}
            >
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant='h6'>Fecha de salida</Typography>
                    <Typography variant='body1'>
                      {new Date(viaje?.start_date ?? '').toLocaleDateString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant='h6'>Fecha de regreso</Typography>
                    <Typography variant='body1'>
                      {new Date(viaje?.end_date ?? '').toLocaleDateString()}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant='h6'>Número de personas</Typography>
                    <Typography variant='body1'>
                      {viaje?.participantes.length}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant='h6'>Número de días</Typography>
                    <Typography variant='body1'>
                      {Math.round((new Date(viaje?.end_date ?? '').getTime() -
                        new Date(viaje?.start_date ?? '').getTime()) /
                        (1000 * 3600 * 24))}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant='h6'>Coste Total</Typography>

                    {Object.entries(conceptosPorDivisa).map(
                      ([divisa, conceptos]) => {
                        return (
                          <Typography variant='body1'>
                            {getPrecioTotal(conceptos)} {divisa}
                          </Typography>
                        );
                      }
                    )}
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant='h6'>Coste medio por persona</Typography>
                    {Object.entries(conceptosPorDivisa).map(
                      ([divisa, conceptos]) => {
                        return (
                          <Typography variant='body1'>
                            {getPrecioPerCapita(conceptos, viaje?.participantes.length)} {divisa}
                          </Typography>
                        );
                      }
                    )}
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant='h6'>Coste por día</Typography>
                    {Object.entries(conceptosPorDivisa).map(
                      ([divisa, conceptos]) => {
                        return (
                          <Typography variant='body1'>
                            {getPrecioPerDiem(viaje as Viaje, conceptos)}{' '}
                            {divisa}
                          </Typography>
                        );
                      }
                    )}
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant='h6'>
                      Coste por persona y día
                    </Typography>
                    {Object.entries(conceptosPorDivisa).map(
                      ([divisa, conceptos]) => {
                        return (
                          <Typography variant='body1'>
                            {getPrecioPerDiemPerCapita(
                              viaje as Viaje,
                              conceptos
                            )}{' '}
                            {divisa}
                          </Typography>
                        );
                      }
                    )}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid
            spacing={1}
            container
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
            }}
          >
            {conceptos.map((concepto, i) => {
              return (
                <ConceptoCard
                  key={i}
                  concepto={concepto}
                  onSubmitCallback={fetchConceptos}
                />
              );
            })}
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default ViajeDetail;
