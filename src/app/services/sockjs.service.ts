import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

import { Symbiocreation } from '../models/symbioTypes';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SockJSService {

    stompClient: any;
    private symbioSubject$ = new BehaviorSubject<Symbiocreation>(null);
    symbio$ = this.symbioSubject$.asObservable();

    constructor() {}

    connectToSymbioTopic(symbioId: string) {
        const ws = new SockJS(environment.socketUrl);
        this.stompClient = Stomp.over(ws);
        let that = this;
        this.stompClient.connect({}, function(frame) {
            that.stompClient.subscribe(`/topic/symbio/${symbioId}`, symbio => {
                if(symbio) {
                    console.log(symbio);
                    that.symbioSubject$.next(symbio);
                }
            });
        });
    }

}