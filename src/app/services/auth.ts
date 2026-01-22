import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { jwtDecode } from 'jwt-decode';


@Injectable({
  providedIn: 'root',
})
export class Auth {
  
   private tokenKey = 'jwtToken';


   private usernameSubject = new BehaviorSubject<string | null>(null);
  username$ = this.usernameSubject.asObservable();

  private roleSubject = new BehaviorSubject<string | null>(null);
role$ = this.roleSubject.asObservable();

  constructor(private http: HttpClient) {
    this.restoreUserFromToken();
  }

  login(email: string, password: string) {
    return this.http.post<{ token: string }>('http://localhost:8080/api/auth/login', { email, password })
      .pipe(tap(res => {localStorage.setItem(this.tokenKey, res.token);
        this.setUserFromToken(res.token);
              console.log(res.token);

      }));
      
  }

  register(name: string, email: string, password: string, phoneNumber: string) {
  return this.http.post<{ token: string }>('http://localhost:8080/api/auth/register', {
    name,
    email,
    password,
    phoneNumber
  }).pipe(
    tap(res => {
      localStorage.setItem(this.tokenKey, res.token);
      console.log(res.token);
      this.setUserFromToken(res.token);
    })
  );
}


  private setUserFromToken(token: string) {
  try {
    const payload = jwtDecode<JwtPayload>(token);
    this.usernameSubject.next(payload.sub);
    this.roleSubject.next(payload.role); 
  } catch {
    this.usernameSubject.next(null);
    this.roleSubject.next(null);
  }
}
  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
      this.usernameSubject.next(null);
        this.roleSubject.next(null);

  }

   isLoggedIn(): boolean {
    return !!this.usernameSubject.value;
  }

  getUser() {
    return this.usernameSubject.value;
  }

  private restoreUserFromToken() {
    const token = this.getToken();
    if (!token) return;

    if (this.isTokenExpired(token)) {
      this.logout();
      return;
    }

    this.setUserFromToken(token);
  }

  

  private isTokenExpired(token: string): boolean {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.exp * 1000 < Date.now();
  }

}
