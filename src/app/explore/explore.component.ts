import { Component, OnInit } from '@angular/core';
import { Symbiocreation, Participant } from '../models/symbioTypes';
import { SymbiocreationService } from '../services/symbiocreation.service';
import { MatDialog } from '@angular/material/dialog';
import { SymbiocreationDetailComponent } from '../symbiocreation-detail/symbiocreation-detail.component';
import * as moment from 'moment';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css']
})
export class ExploreComponent implements OnInit {

  symbiocreations: Symbiocreation[];

  constructor(
    private symbioService: SymbiocreationService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.symbioService.getUpcomingPublicSymbiocreations().subscribe(
      symbios => {
        this.symbiocreations = symbios;
        //this.symbiocreations.sort((a, b) => a.lastModified > b.lastModified ? -1 : (a.lastModified < b.lastModified ? 1 : 0));
      }
    );
  }

  filterSelected(value: string) {
    switch(value) {
      case "upcoming": {
        this.symbioService.getUpcomingPublicSymbiocreations().subscribe(
          symbios => {
            this.symbiocreations = symbios;
            //this.symbiocreations.sort((a, b) => a.lastModified > b.lastModified ? -1 : (a.lastModified < b.lastModified ? 1 : 0));
          }
        );
        break;
      }
      case "past": {
        this.symbioService.getPastPublicSymbiocreations().subscribe(
          symbios => {
            this.symbiocreations = symbios;
            //this.symbiocreations.sort((a, b) => a.lastModified > b.lastModified ? -1 : (a.lastModified < b.lastModified ? 1 : 0));
          }
        );
        break;
      }
      case "all": {
        this.symbioService.getAllPublicSymbiocreations().subscribe(
          symbios => {
            this.symbiocreations = symbios;
            //this.symbiocreations.sort((a, b) => a.lastModified > b.lastModified ? -1 : (a.lastModified < b.lastModified ? 1 : 0));
          }
        );
        break;
      }
      default: { 
        console.log("Invalid choice"); 
        break;              
     } 
    }
  }

  openSymbioDetailDialog(s: Symbiocreation) {
    const dialogRef = this.dialog.open(SymbiocreationDetailComponent, {
      width: '600px',
      data: {
        symbio: s,
      }
    });

    dialogRef.afterClosed().subscribe();
  }

  getParticipantsToDisplay(participants: Participant[]): Participant[] {
    let selected: Participant[] = [];
    // include moderators w picture
    for (let p of participants) {
      if (p.role === 'moderator' && p.user.pictureUrl) selected.push(p);
    }

    // fill 5 spots w/ participants
    for (let p of participants) {
      if (selected.length < 5 && p.role !== 'moderator' && p.user.pictureUrl) selected.push(p);
    }

    //console.log(selected);
    return selected;
  }

  computeNMoreSpanWidth(totalLength: number, diplayedLength: number): number {
    return totalLength - diplayedLength > 0 ? 50 : 0;
  }

  getTimeAgo(lastModified: number): string {
    moment.locale('es');
    return moment(lastModified).fromNow();
  }

}
