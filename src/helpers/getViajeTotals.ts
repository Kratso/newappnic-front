import { Concepto } from "../slices/concepto.slice";
import { Viaje } from "../slices/viajes.slice";

export const getPrecioTotal = (conceptos: Concepto[]) => {
  return conceptos
    .reduce((acc, curr) => {
      return acc + curr.precio * curr.unidades;
    }, 0)
    .toFixed(2);
};

export const getPrecioPerCapita = (conceptos: Concepto[], numberOfParticipants: number = 1) => {
  let totalPrice = 0;

  conceptos.forEach((concepto) => {
    totalPrice += concepto.precio * concepto.unidades;
  });

    return (totalPrice / numberOfParticipants).toFixed(2);
};

export const getPrecioPerDiem = (viaje: Viaje, conceptos: Concepto[]) => {
  const dias =
    Math.round(new Date(viaje.end_date).getTime() -
      new Date(viaje.start_date).getTime()) /
    (1000 * 3600 * 24);

  return conceptos
    .reduce((acc, curr) => {
      return acc + (curr.precio * curr.unidades) / dias;
    }, 0)
    .toFixed(2);
};

export const getPrecioPerDiemPerCapita = (
  viaje: Viaje,
  conceptos: Concepto[]
) => {
  const dias =
    (new Date(viaje.end_date).getTime() -
      new Date(viaje.start_date).getTime()) /
    (1000 * 3600 * 24);

    const numberOfParticipants = viaje.participantes.length;

  return conceptos
    .reduce((acc, curr) => {
      return (
        acc + (curr.precio * curr.unidades) / dias / numberOfParticipants
      );
    }, 0)
    .toFixed(2);
};
