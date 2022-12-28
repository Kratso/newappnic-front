import { useSelector } from "react-redux/es/hooks/useSelector";
import { selectUserRole } from "../../slices/login.slice";
import { selectAllViajes } from "../../slices/viajes.slice";
import { RootState } from "../../store/store";
import { Container, Stack } from "@mui/system";
import { ViajeItem } from "./components/ViajeItem/ViajeItem";
import ViajeFormDialog from "../ViajeForm/ViajeForm";

const ViajesList = () => {
  const viajes = useSelector((state: RootState) => selectAllViajes(state));
  const userRole = useSelector((state: RootState) => selectUserRole(state));

  return (
    <Container>
      <Stack spacing={2}>
        {viajes.map((viaje, i) => (
          <ViajeItem key={i} viaje={viaje} />
        ))}
      </Stack>
      {userRole === "admin" ? (
        <ViajeFormDialog fab={true} />
      ) : (
        <></>
      )}
    </Container>
  );
};

export default ViajesList;
