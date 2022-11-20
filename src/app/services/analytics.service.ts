import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
//import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AnalyticsService {

    apiUrl: string = environment.resApiUrl;
    headers = new HttpHeaders().set('Content-Type', 'application/json');

    constructor(
        private http: HttpClient
    ) { }

    // get total current counts of symbiocreations, users, and ideas
    getCountsSummary(): Observable<number> {
        let API_URL = `${this.apiUrl}/analytics/counts-summary`;
        return this.http.get<number>(API_URL);
    }

    // get ordered array of objects with all dates and number of symbios created on each date
    getSymbioCountsDaily(): Observable<any> {
        let API_URL = `${this.apiUrl}/analytics/symbio-counts-daily-chart`;
        return this.http.get<any>(API_URL);
    }

    // get ordered array of objects with all dates and number of users created on each date
    getUserCountsDaily(): Observable<any> {
        let API_URL = `${this.apiUrl}/analytics/user-counts-daily-chart`;
        return this.http.get<any>(API_URL);
    }

    // get AWS Comprehend results of topic modeling with ideas data
    getTrendingTopicsIdeas(): Observable<any> {
        let API_URL = `${this.apiUrl}/analytics/trending-topics-ideas`;
        return this.http.get<any>(API_URL);
    }

    // get ordered array of objects with ranked symbiocreations
    getTopSymbiocreations(): Observable<any> {
        let API_URL = `${this.apiUrl}/analytics/top-symbiocreations`;
        return this.http.get<any>(API_URL);
    }

    // get ordered array of objects with ranked users
    getTopUsers(): Observable<any> {
        let API_URL = `${this.apiUrl}/analytics/top-users`;
        return this.http.get<any>(API_URL);
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