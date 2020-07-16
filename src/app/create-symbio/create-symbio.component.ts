import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Symbiocreation, Participant } from '../models/symbioTypes';
import { Node } from '../models/forceGraphTypes';
import { SymbiocreationService } from '../services/symbiocreation.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../services/auth.service';
import { concatMap } from 'rxjs/operators';
import { UserService } from '../services/user.service';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
//import * as moment from 'moment';
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-create-symbio',
  templateUrl: './create-symbio.component.html',
  styleUrls: ['./create-symbio.component.css']
})
export class CreateSymbioComponent implements OnInit {

  model: Symbiocreation;

  isPrivate: boolean;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  eventTime: any;
  eventTz: string;

  detailsOpened: boolean;

  constructor(
    private symbioService: SymbiocreationService,
    private userService: UserService,
    private auth: AuthService,
    private router: Router,
    private _snackBar: MatSnackBar
    ) { }

  ngOnInit(): void {
    this.model = { name: '', hasStartTime: false, enabled: true, participants: [], tags: [], extraUrls:[], sdgs: [] };
    this.isPrivate = false;
    this.eventTime = '12:00';
    this.eventTz = 'UTC';

    this.detailsOpened = false;
  }

  onSubmit() {
    this.model.participants = [];
    this.model.graph = [];

    this.model.visibility = this.isPrivate ? 'private' : 'public';

    if (this.model.dateTime) {
      let eventDateTime = moment.utc({year: this.model.dateTime.getFullYear(), 
                                    month: this.model.dateTime.getMonth(), 
                                    day: this.model.dateTime.getDate()});

      this.model.dateTime = eventDateTime.toDate();
      
      if (this.model.hasStartTime) {
        // dateTime object: UTC + timezone string
        this.model.dateTime.setUTCHours(this.eventTime.split(':')[0]);
        this.model.dateTime.setUTCSeconds(this.eventTime.split(':')[1]);

        this.model.timeZone = this.eventTz;
      }
    }
    
    // add creator as participant w role 'moderator'
    this.auth.userProfile$.pipe(
      concatMap(user => this.userService.getUserByEmail(user.email)),
      concatMap(u => {
        this.model.participants.push({u_id: u.id, role: 'moderator'} as Participant); // participant
        this.model.graph.push({u_id: u.id, name: u.name} as Node); // node

        return this.symbioService.createSymbiocreation(this.model);
      })
    ).subscribe(res => {
      this._snackBar.open('Se creó la simbiocreación.', 'ok', {
        duration: 2000,
      });
      this.router.navigate(['/symbiocreation', res.id]);
    });
  }

  addTag(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.model.tags.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeTag(tag: string): void {
    const index = this.model.tags.indexOf(tag);

    if (index >= 0) {
      this.model.tags.splice(index, 1);
    }
  }

  addExtraUrl(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.model.extraUrls.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeExtraUrl(url: string): void {
    const index = this.model.extraUrls.indexOf(url);

    if (index >= 0) {
      this.model.extraUrls.splice(index, 1);
    }
  }

  addSDG(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.model.sdgs.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeSDG(sdg: string): void {
    const index = this.model.sdgs.indexOf(sdg);

    if (index >= 0) {
      this.model.sdgs.splice(index, 1);
    }
  }

  onTzSelected(tz) {
    this.eventTz = tz.nameValue;
  }

}
