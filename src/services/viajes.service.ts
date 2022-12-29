import axios from "axios";

import { Viaje } from "../slices/viajes.slice";
import { BASE_URL } from "../constants";

const API_URL = `${BASE_URL}/api/viaje`

const viajesService = {
    async createViaje(viaje: Viaje, access_token: string) {
        try{
            const viajeCreated = (await axios.post(`${API_URL}/create`, viaje, {
                headers: {  "Authorization": 'Bearer ' + access_token, }    
            })).data;    
            return {
                viaje: viajeCreated.data.viaje
            }
        } catch(err: any ) {
            console.log("ERROR ::>>>>>",err)
        }
    },
    async updateViaje(viaje: Viaje, access_token: string) {
        try {
            const viajeUpdated = (await axios.post(`${API_URL}/update`, viaje, {
                headers: {  "Authorization": 'Bearer ' + access_token, }    
            })).data;
            return {
                viaje: viajeUpdated.data.viaje
            }
        } catch(err: any ) {
            console.log("ERROR ::>>>>>",err)
        }
        return viaje;
    },
    async deleteViaje(_id: string, access_token: string) {
        return await axios.post(`${API_URL}/delete/`, {_id} , {
            headers: {  "Authorization": 'Bearer ' + access_token, }    
        })
    },
    async fetchViajes(access_token: string){
        try{
            const viajes = (await axios.get(`${API_URL}/all`,{
                headers: {
                    "Authorization": 'Bearer ' + access_token,
                  }
            })).data
            
            return {
                viajes: viajes.data.viajes
            }
        } catch(err: any ){
            return {
                data: []
            }
        }
    }
}

export default viajesService;