import { Viaje } from "../slices/viajes.slice";

export function compareTripsByStartDate(a: Viaje, b: Viaje): number {
  const dateA = new Date(a.start_date).getTime(); // Convert start dates to milliseconds
  const dateB = new Date(b.start_date).getTime();

  // Compare dates in reverse order (most recent first)
  if (dateA > dateB) {
    return -1;
  } else if (dateA < dateB) {
    return 1;
  }

  return 0; // If the start dates are equal, maintain the current order
}
