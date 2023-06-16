import { useSelector } from "react-redux/es/hooks/useSelector";
import { selectUser, User } from "../../slices/login.slice";
import { selectAllViajes } from "../../slices/viajes.slice";
import { RootState } from "../../store/store";
import { Container, Stack } from "@mui/system";
import { ViajeItem } from "./components/ViajeItem/ViajeItem";
import ViajeFormDialog from "../ViajeForm/ViajeForm";
import { useMemo } from "react";
import { compareTripsByStartDate } from "../../helpers/tripDateComparatorSorter";

const ViajesList = () => {
  const viajes = useSelector((state: RootState) => selectAllViajes(state));
  const user = useSelector((state: RootState) => selectUser(state));

  const userRole = useMemo(() => user.user?.role, [user]);
  const viajesOfUser = useMemo(
    () =>
      viajes.filter(
        (viaje) =>
          (viaje.participantes as any).find(
            (participante: User) => participante._id === user.user?._id
          ) || userRole === "admin"
      ).sort(compareTripsByStartDate),
    [user.user?._id, userRole, viajes]
  );

  return (
    <Container>
      <Stack spacing={2}>
        {viajesOfUser.sort(compareTripsByStartDate).map((viaje, i) => (
          <ViajeItem key={i} viaje={viaje} />
        ))}
      </Stack>
      {userRole === "admin" ? <ViajeFormDialog fab={true} /> : <></>}
    </Container>
  );
};

export default ViajesList;
