import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthData } from "./auth-data.model";
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

import { environment } from "../../environments/environment";

const BACKEND_URL = environment.apiUrl + "/user/";

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private userId: string;
  private authStatusListner = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getAuthStatusListner() {
    return this.authStatusListner.asObservable();
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId(){
    return this.userId;
  }

  createUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http
      .post(BACKEND_URL + "/signup", authData)
      .subscribe(() => {
        this.router.navigate(["/"]);
      }, error => {
        this.authStatusListner.next(false);
      });
  }

  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password};
    this.http.post<{token: string, expiresIn: number, userId: string}>(BACKEND_URL + "/login", authData)
    .subscribe(res => {
      const token = res.token;
      this.token = token;
      if (token) {
        const expiresInTime = res.expiresIn;

        this.setAuthTimer(expiresInTime);

        this.isAuthenticated = true;

        this.userId = res.userId;
        this.authStatusListner.next(true);

        const now = new Date();
        const expirationDate = new Date(now.getTime() + expiresInTime * 1000);
        console.log(expirationDate);
        this.saveAuthData(token, expirationDate, this.userId);
        this.router.navigate(["/"]);
      }
    }, error => {
      this.authStatusListner.next(false);
    });
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListner.next(false);
    clearTimeout(this.tokenTimer);
    this.userId = null;
    this.clearAuthData();
    this.router.navigate(["/"]);
  }



  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListner.next(true);
    }
  }

  private setAuthTimer(duration: number) {
    console.log('Setting timer:' + duration);
    setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    };
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }
}
