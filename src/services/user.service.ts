import axios from "axios";
import { UserState } from "../slices/login.slice";
import { BASE_URL } from "../constants";

const USER_URL = `${BASE_URL}/api/users/`;

class UserService {
    async checkUser(access_token: string) {
        try {
        const user = (await axios.get(USER_URL+'me',{
            headers: {
              "Authorization": 'Bearer ' + access_token,
            }
          })).data;
      
          user.user = user.data.user
          user.status = {
            status: 'OK'
          }
          user.user.access_token = access_token;
    
          return user;
        } catch(err: any) {
            return {
                status: {
                  status: 'KO'
                },  
              } as UserState
        }
    }
    async getAllUsers(access_token: string) {
      try {
        const users = (await axios.get(`${USER_URL}`,{
          headers: { "Authorization": 'Bearer ' + access_token }
          })).data;

        return users;
      } catch(err: any) {
        return {
          status: {
            status: 'KO'
          },  
        } as UserState
      }
    }
}

export default new UserService();