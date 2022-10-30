import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import viajesService from "../services/viajes.service";
import { RootState } from "../store/store";
import { Concepto } from "./concepto.slice";

export interface Viaje {
  _id?: string,
  start_date: Date,
  end_date: Date,
  conceptos: Concepto[],
  participantes: string[]
}

export interface ViajeStatus {
  status: "idle" | "loading" | "OK" | "KO";
  error: string | null | undefined;
}

export interface ViajeState {
  status: ViajeStatus;
  viajes: Viaje[];
}

const initialState: ViajeState = {
  status: { 
      status: "idle",
      error: null 
  },
  viajes: [],
};

const viajesSlice = createSlice({
  name: "viajes",
  initialState,
  reducers: {
    viajeCreate(state, action) {
      viajesService.createViaje(action.payload);
      state.viajes.push(action.payload);
    },
    viajeDelete(state, action) {
      const { id } = action.payload;
      viajesService.deleteViaje(id);
      state.viajes.forEach( (item, index) => {
        if(item._id === id) state.viajes.splice(index, 1);
      })      
    },
    viajeUpdate(state, action) {
        const {_id, conceptos, participantes, start_date, end_date} = action.payload
        const viaje = state.viajes.find(viaje => viaje._id === _id)

        if(viaje) {
            viaje.conceptos = conceptos;
            viaje.participantes = participantes;
            viaje.start_date = start_date;
            viaje.end_date = end_date;
        }
    }
  },
  extraReducers(builder) {
    builder
        .addCase(fetchViajes.pending, (state, actions) => {
          state.status.status = 'loading';
        })
        .addCase(fetchViajes.fulfilled, (state, action) => {
          state.status.status = 'OK'
          // Add any fetched posts to the array
          state.viajes = state.viajes.concat(action.payload)

          //filter duplicate ids
          state.viajes = state.viajes.filter((v,i,a)=>a.findIndex(v2=>(v2._id===v._id))===i)
        })
        .addCase(fetchViajes.rejected, (state, action) => {
          state.status.status = 'KO'
          state.status.error = action.error.message
        }).addCase(createViaje.pending, (state, actions) => {
            state.status.status = 'loading'
        }).addCase(createViaje.fulfilled, (state, actions) => {
            state.status.status = 'OK';
        }).addCase(updateViaje.pending, (state, actions) => {
            state.status.status = 'loading'
        }).addCase(updateViaje.fulfilled, (state, actions) => {
            state.status.status = 'OK';
        }).addCase(deleteViaje.pending, (state, actions) => {
            state.status.status = 'loading'
        }).addCase(deleteViaje.fulfilled, (state, actions) => {
            state.status.status = 'OK';
        })
  }
});

export const { viajeCreate, viajeDelete, viajeUpdate } = viajesSlice.actions;

export default viajesSlice.reducer;

export const selectAllViajes: (state: RootState)=>Viaje[] = (state: RootState) => state.viajes.viajes;

export const selectPostById = (state: RootState, viajeId: string) =>
  state.viajes.viajes.find((viaje: Viaje) => viaje._id === viajeId);

export const fetchViajes = createAsyncThunk('viajes/fetchViajes', async () => {
  const response = await viajesService.fetchViajes();
  return response.data as Viaje[]
})

export const createViaje = createAsyncThunk('viajes/createViaje', async (viaje: Viaje) => {
    await viajesService.createViaje(viaje);
})

export const updateViaje = createAsyncThunk('viajes/updateViaje', async (viaje: Viaje) => {
    await viajesService.updateViaje(viaje);
})

export const deleteViaje = createAsyncThunk('viajes/deleteViaje', async (_id: string) => {
    await viajesService.deleteViaje(_id);
})