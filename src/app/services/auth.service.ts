import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthData } from '../models/auth-data';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private authStatusListener = new Subject<boolean>();
  private tokenTimer: any;

  constructor(private http: HttpClient, private router: Router) { }

  getToken() {
    return this.token;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  createUser(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password
    };

    this.http.post("http://localhost:3000/api/user/signup", authData).subscribe(response => {
      console.log(response);
    })
  }

  login(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password
    };

    this.http.post<{token: string, expiresIn: number}>("http://localhost:3000/api/user/login", authData).subscribe(response => {
      const token = response.token;
      this.token = token;
      if (token) {
        const expiresInDuration = response.expiresIn;
        console.log(expiresInDuration);
        this.setAuthTimer(expiresInDuration);
        this.isAuthenticated = true;
        this.authStatusListener.next(true);
        const now = new Date();
        const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
        this.saveAuthData(token, expirationDate);
        this.router.navigate(['/']);
      }
    })
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    if (!token || !expirationDate ) {
      return null;
    }

    return {
      token: token,
      expirationDate: new Date(expirationDate)
    };
  }

  autoAuthUser() {
    const authInfo = this.getAuthData();

    if (!authInfo) {
      return;
    }

    const now = new Date();
    const expiresIn = authInfo.expirationDate.getTime() - now.getTime();

    if (expiresIn > 0) {
      this.token = authInfo.token;
      this.isAuthenticated = true;
      this.authStatusListener.next(true);
      this.setAuthTimer(expiresIn / 1000);
    }
  }

  private setAuthTimer(duration: number) {
    console.log("set timer to " + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }
}
