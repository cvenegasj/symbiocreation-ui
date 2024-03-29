import { Injectable } from '@angular/core';
import { Node } from '../models/forceGraphTypes';
import { BehaviorSubject, ReplaySubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SharedService {

    private appUserSubject$ = new ReplaySubject<any>();
    appUser$ = this.appUserSubject$.asObservable();

    private isLoadingSubject$ = new BehaviorSubject<boolean>(null);
    isLoading$ = this.isLoadingSubject$.asObservable();

    //private sessionIsModeratorSubject$ = new BehaviorSubject<boolean>(false);
    //sessionIsModerator$ = this.sessionIsModeratorSubject$.asObservable();

    private isIdeaEditableSubject$ = new BehaviorSubject<boolean>(false);
    isIdeaEditable$ = this.isIdeaEditableSubject$.asObservable();

    private selectedNodesSubject$ = new BehaviorSubject<Node[]>(null);
    selectedNodes$ = this.selectedNodesSubject$.asObservable();

    private deselectedNodesSubject$ = new BehaviorSubject<Node[]>(null);
    deselectedNodes$ = this.deselectedNodesSubject$.asObservable();

    constructor() {}

    nextAppUser(user: any) {
        this.appUserSubject$.next(user);
    }

    nextIsLoading(isLoading: boolean) {
        this.isLoadingSubject$.next(isLoading);
    }

    //nextSessionIsModerator(isModerator: boolean) {
    //    this.sessionIsModeratorSubject$.next(isModerator);
    //}

    nextIsIdeaEditable(isEditable: boolean) {
        this.isIdeaEditableSubject$.next(isEditable);
    }

    nextSelectedNodes(nodes: Node[]) {
        this.selectedNodesSubject$.next(nodes);
    }
    
    nextDeselectedNodes(nodes: Node[]) {
        this.deselectedNodesSubject$.next(nodes);
    }
}