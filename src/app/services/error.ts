import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LocalStorageService } from './local-storage.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private localSore: LocalStorageService, private router: Router) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            // console.log("Error interceptor",err);
            const token = this.localSore.getItem(environment.keyToken);
            // console.log('Error interceptor Token',token);
            if ([401, 403].includes(err.status)) {
                // auto logout if 401 or 403 response returned from api
                this.router.navigate(['/signin']);
            }
            const error = err.error?.message || err.statusText;
            return throwError(() => error);
        }))
    }
}
export const ErrorInterceptorProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
];