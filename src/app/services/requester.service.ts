import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { Observable, throwError } from 'rxjs';
import { catchError, map, retry, tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class RequesterService {
  env = (environment.production ? 'production' : 'developpement');
  rootApi = `${environment.api.server}/api`;
  rootStore = `${environment.api.server}/api/jstores`;
  appName = 'sma-mobile';

  constructor(private http: HttpClient) { }

  getRequest(url: string) {
    return this.http.get<any>(url)
      .pipe(
        retry(0), // retry a failed request up to 0 times
        catchError(this.handleError) // then handle the error
      );
  }
  getFullRequest(url: string, mode: string, headerKey?: string, headersRequest?: HttpHeaders): any {
    // console.log(url, mode);
    let headers = (headersRequest ? headersRequest : new HttpHeaders());
    if (headerKey) {
      headers.set('Authorization', `Bearer ${headerKey}`);
    }
    let httpOptions = {};
    switch (mode) {
      case 'html':
        headers.set('Accept', 'text/html');
        headers.set('Content-Type', 'text/html; charset=utf-8');
        headers.set('Access-Control-Allow-Origin', '*');
        httpOptions = {
          headers: headers,
          responseType: 'text'
        };
        break;
      case 'media':
        //headers.set('Accept', 'text/html');
        //headers.set('Content-Type', 'text/html; charset=utf-8');
        headers.set('Access-Control-Allow-Origin', '*');
        httpOptions = {
          headers: headers,
          responseType: "stream"
        };
        break;
      case 'image':
        headers.set('Accept', 'image/*');
        //headers.set('Content-Type', 'text/html; charset=utf-8');
        headers.set('Access-Control-Allow-Origin', '*');
        httpOptions = {
          headers: headers,
          responseType: "blob"
        };
        break;

      default:
        // JSON
        headers.set('Accept', '*/*');
        headers.set('Content-Type', 'application/json');
        headers.set('Access-Control-Allow-Origin', '*');
        httpOptions = {
          headers: headers,
          responseType: 'json'
        };
        break;
    }
    return this.http.get<any>(url, httpOptions).pipe(
      retry(0), // retry a failed request up to 0 times
      catchError(this.handleError) // then handle the error
    );
  }
  postRequest(url: string, data: any) {
    var options = {
      /* headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      } */
    };
    return this.http.post<any>(url, data, options)
      .pipe(
        catchError(this.handleError) // then handle the error
      );
  }
  deleteRequest(url: string) {
    var options = {
      /* headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      } */
    };
    return this.http.delete<any>(url, options)
      .pipe(
        catchError(this.handleError) // then handle the error
      );
  }
  putRequest(url: string, data: any) {
    var options = {
      /* headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      } */
    };
    return this.http.put<any>(url, data, options)
      .pipe(
        catchError(this.handleError) // then handle the error
      );
  }


  /**
   * Call CRUD api 
   * @param url 
   * @returns 
   */
  getApi(url: string): Observable<HttpResponse<any>> {
    const urlReq = `${this.rootApi}${url}`;
    return this.http.get<any>(
      urlReq, { observe: 'response' });
  }
  postApi(url: string, data: any) {
    const urlReq = `${this.rootApi}${url}`;
    var options = {
      /* headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      } */
    };
    return this.http.post<any>(urlReq, data, options)
      .pipe(
        catchError(this.handleError) // then handle the error
      );
  }
  putApi(url: string, id: any, data: any) {
    const urlReq = `${this.rootApi}${url}/${id}`;
    var options = {
      /* headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      } */
    };
    return this.http.put<any>(urlReq, data, options)
      .pipe(
        catchError(this.handleError) // then handle the error
      );
  }
  delApi(url: string, id: any) {
    const urlReq = `${this.rootApi}${url}/${id}`;
    var options = {
      /* headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      } */
    };
    return this.http.delete<any>(urlReq, options)
      .pipe(
        catchError(this.handleError) // then handle the error
      );
  }

  getConfigApp(appKey: string) {
    const urlReq = `${this.rootApi}/app-confs?filters[appKey][$eq]=${appKey}`;
    return this.http.get<any>(urlReq)
      .pipe(
        retry(3), // retry a failed request up to 3 times
        catchError(this.handleError) // then handle the error
      );
  }
  saveUserConfig() {

  }
  readUserConfig(email: string) {
    const urlReq = `${this.rootApi}/user-configs?filters[email][$eq]=${email}`;
    return this.http.get<any>(urlReq)
      .pipe(
        retry(3), // retry a failed request up to 3 times
        catchError(this.handleError) // then handle the error
      );
  }
  /**
   * STRAPI STORE
   */
  getCount() {
    const url = `${this.rootStore}/count`;
    return this.http.get<any>(url)
      .pipe(
        retry(3), // retry a failed request up to 3 times
        catchError(this.handleError) // then handle the error
      );
  }
  getStoreApps() {
    const url = `${this.rootStore}?filters[model][$eq]=app`;
    return this.http.get<any>(url)
      .pipe(
        retry(3), // retry a failed request up to 3 times
        catchError(this.handleError) // then handle the error
      );
  }
  getStore(app?: string, all?: boolean, page?: number, limit?: number) {
    const appName = app || "demo"
    const filterAll = all || false;
    const perPage = limit || 100;
    const startPage = page || 0;
    const start = startPage * perPage;
    const filters = (filterAll ? '' : '&filters[$and][0][model][$ne]=model&filters[$and][1][model][$ne]=app')
    const url = `${this.rootStore}?filters[app][$eq]=${appName}&${filters}&_limit=${perPage}&_start=${start}`;
    return this.http.get<any>(url)
      .pipe(
        retry(3), // retry a failed request up to 3 times
        catchError(this.handleError) // then handle the error
      );
  }
  getStoreModelList(app?: string) {
    const appName = app || "demo"
    const url = `${this.rootStore}?filters[app][$eq]=${appName}&filters[model][$eq]=model`;
    return this.http.get<any>(url)
      .pipe(
        retry(3), // retry a failed request up to 3 times
        catchError(this.handleError) // then handle the error
      );
  }
  getStoreModel(app?: string, model?: string) {
    const appName = app || "demo"
    const appModel = model || 'model';
    const url = `${this.rootStore}?filters[app][$eq]=${appName}&filters[name][$eq]=${appModel}&filters[model][$eq]=model`;
    return this.http.get<any>(url)
      .pipe(
        retry(3), // retry a failed request up to 3 times
        catchError(this.handleError) // then handle the error
      );
  }
  getStoreItem(id: any) {
    const url = `${this.rootStore}/${id}`;
    return this.http.get<any>(url)
      .pipe(
        retry(3), // retry a failed request up to 3 times
        catchError(this.handleError) // then handle the error
      );
  }
  postStore(data: any) {
    const d = {
      data: {
        "app": data.app,
        "name": data.name,
        "description": data.description || "A completer...",
        "model": data.model,
        "json": JSON.parse(JSON.stringify(data.json)),
        "data_text": data.data_text,
        "data_html": data.data_html
      }
    }
    const url = `${this.rootStore}`;
    return this.http.post<any>(url, d)
      .pipe(
        catchError(this.handleError) // then handle the error
      );
  }
  putStore(id: any, data: any) {
    const d = {
      data: {
        "app": data.app,
        "name": data.name,
        "description": data.description || "A completer...",
        "model": data.model,
        "json": JSON.parse(JSON.stringify(data.json)),
        "data_text": data.data_text,
        "data_html": data.data_html
      }
    }
    const url = `${this.rootStore}/${id}`;
    return this.http.put<any>(url, d)
      .pipe(
        catchError(this.handleError) // then handle the error
      );
  }
  delStore(id: any) {
    const url = `${this.rootStore}/${id}`;
    return this.http.delete<any>(url)
      .pipe(
        catchError(this.handleError) // then handle the error
      );
  }
  /**
   * Files management 
   */
  uploadFiles(files: any) {
    const url = `${this.rootApi}/upload`;
    const formData: FormData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i], files[i].name);
    }
    return this.http.post<any>(url, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      catchError(this.handleError) // then handle the error
    );
  }
  getUploaded(page?: number, limit?: number) {
    const perPage = limit || 100;
    const startPage = page || 0;
    const start = startPage * perPage;
    const url = `${this.rootApi}/upload/files`;
    return this.http.get<any>(url)
      .pipe(
        retry(3), // retry a failed request up to 3 times
        catchError(this.handleError) // then handle the error
      );
  }

  /**
   * Model management
   * @param name 
   * @returns 
   */
  getModel(name: string) {
    const url = `assets/models/${name}`;
    return this.http.get(url, { responseType: 'text' })
      .pipe(
        tap( // Log the result or error
          {
            next: (data) => {
              // console.log(name, data)
            }
            , error: (error) => console.error(name, error)
          }
        )
      );
  }

  /**
   * Geocoding with MAPBOX Api
   */
  getGeoFromAdresse(search_text: string) {
    const key = environment.mapbox.accessToken;
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${search_text}.json?types=place%2Cpostcode%2Caddress&language=fr&access_token=${key}`
    return this.http.get<any>(url)
      .pipe(
        retry(0), // retry a failed request up to 0 times
        catchError(this.handleError) // then handle the error
      );
  }
  /**
   * Mail service
   */
  sendMail(data: any) {
    const urlReq = `${this.rootApi}/mail/send`;
    // const urlReq = `${this.rootApi}/mail/send?to=${data.to}&cc=${data.cc}&subject=${data.subject}&html=${data.html}`;
    var options = {
      /* headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      } */
    };
    return this.http.post<any>(urlReq, data, options)
      .pipe(
        catchError(this.handleError) // then handle the error
      );
    /* return this.http.get<any>(
      urlReq, { observe: 'response' }); */
  }

  /**
   * Other Requests or functions
   */
  makeIntentionalError() {
    return this.http.get('not/a/real/url')
      .pipe(
        catchError(this.handleError)
      );
  }
  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Request rejected by server.'));
  }
}
