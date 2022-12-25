import axios from "axios";

import { Viaje } from "../slices/viajes.slice";
import { BASE_URL } from "../constants";

const API_URL = `${BASE_URL}/api/viaje/`

const viajesService = {
    createViaje(viaje: Viaje, access_token: string) {
        return {
            data: []
        }
    },
    updateViaje(viaje: Viaje, access_token: string) {

    },
    deleteViaje(_id: string, access_token: string) {

    },
    async fetchViajes(access_token: string){
        try{
            const viajes = (await axios.get(`${API_URL}/all`,{
                headers: {
                    "Authorization": 'Bearer ' + access_token,
                  }
            })).data
            console.log("VIAJES ::>>>>>",viajes)

            
            return {
                viajes: viajes.data.viajes
            }
        } catch(err: any ){

        }
        return {
            data: []
        }
    }
}

export default viajesService;