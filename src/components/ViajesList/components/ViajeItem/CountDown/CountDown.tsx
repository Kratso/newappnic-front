import { Typography } from "@mui/material";
import Countdown from "react-countdown";

const Completion = ({finished} : {finished: Boolean}) => (
  <span>{finished ? "Finalizado" : "¡En curso!"}</span>
);

const renderer = ({ date, days, hours, minutes, seconds, completed }: any) => {
  if (completed) {
    return <Completion finished={new Date().getTime() > new Date(date).getTime()} />;
  } else {
    return (
      <Typography sx={{ mb: 1.5 }} color="text.secondary">
        {days} dias {hours} horas {minutes} minutos {seconds} segundos
      </Typography>
    );
  }
};

export const CountDown = ({ startDate, endDate }: { startDate: Date, endDate: Date }) => {
  return (
    <Countdown date={startDate} renderer={(args) => renderer({date: endDate, ...args})} />
  );
}