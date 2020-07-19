import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { RSocketClient, JsonSerializer, IdentitySerializer } from 'rsocket-core';
import RSocketWebSocketClient from 'rsocket-websocket-client';
import { BehaviorSubject } from 'rxjs';

import { Symbiocreation } from '../models/symbioTypes';

@Injectable({
    providedIn: 'root',
})
export class RSocketService {

    private client: any;
    private symbioSubject$ = new BehaviorSubject<Symbiocreation>(null);
    symbio$ = this.symbioSubject$.asObservable();

    constructor() {
        //console.log(environment.socketUrl);
    }
     
    connectToSymbio(id: string) {
        this.client = new RSocketClient({
            serializers: {
                data: JsonSerializer,
                metadata: IdentitySerializer
              },
            setup: {
                // ms btw sending keepalive to server
                keepAlive: 60000,
                // ms timeout if no keepalive response
                lifetime: 180000,
                dataMimeType: 'application/json',
                metadataMimeType: 'message/x.rsocket.routing.v0',
              },
            transport: new RSocketWebSocketClient({url: environment.socketUrl}),
        });
        
        this.client.connect().then(socket => {
            console.log('connected to RSocket!');
            socket
              .requestStream({
                data: {
                    //id: id
                },
                metadata: String.fromCharCode(`listen.symbio.${id}`.length) + `listen.symbio.${id}`
              })
              .subscribe({
                onComplete: () => {
                  console.log('Request-stream completed');
                  this.disconnect();
                  this.connectToSymbio(id);
                },
                onError: error => { 
                  console.error(`Request-stream error: ${error.message}`);
                  this.disconnect();
                  this.connectToSymbio(id);
                },
                onNext: payload => {
                  //console.log('%s', payload.data);
                  this.symbioSubject$.next(payload.data);
                },
                onSubscribe: sub => sub.request(2147483647),
              });
          });

     }

     disconnect() {
        if (this.client) this.client.close();
        this.client = null;
     }

}