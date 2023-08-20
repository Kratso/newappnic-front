import axios from "axios";
import { UserState } from "../slices/login.slice";
import { BASE_URL } from "../constants";

const AUTH_URL = `${BASE_URL}/api/auth/`;
const USER_URL = `${BASE_URL}/api/users/`;

class AuthService {
  async login(email: string, password: string) {
    try {
      const access_token = (
        await axios.post(AUTH_URL + "login", {
          email,
          password,
        })
      ).data;
      
      localStorage.setItem("TOKEN", access_token.access_token)

      const user = (await axios.get(USER_URL+'me',{
        headers: {
          "Authorization": 'Bearer ' + access_token.access_token,
        }
      })).data;
  
      user.user = user.data.user
      user.status = {
        status: 'OK'
      }
      user.user.access_token = access_token.access_token;

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

  async register(username: string, email: string, password: string, confirmPassword: string, phone: string) {
    return axios.post(AUTH_URL + "register", {
      name: username,
      email,
      password,
      passwordConfirm: confirmPassword,
      phone,
    });
  }

  async forgotPassword(email: string) {
    return axios.post(AUTH_URL + "forgot-password", {
      email,
    });
  }

  async updatePassword(email: string, password: string, confirmPassword: string, token: string) {
    return axios.patch(AUTH_URL + "reset-password/", {
      email,
      password,
      passwordConfirm: confirmPassword,
      token,
    });
  }
}

export default new AuthService();
