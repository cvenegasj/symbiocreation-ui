import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';

import { Symbiocreation } from '../models/symbioTypes';

@Injectable({
    providedIn: 'root',
})
export class SSEService {

    private symbioSubject$ = new BehaviorSubject<Symbiocreation>(null);
    symbio$ = this.symbioSubject$.asObservable();

    constructor() {}

    receiveUpdatesFromSymbio(id: string) {
        let evtSource = new EventSource(`${environment.resApiUrl}/sse-symbios/${id}`);
        let that = this;
        evtSource.onmessage = function(event) {
            //console.log(event);
            that.symbioSubject$.next(JSON.parse(event.data));
        }
    }

}