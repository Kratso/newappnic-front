import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import conceptosService from "../services/concepto.service";
import { RootState } from "../store/store";
import { User } from "./login.slice";
import { Viaje } from "./viajes.slice";


export type Concepto = {
    _id?: string,
    titulo: string,
    fecha: Date,
    pagador: string | User,
    participantes: string[] | {usuario: User, pagado: boolean}[],
    unidades: number,
    precio: number,
    viaje: string | Viaje,
    categoria?: '' | 'comida' | 'transporte' | 'alojamiento' | 'otros',
    divisa?: string,
}

export interface ConceptoStatus {
    status: "idle" | "loading" | "OK" | "KO";
    error: string | null | undefined;
}

export interface ConceptoState {
    status: ConceptoStatus;
    conceptos: Concepto[];
}

const initialState: ConceptoState = {
    status: {
        status: "idle",
        error: null,
    },
    conceptos: [],
};

const conceptosSlice = createSlice({
    name: "conceptos",
    initialState,
    reducers: {
        setConceptos(state, action) {
            state.conceptos = action.payload;
        },
        conceptoCreate(state, action) {
            const { concepto, access_token } = action.payload;
            state.conceptos.push(concepto);
            conceptosService.createConcepto(concepto, access_token);
        },
        conceptoDelete(state, action) {
            const { id, access_token } = action.payload;
            conceptosService.deleteConcepto(id, access_token);
            state.conceptos.forEach((item, index) => {
                if (item._id === id) state.conceptos.splice(index, 1);
            })
        },
        conceptoUpdate(state, action) {
            const { _id, titulo, fecha, pagador, participantes, unidades, precio, viaje } = action.payload.concepto;
            const concepto = state.conceptos.find(concepto => concepto._id === _id)

            if (concepto) {
                concepto.titulo = titulo
                concepto.fecha = fecha
                concepto.pagador = pagador
                concepto.participantes = participantes;
                concepto.unidades = unidades;
                concepto.precio = precio;
                concepto.viaje = viaje;
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchConceptos.pending, (state, action) => {
            state.status.status = "loading";
        })
        .addCase(fetchConceptos.fulfilled, (state, action) => {
            state.status.status = "OK";
            state.conceptos.concat(...action.payload);
        })
        .addCase(fetchConceptos.rejected, (state, action) => {
            state.status.status = "KO";
            state.status.error = action.error.message;
        })
        .addCase(createConcepto.pending, (state, action) => {
            state.status.status = "loading";
        })
        .addCase(createConcepto.fulfilled, (state, action) => {
            state.status.status = "OK";
            state.conceptos.push(action.payload);
        })
        .addCase(createConcepto.rejected, (state, action) => {
            state.status.status = "KO";
            state.status.error = action.error.message;
        })
        .addCase(deleteConcepto.pending, (state, action) => {
            state.status.status = "loading";
        })
        .addCase(deleteConcepto.fulfilled, (state, action) => {
            state.status.status = "OK";
            state.conceptos.forEach((item, index) => {
                if (item._id === action.payload) state.conceptos.splice(index, 1);
            })
        })
        .addCase(deleteConcepto.rejected, (state, action) => {
            state.status.status = "KO";
            state.status.error = action.error.message;
        })
        .addCase(updateConcepto.pending, (state, action) => {
            state.status.status = "loading";
        })
        .addCase(updateConcepto.fulfilled, (state, action) => {
            state.status.status = "OK";
            const { _id, titulo, fecha, pagador, participantes, unidades, precio, viaje } = action.payload;
            const concepto = state.conceptos.find(concepto => concepto._id === _id)

            if (concepto) {
                concepto.titulo = titulo
                concepto.fecha = fecha
                concepto.pagador = pagador
                concepto.participantes = participantes;
                concepto.unidades = unidades;
                concepto.precio = precio;
                concepto.viaje = viaje;
            }
        })
        .addCase(updateConcepto.rejected, (state, action) => {
            state.status.status = "KO";
            state.status.error = action.error.message;
        })
    }
});

export const { setConceptos, conceptoCreate, conceptoDelete, conceptoUpdate } = conceptosSlice.actions;

export default conceptosSlice.reducer;

export const selectConceptosFromViaje = (state: RootState, viajeId: string) => state.conceptos.conceptos.filter(concepto => concepto.viaje === viajeId);

export const fetchConceptos = createAsyncThunk<Concepto[], {id:string, access_token: string}, {}>("conceptos/fetchConceptos", async ({id, access_token}) => {
    const conceptos = (await conceptosService.fetchConceptosFromId(id, access_token)).data;
    return conceptos as Concepto[];
});

export const createConcepto = createAsyncThunk<Concepto, {concepto: Concepto, access_token: string}, {}>("conceptos/createConcepto", async ({concepto, access_token}) => {
    const newConcepto = (await conceptosService.createConcepto(concepto, access_token) as any)?.data;
    return newConcepto as Concepto;
});

export const deleteConcepto = createAsyncThunk<string, {id: string, access_token: string}, {}>("conceptos/deleteConcepto", async ({id, access_token}) => {
    (await conceptosService.deleteConcepto(id, access_token) as any)
    return id;
});

export const updateConcepto = createAsyncThunk<Concepto, {concepto: Concepto, access_token: string}, {}>("conceptos/updateConcepto", async ({concepto, access_token}) => {
    const updatedConcepto = (await conceptosService.updateConcepto(concepto, access_token) as any)?.data;
    return updatedConcepto as Concepto;
});

