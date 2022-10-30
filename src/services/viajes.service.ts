import axios from "axios";

import { Viaje } from "../slices/viajes.slice";

const API_URL = "http://localhost:8000/api/viajes/"

const viajesService = {
    createViaje(viaje: Viaje) {

    },
    updateViaje(viaje: Viaje) {

    },
    deleteViaje(_id: string) {

    },
    fetchViajes(){
        return {
            data: []
        }
    }
}

export default viajesService;