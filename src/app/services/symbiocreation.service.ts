import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, concatMap } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { Symbiocreation, Participant } from '../models/symbioTypes';
import { Node } from '../models/forceGraphTypes';

@Injectable({
    providedIn: 'root',
})
export class SymbiocreationService {

    apiUrl: string = environment.resApiUrl;
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

    // find all public symbiocreations
    getAllPublicSymbiocreations(): Observable<Symbiocreation[]> {
        let API_URL = `${this.apiUrl}/symbiocreations/getAllPublic`;
        return this.http.get<Symbiocreation[]>(API_URL);
    }

    // find all upcoming symbiocreations
    getUpcomingPublicSymbiocreations(): Observable<Symbiocreation[]> {
        let API_URL = `${this.apiUrl}/symbiocreations/getUpcomingPublic`;
        return this.http.get<Symbiocreation[]>(API_URL);
    }

    // find all past symbiocreations
    getPastPublicSymbiocreations(): Observable<Symbiocreation[]> {
        let API_URL = `${this.apiUrl}/symbiocreations/getPastPublic`;
        return this.http.get<Symbiocreation[]>(API_URL);
    }

    // update
    /*updateSymbiocreation(data: Symbiocreation): Observable<Symbiocreation> {
        let API_URL = `${this.apiUrl}/symbiocreations`;
        return this.http.put<Symbiocreation>(API_URL, data, {headers: this.headers})
            .pipe(
                catchError(this.error)
            );
    }*/

    // update name
    updateSymbiocreationName(data: Symbiocreation): Observable<void> {
        let API_URL = `${this.apiUrl}/symbiocreations/${data.id}/updateName`;
        return this.http.put<void>(API_URL, data, {headers: this.headers})
            .pipe(
                catchError(this.error)
            );
    }

    // update info
    updateSymbiocreationInfo(data: Symbiocreation): Observable<void> {
        let API_URL = `${this.apiUrl}/symbiocreations/${data.id}/updateInfo`;
        return this.http.put<void>(API_URL, data, {headers: this.headers})
            .pipe(
                catchError(this.error)
            );
    }

    // delete
    deleteSymbiocreation(id: string): Observable<void> {
        let API_URL = `${this.apiUrl}/symbiocreations/${id}`;
        return this.http.delete<void>(API_URL)
            .pipe(
                catchError(this.error)
            );
    }

    // change idea of node
    updateNodeIdea(symbioId: string, newNode: Node): Observable<Symbiocreation> {
        newNode.parent = null;
        
        let API_URL = `${this.apiUrl}/symbiocreations/${symbioId}/updateNodeIdea`;
        return this.http.put<Symbiocreation>(API_URL, newNode, {headers: this.headers})
            .pipe(
                catchError(this.error)
            );
    }

    // change name of node
    updateNodeName(symbioId: string, newNode: Node): Observable<Symbiocreation> {
        newNode.parent = null;

        
        let API_URL = `${this.apiUrl}/symbiocreations/${symbioId}/updateNodeName`;
        return this.http.put<Symbiocreation>(API_URL, newNode, {headers: this.headers})
            .pipe(
                catchError(this.error)
            );
    }

    // find node by id
    getNodeById(symbioId: string, nodeId: string): Observable<Node> {
        let API_URL = `${this.apiUrl}/symbiocreations/${symbioId}/getNode/${nodeId}`;
        return this.http.get<Node>(API_URL);
    }

    createParticipant(symbioId: string, p: Participant): Observable<Symbiocreation> {
        let API_URL = `${this.apiUrl}/symbiocreations/${symbioId}/createParticipant`;
        return this.http.post<Symbiocreation>(API_URL, p)
            .pipe(
                catchError(this.error)
            );
    }

    /*
    createGroupNode(symbioId: string, n: Node): Observable<Symbiocreation> {
        let API_URL = `${this.apiUrl}/symbiocreations/${symbioId}/createGroupNode`;
        return this.http.post<Symbiocreation>(API_URL, n)
            .pipe(
                catchError(this.error)
            );
    }
    */

    // nextLevelNode has name 
    createNextLevelGroup(symbioId: string, childNodeId: string, nextLevelNode: Node): Observable<Symbiocreation> {
        let API_URL = `${this.apiUrl}/symbiocreations/${symbioId}/createNextLevelGroup/${childNodeId}`;
        return this.http.post<Symbiocreation>(API_URL, nextLevelNode)
            .pipe(
                catchError(this.error)
            );
    }

    setParentNode(symbioId: string, childId: string, parentId: string): Observable<Symbiocreation> {
        let API_URL = `${this.apiUrl}/symbiocreations/${symbioId}/setParentNode/${childId}/${parentId}`;
        return this.http.get<Symbiocreation>(API_URL)
            .pipe(
                catchError(this.error)
            );
    }

    deleteNode(symbioId: string, nodeId: string): Observable<Symbiocreation> {
        let API_URL = `${this.apiUrl}/symbiocreations/${symbioId}/deleteNode/${nodeId}`;
        return this.http.delete<Symbiocreation>(API_URL)
            .pipe(
                catchError(this.error)
            );
    }

    // participant has u_id and new role
    updateParticipantRole(symbioId: string, participant: Participant): Observable<Symbiocreation> {
        let API_URL = `${this.apiUrl}/symbiocreations/${symbioId}/updateParticipantRole`;
        return this.http.put<Symbiocreation>(API_URL, participant, {headers: this.headers})
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