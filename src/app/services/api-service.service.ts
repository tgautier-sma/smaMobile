import { HttpClient, HttpErrorResponse, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  full(method: string = "GET", url: string, data: any = null): Observable<any> {
    const headers = new HttpHeaders().set('content-type', 'application/json');
    switch (method) {
      case "GET":
        return this.http.get<any>(url, { 'headers': headers, observe: 'response' })
          .pipe(catchError(this.handleError));
        break;
      case "POST":
        return this.http.post<any>(url, data, { 'headers': headers, observe: 'response' })
          .pipe(catchError(this.handleError));
        break;
      case "PUT":
        return this.http.put<any>(url, data, { 'headers': headers, observe: 'response' })
          .pipe(catchError(this.handleError));
        break;
      case "DELETE":
        return this.http.delete<any>(url, { 'headers': headers, observe: 'response' })
          .pipe(catchError(this.handleError));
        break;
      default:
        return this.http.get<any>(url, { 'headers': headers, observe: 'response' })
          .pipe(catchError(this.handleError));
        break;
    }
  }
  get(query: string): Observable<any> {
    const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.http.get<any>(query, { 'headers': headers, observe: 'response' })
      .pipe(
        catchError(this.handleError)
      );
  }
  getBinary(fileName: string) {
    this.http.get(`assets/files/${fileName}`, { responseType: 'blob' })
      .subscribe((data: any) => {
        const reader: FileReader = new FileReader()
        reader.onload = (e: any) => {
          const bstr: string = e.target.result;
          return bstr;
        };
        reader.readAsBinaryString(data);
        // console.log(data);
        return data;
      });
  }
  private handleError(error: HttpErrorResponse) {
    console.log(error);
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
    return throwError(() => new Error(`${error}.`, { cause: error }));
  }

}
