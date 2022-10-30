import axios from "axios";
import { UserState } from "../slices/login.slice";

const AUTH_URL = "http://localhost:8000/api/auth/";
const USER_URL = "http://localhost:8000/api/users/"

class AuthService {
  async login(email: string, password: string) {
    try {
      const access_token = (
        await axios.post(AUTH_URL + "login", {
          email,
          password,
        })
      ).data;
  
      const user = (await axios.get(USER_URL+'me',{
        headers: {
          "Authorization": 'Bearer ' + access_token.access_token,
        }
      })).data;
  
      user.user = user.data.user
      user.status = {
        status: 'OK'
      }
      return user;
    }catch(error) {
      return {
        status: {
          status: 'KO'
        },  
      } as UserState
    }
    
  }

  logout() {
    // Just in case we need to alert anyone we are loging out. I will NOT elaborate.
  }

  async register(username: string, email: string, password: string, confirmPassword: string) {
      console.log(username, email, password, confirmPassword)
    return axios.post(AUTH_URL + "register", {
      name: username,
      email,
      password,
      passwordConfirm: confirmPassword
    });
  }
}

export default new AuthService();
