import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { User } from '../model/user';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  keyUser = 'sma-exp_user';
  private userSubject: BehaviorSubject<User | null>;
  public user: Observable<User | null>;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem(this.keyUser)!));
    this.user = this.userSubject.asObservable();
  }

  public get userValue() {
    return this.userSubject.value;
  }

  login(username: string, password: string, token: any) {
    const data = {
      email: username,
      password: password,
      token: token
    }
    return this.http.post<User>(`${environment.auth.server}/api/auth/signin`, data)
      .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem(this.keyUser, JSON.stringify(user));
        this.userSubject.next(user);
        return user;
      }));
  }

  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem(this.keyUser);
    this.userSubject.next(null);
    this.router.navigate(['/signin']);
  }

  register(user: User) {
    return this.http.post(`${environment.auth.server}/api/auth/register`, user);
  }

  getAll() {
    return this.http.get<User[]>(`${environment.auth.server}/api/auth/users`);
  }

  getById(id: string) {
    return this.http.get<User>(`${environment.auth.server}/api/auth/users/${id}`);
  }

  update(id: string, params: any) {
    return this.http.put(`${environment.auth.server}/api/auth/users/${id}`, params)
      .pipe(map(x => {
        // update stored user if the logged in user updated their own record
        if (id == this.userValue?.id) {
          // update local storage
          const user = { ...this.userValue, ...params };
          localStorage.setItem('user', JSON.stringify(user));

          // publish updated user to subscribers
          this.userSubject.next(user);
        }
        return x;
      }));
  }

  delete(id: string) {
    return this.http.delete(`${environment.auth.server}/api/auth/users/${id}`)
      .pipe(map(x => {
        // auto logout if the logged in user deleted their own record
        if (id == this.userValue?.id) {
          this.logout();
        }
        return x;
      }));
  }
}
