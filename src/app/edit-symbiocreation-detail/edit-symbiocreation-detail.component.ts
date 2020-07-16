import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Symbiocreation } from '../models/symbioTypes';
import { SymbiocreationService } from '../services/symbiocreation.service';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-symbiocreation-detail',
  templateUrl: './edit-symbiocreation-detail.component.html',
  styleUrls: ['./edit-symbiocreation-detail.component.css']
})
export class EditSymbiocreationDetailComponent implements OnInit {

  symbio: Symbiocreation;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  eventTime: any;
  isPrivate: boolean;
  eventTz: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public location: Location,
    private symbioService: SymbiocreationService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    const idSymbio = this.route.snapshot.paramMap.get('id');

    this.symbioService.getSymbiocreation(idSymbio).subscribe(
      symbio => {
        this.symbio = symbio;

        if (symbio.dateTime) {
          this.symbio.dateTime = new Date(symbio.dateTime);
          if (symbio.hasStartTime) {
            this.eventTime = moment(this.symbio.dateTime).tz('UTC').format('HH:mm');
          } 
        }

        this.isPrivate = symbio.visibility === 'private' ? true : false;
        //this.eventTz = {name: "Poland (+02:00)", nameValue: "Poland", timeValue: "+02:00", group: "Poland", abbr: "CEST"} as TZone;
        this.eventTz = 'UTC'; // sad :( because timezone selector does not accept ngModel
      }
    );

  }

  onSubmit() {
    this.symbio.visibility = this.isPrivate ? 'private' : 'public';

    if (this.symbio.dateTime) {
      let eventDateTime = moment.utc({year: this.symbio.dateTime.getFullYear(), 
                                    month: this.symbio.dateTime.getMonth(), 
                                    day: this.symbio.dateTime.getDate()});

      this.symbio.dateTime = eventDateTime.toDate();
      
      if (this.symbio.hasStartTime) {
        // dateTime object: UTC + timezone string
        this.symbio.dateTime.setUTCHours(this.eventTime.split(':')[0]);
        this.symbio.dateTime.setUTCSeconds(this.eventTime.split(':')[1]);

        this.symbio.timeZone = this.eventTz;
      }
    }

    this.symbioService.updateSymbiocreationInfo(this.symbio).subscribe(
      res =>  {
        this._snackBar.open('Se actualizó la simbiocreación.', 'ok', {
          duration: 2000,
        });
        this.location.back();
      }
    );

  }

  addTag(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.symbio.tags.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeTag(tag: string): void {
    const index = this.symbio.tags.indexOf(tag);

    if (index >= 0) {
      this.symbio.tags.splice(index, 1);
    }
  }

  addExtraUrl(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.symbio.extraUrls.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeExtraUrl(url: string): void {
    const index = this.symbio.extraUrls.indexOf(url);

    if (index >= 0) {
      this.symbio.extraUrls.splice(index, 1);
    }
  }

  addSDG(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.symbio.sdgs.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeSDG(sdg: string): void {
    const index = this.symbio.sdgs.indexOf(sdg);

    if (index >= 0) {
      this.symbio.sdgs.splice(index, 1);
    }
  }

  onTzSelected(tz) {
    this.eventTz = tz.nameValue;
  }

}
