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
        let API_URL = `${this.apiUrl}/analytics/counts-summary-admin`;
        return this.http.get<number>(API_URL);
    }

    // get ordered array of objects with all dates and number of symbios created on each date
    getSymbioCountsDaily(): Observable<any> {
        let API_URL = `${this.apiUrl}/analytics/symbio-counts-daily-chart-admin`;
        return this.http.get<any>(API_URL);
    }

    // get ordered array of objects with all dates and number of users created on each date
    getUserCountsDaily(): Observable<any> {
        let API_URL = `${this.apiUrl}/analytics/user-counts-daily-chart-admin`;
        return this.http.get<any>(API_URL);
    }

    // get AWS Comprehend results of topic modeling with ideas data
    getTrendingTopicsIdeas(): Observable<any> {
        let API_URL = `${this.apiUrl}/analytics/trending-topics-ideas-admin`;
        return this.http.get<any>(API_URL);
    }

    // get ordered array of objects with ranked symbiocreations
    getTopSymbiocreations(): Observable<any> {
        let API_URL = `${this.apiUrl}/analytics/top-symbiocreations-admin`;
        return this.http.get<any>(API_URL);
    }

    // get ordered array of objects with ranked users (admin access)
    getTopUsers(): Observable<any> {
        let API_URL = `${this.apiUrl}/analytics/top-users-admin`;
        return this.http.get<any>(API_URL);
    }

    // get ordered array of objects with ranked users (public access)
    getUsersRankingPublic(): Observable<any> {
        let API_URL = `${this.apiUrl}/analytics/ranking-users-public`;
        return this.http.get<any>(API_URL);
    }

    // get map with summary counts and stats of user
    getCountsSummaryUser(userId: string): Observable<any> {
        let API_URL = `${this.apiUrl}/analytics/counts-summary-user/${userId}`;
        return this.http.get<any>(API_URL);
    }

    // get map with summary counts and stats of symbiocreation
    getCountsSummarySymbiocreation(symbiocreationId: string): Observable<any> {
        let API_URL = `${this.apiUrl}/analytics/counts-summary-symbiocreation/${symbiocreationId}`;
        return this.http.get<any>(API_URL);
    }

    // get users ranking (ordered array) of a symbiocreation
    getUsersRankingSymbiocreation(symbiocreationId: string): Observable<any> {
        let API_URL = `${this.apiUrl}/analytics/users-ranking-symbiocreation/${symbiocreationId}`;
        return this.http.get<any>(API_URL);
    }

    // get the trends in the ideas of a symbiocreation
    getTrendsInSymbiocreation(symbiocreationId: string): Observable<string[]> {
        let API_URL = `${this.apiUrl}/analytics/trends-symbiocreation/${symbiocreationId}`;
        return this.http.get<string[]>(API_URL);
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