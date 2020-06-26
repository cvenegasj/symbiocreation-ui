import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, concatMap } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpClientJsonpModule } from '@angular/common/http';

import { Symbiocreation } from '../models/symbioTypes';
import { Node } from '../models/forceGraphTypes';

@Injectable({
    providedIn: 'root',
})
export class SymbiocreationService {

    apiUrl: string = 'http://localhost:8080';
    headers = new HttpHeaders().set('Content-Type', 'application/json');

    constructor(
        private http: HttpClient
    ) { }

    // create
    createSymbiocreation(data: Symbiocreation): Observable<Symbiocreation> {
        let API_URL = `${this.apiUrl}/symbiocreations`;
        return this.http.post<Symbiocreation>(API_URL, data)
            .pipe(
                catchError(this.error)
            );
    }

    // find
    getSymbiocreation(id: string): Observable<Symbiocreation> {
        let API_URL = `${this.apiUrl}/symbiocreations/${id}`;
        return this.http.get<Symbiocreation>(API_URL);
    }

    // find mine
    // TODO: shouldn't include any userId 
    getMySymbiocreations(userId: string): Observable<Symbiocreation[]> {
        /*return this.auth.userProfile$.pipe(
            concatMap(u => {
                console.log(u);
                let API_URL = `${this.apiUrl}/symbiocreations/getMine/${u.email}`;
                return this.http.get<Symbiocreation[]>(API_URL);
            })
        );*/
        let API_URL = `${this.apiUrl}/symbiocreations/getMine/${userId}`;
        return this.http.get<Symbiocreation[]>(API_URL);
    }

    // update
    updateSymbiocreation(data: Symbiocreation): Observable<Symbiocreation> {
        let API_URL = `${this.apiUrl}/symbiocreations`;
        return this.http.put<Symbiocreation>(API_URL, data, {headers: this.headers})
            .pipe(
                catchError(this.error)
            );
    }

    // change idea of node
    updateNodeIdea(symbioId: string, newNode: Node): Observable<Symbiocreation> {
        let API_URL = `${this.apiUrl}/symbiocreations/${symbioId}/updateNodeIdea`;
        return this.http.put<Symbiocreation>(API_URL, newNode, {headers: this.headers})
            .pipe(
                catchError(this.error)
            );
    }

    /*
    // change name of node
    updateNodeName(idSymbio: string, newNode: Node): Observable<Symbiocreation> {
        let API_URL = `${this.apiUrl}/symbiocreations/${idSymbio}/updateNodeName`;
        return this.http.put<Symbiocreation>(API_URL, newNode, {headers: this.headers})
            .pipe(
                catchError(this.error)
            );
    } */

    // find node by id
    getNodeById(symbioId: string, nodeId: string): Observable<Node> {
        let API_URL = `${this.apiUrl}/symbiocreations/${symbioId}/getNode/${nodeId}`;
        return this.http.get<Node>(API_URL);
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