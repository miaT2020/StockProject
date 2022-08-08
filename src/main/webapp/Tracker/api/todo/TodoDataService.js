
import axios from 'axios';
import {API_URL} from '../../Constants'

class TodoDataService {

     retrieveAllTodos(username){
        return axios.get(`${API_URL}/users/${username}/todos`);
     }

     deleteTodos(username,id){
        return axios.delete(`${API_URL}/users/${username}/todos/${id}`);   
     }

     retrieveTodos(username,id){
        return axios.get(`${API_URL}/users/${username}/todos/${id}`);   
     }

     updateTodos(username, id, todo){
        return axios.put(`${API_URL}/users/${username}/todos/${id}`, todo);   
     }

     postTodos(username, todo){
        return axios.post(`${API_URL}/users/${username}/todos`, todo);   
     }

}

export default new TodoDataService();