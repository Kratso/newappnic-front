import { Fab } from "@mui/material";
import { Add } from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { selectUserRole } from "../../slices/login.slice";
import { selectAllViajes } from "../../slices/viajes.slice";
import { RootState } from "../../store/store";
import { Container, Stack } from "@mui/system";
import { ViajeItem } from "./components/ViajeItem/ViajeItem";

const ViajesList = () => {
  const viajes = useSelector((state: RootState) => selectAllViajes(state));
  const userRole = useSelector((state: RootState) => selectUserRole(state));
  
  return (
    <Container>
        <Stack>
            {
                viajes.map((viaje, i) => (
                    <ViajeItem key={i} viaje={viaje} />
                ))
            }
        </Stack>
      { userRole !== 'admin' ? <Fab color="primary" aria-label="add">
        <Add />
      </Fab> : <></>}
    </Container>
  );
};

export default ViajesList;
