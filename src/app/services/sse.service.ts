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

    private evtSource: EventSource;

    constructor() {}

    listenFromSymbio(id: string) {
        this.evtSource = new EventSource(`${environment.resApiUrl}/sse-symbios/${id}`);
        let that = this;
        this.evtSource.onmessage = function(event) {
            //console.log(event);
            that.symbioSubject$.next(JSON.parse(event.data));
        }

        this.evtSource.onerror = function (error) {
            console.error('Error in evtSource: ', error);
            this.close();
        };
    }

    stopListening() {
        if (this.evtSource) this.evtSource.close();
        this.evtSource = null;
    }

}