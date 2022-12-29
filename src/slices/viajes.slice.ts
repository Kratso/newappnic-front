import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { deserializeViajes, serializeViajes } from "../helpers/serializing";

import viajesService from "../services/viajes.service";
import { RootState } from "../store/store";
import { Concepto } from "./concepto.slice";
import { User } from "./login.slice";

export interface Viaje {
  _id?: string,
  start_date: Date,
  end_date: Date,
  destino: string,
  conceptos: Concepto[],
  participantes: string[] | User[],
  contable: User,
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
  viajes: localStorage.getItem("viajes") ? deserializeViajes(JSON.parse(localStorage.getItem("viajes") || "")) : [],
};

const viajesSlice = createSlice({
  name: "viajes",
  initialState,
  reducers: {
    setViajes(state, action) {
      state.viajes = action.payload;
      localStorage.setItem("viajes", JSON.stringify(serializeViajes(action.payload as Viaje[])));
    },
    viajeCreate(state, action) {
      const {viaje, access_token} = action.payload
      const data = viajesService.createViaje(viaje, access_token);
      state.viajes.push(viaje);
    },
    viajeDelete(state, action) {
      const { id, access_token } = action.payload;
      viajesService.deleteViaje(id, access_token);
      state.viajes.forEach( (item, index) => {
        if(item._id === id) state.viajes.splice(index, 1);
      })      
    },
    viajeUpdate(state, action) {
        const {_id, destino, conceptos, participantes, start_date, end_date, contable} = action.payload.viaje;
        const viaje = state.viajes.find(viaje => viaje._id === _id)
        console.log(viaje)
        if(viaje) {
            viaje.destino = destino
            viaje.conceptos = conceptos;
            viaje.participantes = participantes;
            viaje.start_date = start_date;
            viaje.end_date = end_date;
            viaje.contable = contable;
        }
    }
  },
  extraReducers(builder) {
    builder
        .addCase(fetchViajesMiddle.pending, (state, actions) => {
          state.status.status = 'loading';
        })
        .addCase(fetchViajesMiddle.fulfilled, (state, action) => {
          state.status.status = 'OK'
          // Add any fetched posts to the array
          state.viajes = state.viajes.concat(action.payload)

          //filter duplicate ids
          state.viajes = state.viajes.filter((v,i,a)=>a.findIndex(v2=>(v2._id===v._id))===i)
        })
        .addCase(fetchViajesMiddle.rejected, (state, action) => {
          state.status.status = 'KO'
          state.status.error = action.error.message
        }).addCase(createViajeMiddle.pending, (state, actions) => {
            state.status.status = 'loading'
        }).addCase(createViajeMiddle.fulfilled, (state, actions) => {
            state.status.status = 'OK';
        }).addCase(updateViajeMiddle.pending, (state, actions) => {
            state.status.status = 'loading'
        }).addCase(updateViajeMiddle.fulfilled, (state, actions) => {
            state.status.status = 'OK';
        }).addCase(deleteViajeMiddle.pending, (state, actions) => {
            state.status.status = 'loading'
        }).addCase(deleteViajeMiddle.fulfilled, (state, actions) => {
            state.status.status = 'OK';
        })
  }
});

export const { viajeCreate, viajeDelete, viajeUpdate, setViajes } = viajesSlice.actions;

export default viajesSlice.reducer;

export const selectAllViajes: (state: RootState)=>Viaje[] = (state: RootState) => state.viajes.viajes;

export const selectViajeById = (state: RootState, viajeId: string) =>
  state.viajes.viajes.find((viaje: Viaje) => viaje._id === viajeId);

export const fetchViajesMiddle = createAsyncThunk('viajes/fetchViajes', async (access_token: string) => {
  const response = await viajesService.fetchViajes(access_token);
  return response.data as Viaje[]
})

export const createViajeMiddle = createAsyncThunk<Viaje[],{viaje:Viaje, access_token:string},{}>('viajes/createViaje', async ({viaje, access_token}) => {
    await viajesService.createViaje(viaje, access_token);
    console.log("AAAAAA")
    return (await viajesService.fetchViajes(access_token)).data as Viaje[];
})

export const updateViajeMiddle = createAsyncThunk<void,{viaje:Viaje},{}>('viajes/updateViaje', async ({viaje}) => {
  console.log(viaje)
})

export const deleteViajeMiddle = createAsyncThunk<void,{_id: string, access_token:string}, {} >('viajes/deleteViaje', async ({_id, access_token}) => {
    await viajesService.deleteViaje(_id, access_token);
})