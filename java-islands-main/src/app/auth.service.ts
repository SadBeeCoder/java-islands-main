import { Injectable } from '@angular/core';
import {Observable, tap} from "rxjs";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {environment} from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isLoggedIn?: boolean;
  private username?: string;

  constructor(private client : HttpClient) { }

  postLogin(credentials: { username: string, password: string }) : Observable<string> {
    let httpParams = new HttpParams()
      .append("username", credentials.username)
      .append("password", credentials.password);

    let headers = new HttpHeaders()
      .append("Content-Type","application/x-www-form-urlencoded");

    return this.client.post<string>(environment.baseUrl + "/login",{},{
      headers: headers,
      params: httpParams,
      withCredentials: true // needed to that the cookie from the response is stored
    }).pipe(
      tap(() => {
        this.username = credentials.username; // Set the username upon successful login
      })
    )
  }
  postLogout() : Observable<string> {
    return this.client.post<string>(environment.baseUrl + "/logout",{},{
      withCredentials: true
    });
  }



  register(credentials: { username: string, password: string }) : Observable<string> {
    let httpParams = new HttpParams()
      .append("username", credentials.username)
      .append("password", credentials.password);

    return this.client.post<string>(environment.baseUrl + "/register",{
      userName: credentials.username,
      password: credentials.password
    },{
      params: httpParams,
      withCredentials: true // needed to that the cookie from the reponse is stored
    });
  }

  getIsLoggedIn(): boolean {
    return <boolean>this.isLoggedIn;
  }

  getUsername(): string | undefined {
    return this.username;
  }


  login() {
    this.isLoggedIn = true;
  }

  logout() {
    this.isLoggedIn = false;
  }
}
