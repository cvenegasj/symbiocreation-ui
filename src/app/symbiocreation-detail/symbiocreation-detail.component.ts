import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { Symbiocreation } from '../models/symbioTypes';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SymbiocreationService } from '../services/symbiocreation.service';

import * as moment from 'moment-timezone';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { Router } from '@angular/router';
import { UntypedFormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-symbiocreation-detail',
  templateUrl: './symbiocreation-detail.component.html',
  styleUrls: ['./symbiocreation-detail.component.css']
})
export class SymbiocreationDetailComponent implements OnInit {

  editPlace: boolean;
  editDate: boolean;
  editTime: boolean;
  editDesc: boolean;
  editInfoUrl: boolean;
  editTags: boolean;
  editExtraUrls: boolean;
  editSDGs: boolean;

  eventDate: moment.Moment;
  eventTime: any;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  sdgCtrl = new UntypedFormControl();
  filteredSDGs: Observable<string[]>;
  allSDGs: string[] = ['1 Fin de la pobreza', '2 Hambre cero', '3 Salud y bienestar', 
    '4 Educación de calidad', '5 Igualdad de género', '6 Agua limpia y saneamiento', 
    '7 Energía asequible y no contaminante', '8 Trabajo decente y crecimiento económico', '9 Industria, innovación e infraestructura',
    '10 Reducción de las desigualdades', '11 Ciudades y comunidades sostenibles', '12 Producción y consumos responsables',
    '13 Acción por el clima', '14 Vida submarina', '15 Vida de ecosistemas terrestres',
    '16 Paz, justicia e instituciones sólidas', '17 Alianzas para lograr los objetivos'];

  @ViewChild('sdgInput') sdgInput: ElementRef<HTMLInputElement>;

  constructor(
    public dialogRef: MatDialogRef<SymbiocreationDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private symbioService: SymbiocreationService,
    private router: Router,
  ) {
    this.filteredSDGs = this.sdgCtrl.valueChanges.pipe(
      startWith(null),
      map((sdg: string | null) => sdg ? this._filter(sdg) : this.allSDGs.slice()));
  }

  ngOnInit(): void {
    this.eventTime = '12:00';
  }

  editSymbiocreationInfo(symbio: Symbiocreation) {
    this.dialogRef.close();
    this.router.navigateByUrl(`/edit/${symbio.id}`);
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
    let newDateTime = this.eventDate.toDate();
    newDateTime.setUTCHours((new Date(this.data.symbio.dateTime)).getUTCHours());
    newDateTime.setUTCMinutes((new Date(this.data.symbio.dateTime)).getUTCMinutes());

    this.data.symbio.dateTime = newDateTime;

    this.symbioService.updateSymbiocreationInfo(this.data.symbio).subscribe();
    this.editDate = false;
  }

  saveTime() {
    let newDateTime = new Date(this.data.symbio.dateTime);
    newDateTime.setUTCHours(this.eventTime.split(":")[0]);
    newDateTime.setUTCMinutes(this.eventTime.split(":")[1]);

    this.data.symbio.dateTime = newDateTime;

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

  selected(event: MatAutocompleteSelectedEvent): void {
    this.data.symbio.sdgs.push(event.option.viewValue);
    this.sdgInput.nativeElement.value = '';
    this.sdgCtrl.setValue(null);
  }

  removeSDG(sdg: string): void {
    const index = this.data.symbio.sdgs.indexOf(sdg);

    if (index >= 0) {
      this.data.symbio.sdgs.splice(index, 1);
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allSDGs.filter(sdg => sdg.toLowerCase().indexOf(filterValue) >= 0);
  }

}
