import { Injectable } from '@angular/core';
import { Node } from '../models/forceGraphTypes';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SharedService {

    private isLoadingSubject$ = new BehaviorSubject<boolean>(null);
    isLoading$ = this.isLoadingSubject$.asObservable();

    private nodeSubject$ = new BehaviorSubject<Node>(null);
    node$ = this.nodeSubject$.asObservable();

    private roleSubject$ = new BehaviorSubject<string>(null);
    role$ = this.roleSubject$.asObservable();

    constructor() {}

    nextIsLoading(isLoading: boolean) {
        this.isLoadingSubject$.next(isLoading);
    }

    nextNode(node: Node) {
        this.nodeSubject$.next(node);
    }

    nextRole(role: string) {
        this.roleSubject$.next(role);
    }

}