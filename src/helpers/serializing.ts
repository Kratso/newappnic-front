import { Viaje } from "../slices/viajes.slice";

export function serializeViajes(viajes: Viaje[]) {
    console.log(viajes)
  return viajes.map((viaje) => ({
    _id: viaje._id,
    start_date: viaje.start_date,
    end_date: viaje.end_date,
    destino: viaje.destino,
    conceptos: viaje.conceptos,
    participantes: viaje.participantes,
  }));
}

export function deserializeViajes(viajes: Viaje[]) {
  return viajes.map((viaje) => ({
    ...viaje,
    start_date: new Date(viaje.start_date),
    end_date: new Date(viaje.end_date),
  }));
}
