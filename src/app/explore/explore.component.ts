import { Component, OnInit, ViewChild } from '@angular/core';
import { Symbiocreation, Participant } from '../models/symbioTypes';
import { SymbiocreationService } from '../services/symbiocreation.service';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { SymbiocreationDetailComponent } from '../symbiocreation-detail/symbiocreation-detail.component';
import * as moment from 'moment';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css']
})
export class ExploreComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  symbiocreations: Symbiocreation[];
  filter: string = 'upcoming';
  totalCount: number;

  constructor(
    private symbioService: SymbiocreationService,
    private sharedService: SharedService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.sharedService.nextIsLoading(true);
    this.symbioService.countUpcomingPublicSymbiocreations().subscribe(count => this.totalCount = count);
    this.symbioService.getUpcomingPublicSymbiocreations(0).subscribe(
      symbios => {
        this.sharedService.nextIsLoading(false);
        this.symbiocreations = symbios;
      }
    );
  }

  filterChanged() {
    this.symbiocreations = null;
    this.paginator.firstPage();
    
    switch(this.filter) {
      case "upcoming": {
        this.sharedService.nextIsLoading(true);
        this.symbioService.countUpcomingPublicSymbiocreations().subscribe(count => this.totalCount = count);
        this.symbioService.getUpcomingPublicSymbiocreations(0).subscribe(
          symbios => {
            this.sharedService.nextIsLoading(false);
            this.symbiocreations = symbios;
            console.log(symbios);
          }
        );
        break;
      }
      case "past": {
        this.sharedService.nextIsLoading(true);
        this.symbioService.countPastPublicSymbiocreations().subscribe(count => this.totalCount = count);
        this.symbioService.getPastPublicSymbiocreations(0).subscribe(
          symbios => {
            this.sharedService.nextIsLoading(false);
            this.symbiocreations = symbios;
          }
        );
        break;
      }
      case "all": {
        this.sharedService.nextIsLoading(true);
        this.symbioService.countPublicSymbiocreations().subscribe(count => this.totalCount = count);
        this.symbioService.getAllPublicSymbiocreations(0).subscribe(
          symbios => {
            this.sharedService.nextIsLoading(false);
            this.symbiocreations = symbios;
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
      if (selected.length < 5 && p.role === 'moderator' && p.user.pictureUrl) selected.push(p);
    }
    // fill 5 spots w/ participants
    for (let p of participants) {
      if (selected.length < 5 && p.role !== 'moderator' && p.user.pictureUrl) selected.push(p);
    }
    return selected;
  }

  computeNMoreSpanWidth(totalLength: number, diplayedLength: number): number {
    return totalLength - diplayedLength > 0 ? 50 : 0;
  }

  getTimeAgo(lastModified: number): string {
    moment.locale('es');
    return moment(lastModified).fromNow();
  }

  onPageFired(event) {
    switch(this.filter) {
      case "upcoming": {
        this.sharedService.nextIsLoading(true);
        this.symbiocreations = null;
        this.symbioService.getUpcomingPublicSymbiocreations(event.pageIndex).subscribe(
          symbios => {
            this.sharedService.nextIsLoading(false);
            this.symbiocreations = symbios;
          }
        );
        break;
      }
      case "past": {
        this.sharedService.nextIsLoading(true);
        this.symbiocreations = null;
        this.symbioService.getPastPublicSymbiocreations(event.pageIndex).subscribe(
          symbios => {
            this.sharedService.nextIsLoading(false);
            this.symbiocreations = symbios;
          }
        );
        break;
      }
      case "all": {
        this.sharedService.nextIsLoading(true);
        this.symbiocreations = null;
        this.symbioService.getAllPublicSymbiocreations(event.pageIndex).subscribe(
          symbios => {
            this.sharedService.nextIsLoading(false);
            this.symbiocreations = symbios;
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

}
