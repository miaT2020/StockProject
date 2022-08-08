import axios from 'axios';
import {API_URL} from '../../Constants'

export const USER_NAME_SESSION_ATTRIBUTE_NAME = 'authenticatedUser';
export const TOKEN = 'token';

class AuthenticationService {

  executeBasicAuthService(user, password){
    return axios.get(`${API_URL}/basicauth`,{
     headers:{authorization: this.createBasicAuthToken(user, password)}
   })
  };
 
  createBasicAuthToken(username, password){
     return 'Basic '+ window.btoa(username+":"+password);
  }

  createJwtToken(token){
    return 'Bearer '+ token;
  }

  executeJwtAuthenticationToken(username, password){
    return axios.post(`${API_URL}/authenticate`,{
      username, password
    })
  }

  registerSuccessfulLogin(username, password){
      sessionStorage.setItem(USER_NAME_SESSION_ATTRIBUTE_NAME, username);
      this.setupAxiosInterceptors(this.createBasicAuthToken(username, password));
  }

  registerSuccessfulLoginJwt(username, token){
    sessionStorage.setItem(USER_NAME_SESSION_ATTRIBUTE_NAME, username);
    sessionStorage.setItem(TOKEN, token);
    this.setupAxiosInterceptors(this.createJwtToken(token));
  }

  logout(){
      sessionStorage.removeItem(USER_NAME_SESSION_ATTRIBUTE_NAME);
  }

  isUserLoggedIn(){
      let user = sessionStorage.getItem(USER_NAME_SESSION_ATTRIBUTE_NAME);
      if(user === null)
        return false
      else return true
  }

  getLoggedInUserName(){
    let user = sessionStorage.getItem(USER_NAME_SESSION_ATTRIBUTE_NAME);
    if(user === null)
      return null
      else
      return user  
  }
   
 setupAxiosInterceptors(basicAuthHeader){

   axios.interceptors.request.use(
     (config) => {
       if(this.isUserLoggedIn){
         config.headers.authorization = basicAuthHeader
        }
         return config;
     }
   )
 } 

}

export default new AuthenticationService()