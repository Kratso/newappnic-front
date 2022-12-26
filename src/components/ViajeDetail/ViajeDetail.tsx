import { Container, Grid } from "@mui/material";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import conceptosService from "../../services/concepto.service";
import { selectAccessToken } from "../../slices/login.slice";
import { selectViajeById } from "../../slices/viajes.slice";
import { RootState } from "../../store/store";
import ConceptoCard from "./components/ConceptoCard/ConceptoCard";

const ViajeDetail = () => {
  const { _id } = useParams();
  const access_token = useSelector((state: RootState) =>
    selectAccessToken(state)
  );
  const viaje = useSelector((state: RootState) =>
    selectViajeById(state, _id ?? "")
  );
  const [conceptos, setConceptos] = React.useState<any[]>([]);
  console.log(_id, viaje);

  const fetchConceptos = async () => {
    const response = await conceptosService.fetchConceptosFromId(
      _id ?? "",
      access_token ?? ""
    );
    setConceptos(response.conceptos);
  };

  useEffect(() => {
    fetchConceptos();
  }, [access_token, _id]);

  return (
    <>
      <Container>
        <Grid>
          <h1 style={{
            color: 'rgba(255,211,232,0.8)',
          }}>{viaje?.destino}</h1>
          <Grid>
            {conceptos.map((concepto, i) => {
              return <ConceptoCard key={i} concepto={concepto} />;
            })}
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default ViajeDetail;
