import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpEventType,
  HttpResponse,
  HttpHeaderResponse, HTTP_INTERCEPTORS
} from '@angular/common/http';
import { finalize, Observable, tap } from 'rxjs';
import { LoaderService } from './loader.service';
import { LocalStorageService } from './local-storage.service';

@Injectable()
export class NetworkInterceptor implements HttpInterceptor {
  storeName = 'requests';
  constructor(
    private loaderService: LoaderService,
    private localStorageService: LocalStorageService
  ) { }

  /**
   * Show the loader component
   * Store the request in history local storage
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  // console.log("(e) Interceptor", request);
    const result = this.localStorageService.getJsonItem(this.storeName);
    this.loaderService.show();
    return next.handle(request)
      .pipe(finalize(() => this.loaderService.hide()))
      .pipe(
        tap((res: HttpEvent<HttpEventType>) => {
          if (res instanceof HttpResponse || res instanceof HttpHeaderResponse) {
            // console.log('(i) Store request in history', request.urlWithParams);
            const dataHistory = (result ? result : []);
            const dt = new Date();
            dataHistory.push({
              ts: dt.toISOString(),
              request: request.urlWithParams,
              method: request.method,
              size: res.headers.get('content-length'),
              status: res.status
            });
            this.localStorageService.setJsonItem(this.storeName, dataHistory);
          }
        })
      )
  }
}
export const NetworkInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: NetworkInterceptor, multi: true },
];
