import { Concepto } from "../slices/concepto.slice";
import { User } from "../slices/login.slice";

export function getAmountOwed(conceptos: Concepto[], user: User, isContable: Boolean): number {
    let amountOwed = 0;
  
    for (const concepto of conceptos) {
      const participante = (concepto.participantes as any).find(
        (p: { usuario: User; pagado: boolean } | string) =>
          typeof p === "object" && p.usuario._id === user._id
      );
  
      if (participante) {
        // If the user is a participant in this concepto and has not yet paid,
        // add their share of the cost to the amount owed
        if (typeof participante === "object" && !participante.pagado) {
          amountOwed += concepto.precio * concepto.unidades / concepto.participantes.length;
        }
      }
      if ((concepto.pagador as any)._id === user._id && !isContable) {
        const debtUsers = (concepto.participantes as any[]).reduce((acc, p) => p.pagado ? acc : ++acc, 0);
        // If the user is the pagador for this concepto, add the total cost to the amount owed
        amountOwed -= (concepto.precio * concepto.unidades) * debtUsers / concepto.participantes.length;
      }
    }
  
    return amountOwed;
  }