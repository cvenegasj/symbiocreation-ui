import { Component, OnInit, Inject } from '@angular/core';
import { Symbiocreation } from '../models/symbioTypes';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { EditSymbiocreationDetailComponent } from '../edit-symbiocreation-detail/edit-symbiocreation-detail.component';
import { SymbiocreationService } from '../services/symbiocreation.service';

import * as moment from 'moment-timezone';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { Router } from '@angular/router';

@Component({
  selector: 'app-symbiocreation-detail',
  templateUrl: './symbiocreation-detail.component.html',
  styleUrls: ['./symbiocreation-detail.component.css']
})
export class SymbiocreationDetailComponent implements OnInit {

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  editPlace: boolean;
  editDate: boolean;
  editTime: boolean;
  editDesc: boolean;
  editInfoUrl: boolean;
  editTags: boolean;
  editExtraUrls: boolean;
  editSDGs: boolean;

  eventDate: Date;
  eventTime: any;

  constructor(
    public dialogRef: MatDialogRef<SymbiocreationDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private symbioService: SymbiocreationService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.eventTime = '12:00';
  }

  editSymbiocreationInfo(symbio: Symbiocreation) {
    this.dialogRef.close();
    this.router.navigateByUrl(`/edit/${symbio.id}`);
  }

  showEditButton(btn) {
    if (this.data.isModerator) btn.hidden = false;
  }

  hideEditButton(btn) {
    if (this.data.isModerator) btn.hidden = true;
  }

  saveGeneral() {
    this.symbioService.updateSymbiocreationInfo(this.data.symbio).subscribe();
    this.editPlace = false;
    this.editDesc = false;
    this.editInfoUrl = false;
    this.editTags = false;
    this.editExtraUrls = false;
    this.editSDGs = false;
  }

  saveDate() {
    const prevDate = new Date(this.data.symbio.dateTime); // json property contains milliseconds

    let eventDateTime = moment.utc({ year: this.eventDate.getFullYear(), 
                                    month: this.eventDate.getMonth(), 
                                    day: this.eventDate.getDate(),
                                    hours: prevDate.getUTCHours(),
                                    minutes: prevDate.getUTCMinutes() });

    this.data.symbio.dateTime = eventDateTime.toDate();

    this.symbioService.updateSymbiocreationInfo(this.data.symbio).subscribe();
    this.editDate = false;
  }

  saveTime() {
    const prevDate = new Date(this.data.symbio.dateTime);

    let eventDateTime = moment.utc({ year: prevDate.getFullYear(), 
                                    month: prevDate.getMonth(), 
                                    day: prevDate.getDate(),
                                    hours: this.eventTime.split(":")[0],
                                    minutes: this.eventTime.split(":")[1] });

    this.data.symbio.dateTime = eventDateTime.toDate();

    this.symbioService.updateSymbiocreationInfo(this.data.symbio).subscribe();
    this.editTime = false;
  }

  addTag(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.data.symbio.tags.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeTag(tag: string): void {
    const index = this.data.symbio.tags.indexOf(tag);

    if (index >= 0) {
      this.data.symbio.tags.splice(index, 1);
    }
  }

  addExtraUrl(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.data.symbio.extraUrls.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeExtraUrl(url: string): void {
    const index = this.data.symbio.extraUrls.indexOf(url);

    if (index >= 0) {
      this.data.symbio.extraUrls.splice(index, 1);
    }
  }

  addSDG(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.data.symbio.sdgs.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeSDG(sdg: string): void {
    const index = this.data.symbio.sdgs.indexOf(sdg);

    if (index >= 0) {
      this.data.symbio.sdgs.splice(index, 1);
    }
  }

}
