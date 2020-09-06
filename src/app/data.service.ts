import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  //public baseUrl = "https://localhost:5001";
  public baseUrl = "https://www.parmex.com.br/todoapi";
  public serviceAlertUrl = "https://app-alert.herokuapp.com/alert";

  constructor(
    private http: HttpClient
  ) { }

  public composeHeaders(token) {
    if (token) {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
      return headers;
    } else {
      return null;
    }
  }

  public composeHeadersFCM() {
    const headers = new HttpHeaders()
      .set('Access-Control-Allow-Origin', '*')
    return headers;
  }  

  public getAlert(token) {
     return this.http.get(`${this.baseUrl}/v1/todos/alert`, { headers: this.composeHeaders(token) });
  }

  public postAlert(data) {
    return this.http.post(this.serviceAlertUrl, data, { headers: this.composeHeadersFCM()});
  }

  public getTodayTodos(token) {
    return this.http.get(`${this.baseUrl}/v1/todos/undone/today`, { headers: this.composeHeaders(token) });
  }

  public getTomorrowTodos(token) {
    return this.http.get(`${this.baseUrl}/v1/todos/undone/tomorrow`, { headers: this.composeHeaders(token) });
  }

  public getAllTodos(token) {
    return this.http.get(`${this.baseUrl}/v1/todos`, { headers: this.composeHeaders(token) });
  }

  public postTodo(data, token) {
    return this.http.post(`${this.baseUrl}/v1/todos`, data, { headers: this.composeHeaders(token) });
  }

  public markAsDone(data, token) {
    return this.http.put(`${this.baseUrl}/v1/todos/mark-as-done`, data, { headers: this.composeHeaders(token) });
  }

  public markAsUnDone(data, token) {
    return this.http.put(`${this.baseUrl}/v1/todos/mark-as-undone`, data, { headers: this.composeHeaders(token) });
  }

  public deleteTodo(data, token) {
    if (data) {
      const httpOptions = {
        headers: this.composeHeaders(token),
        body: data
      };
      return this.http.delete(`${this.baseUrl}/v1/todos`, httpOptions);
    }
  }

  public updateTodo(data, token) {
    return this.http.put(`${this.baseUrl}/v1/todos`, data, { headers: this.composeHeaders(token) });
  }

}
