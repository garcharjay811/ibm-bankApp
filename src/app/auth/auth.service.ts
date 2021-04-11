import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject, empty } from 'rxjs';

import { environment } from '../../environments/environment';
// import { AuthData, authDataP, authDataNP } from './auth-data.model';
import { MatDialog } from '@angular/material/dialog';
import { ErrorComponent } from '../error/error.component';

const BACKEND_URL = environment.apiUrl + '/user/';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private isAuthenticated = false;
    private token: string;
    private tokenTimer: any;
    private userId: string;
    private admin = false;
    private adminId;
    private authStatusListener = new Subject<boolean>();
    private eventsUpdated = new Subject<{ events: any }>();
    constructor(private http: HttpClient, private router: Router) { }

    getToken() {
        return this.token;
    }

    getIsAuth() {
        return this.isAuthenticated;
    }

    getUserId() {
        return this.userId;
    }
    getAdminId() {
        return this.adminId;
    }
    getAuthStatusListener() {
        return this.authStatusListener.asObservable();
    }


    googleLogin() {
        window.location.href = (environment.apiUrl).slice(0, -3) + 'auth/google';
    }
    // http://socials-env.shbzuc3tkd.ap-south-1.elasticbeanstalk.com/auth/google'


    autoAuthUser() {
        console.log("autoAuthUser");
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
            this.authStatusListener.next(true);
        }
        return true;
    }

    getUserDetails(id: string) {
        return this.http.get<{
            email: string;
            firstName: string;
            lastName: string;
            balance: number;
        }>(BACKEND_URL + 'user-details/' + id);
    }
    getEventUpdateListener() {
        return this.eventsUpdated.asObservable();
    }

    logout() {
        this.token = null;
        this.isAuthenticated = false;
        this.admin = false;
        this.authStatusListener.next(false);
        this.userId = null;
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
    }

    private setAuthTimer(duration: number) {
        console.log('Setting timer: ' + duration);
        this.tokenTimer = setTimeout(() => {
            this.logout();
        }, duration * 1000);
    }

    private saveAuthData(token: string, expirationDate: Date, userId: string) {
        localStorage.setItem('token', token);
        localStorage.setItem('expiration', expirationDate.toISOString());
        localStorage.setItem('userId', userId);
    }

    private clearAuthData() {
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('userId');
    }

    private getAuthData() {
        const token = localStorage.getItem('token');
        const expirationDate = localStorage.getItem('expiration');
        const userId = localStorage.getItem('userId');
        if (!token || !expirationDate) {
            return;
        }
        return {
            token: token,
            expirationDate: new Date(expirationDate),
            userId: userId
        };
    }

    getContactNum(id: string) {
        return this.http.get<{
            phoneNum: string;
        }>(BACKEND_URL + 'user-phoneNum/' + id);
    }

    getUsers() {
        return this.http.get<{
            message: string;
            users: any;
            count: any;
        }>(BACKEND_URL);
    }
}
