import axios from "axios";

import { Concepto } from "../slices/concepto.slice";
import { BASE_URL } from "../constants";

const API_URL = `${BASE_URL}/api/conceptos/`;

const conceptosService = {
    async createConcepto(concepto: Concepto, access_token: string) {
        console.log("CONCEPTO ::>>>>>",concepto, JSON.stringify(concepto));
        try{
            const conceptoCreated = (await axios.post(`${API_URL}/create`, concepto, {
                headers: {  "Authorization": 'Bearer ' + access_token, }    
            })).data;    
            console.log("CONCEPTO CREATED ::>>>>>",conceptoCreated);
            return {
                concepto: conceptoCreated.data.concepto
            }
        } catch(err: any ) {
            console.log("ERROR ::>>>>>",err)
            return {
                concepto: null
            }
        }
    },
    async updateConcepto(concepto: Concepto, access_token: string) {
        try {
            const conceptoUpdated = (await axios.post(`${API_URL}/update`, concepto, {
                headers: {  "Authorization": 'Bearer ' + access_token, }    
            })).data;
            console.log("CONCEPTO UPDATED ::>>>>>",conceptoUpdated);
            return {
                concepto: conceptoUpdated.data.concepto
            }
        } catch(err: any ) {
            console.log("ERROR ::>>>>>",err)
        }
    },
    async deleteConcepto(_id: string, access_token: string) {
        return await axios.post(`${API_URL}/delete/`, {_id} , {
            headers: {  "Authorization": 'Bearer ' + access_token, }    
        })
    },
    async fetchConceptosFromId(id: string, access_token: string){
        try {
            const conceptos = (await axios.get(`${API_URL}/all/${id}`,{
                headers: {
                    "Authorization": 'Bearer ' + access_token,
                  }
            })).data
            console.log("CONCEPTOS ::>>>>>",conceptos)
            return {
                conceptos: conceptos.data.conceptos
            };
        } catch(err: any ){
            return {
                data: []
            }
        }
    }
}

export default conceptosService;
