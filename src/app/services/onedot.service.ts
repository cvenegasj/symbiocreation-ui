import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { OneDot, OneDotParticipant } from '../models/oneDotTypes';

@Injectable({
    providedIn: 'root',
})
export class OneDotService {

    apiUrl: string = environment.resApiUrl;
    headers = new HttpHeaders().set('Content-Type', 'application/json');

    constructor(
        private http: HttpClient
    ) { }

    // create
    createOneDot(data: OneDot): Observable<OneDot> {
        let API_URL = `${this.apiUrl}/onedot`;
        return this.http.post<OneDot>(API_URL, data)
            .pipe(
                catchError(this.error)
            );
    }

    // find
    getOneDot(id: string): Observable<OneDot> {
        let API_URL = `${this.apiUrl}/onedot/${id}`;
        return this.http.get<OneDot>(API_URL);
    }

    // update grid status
    updateGridStatus(data: OneDot): Observable<void> {
        let API_URL = `${this.apiUrl}/onedot/${data.id}/updateGrid`;
        return this.http.patch<void>(API_URL, data, {headers: this.headers})
            .pipe(
                catchError(this.error)
            );
    }

    createParticipant(oneDotId: string, p: OneDotParticipant): Observable<OneDot> {
        let API_URL = `${this.apiUrl}/onedot/${oneDotId}/createParticipant`;
        return this.http.post<OneDot>(API_URL, p)
            .pipe(
                catchError(this.error)
            );
    }



    // Handle Errors 
    error(error: HttpErrorResponse) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            errorMessage = error.error.message;
        } else {
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        console.log(errorMessage);
        return throwError(errorMessage);
    }
}