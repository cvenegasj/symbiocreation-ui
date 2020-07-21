import { Component, OnInit } from '@angular/core';
import { Symbiocreation } from '../models/symbioTypes';
import { SymbiocreationService } from '../services/symbiocreation.service';
import { AuthService } from '../services/auth.service';
import { tap, concatMap } from 'rxjs/operators';
import { UserService } from '../services/user.service';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  symbiocreations: Symbiocreation[];
  isModeratorList: boolean[];

  isGridViewOn: boolean;

  constructor(
    private symbioService: SymbiocreationService,
    private userService: UserService,
    private auth: AuthService,
    public sharedService: SharedService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
    ) {
    //this.symbiocreations = [];
    this.isModeratorList = [];
  }

  ngOnInit(): void {
    this.sharedService.nextIsLoading(true);

    this.auth.userProfile$.pipe(
      concatMap(user => this.userService.getUserByEmail(user.email)),
      tap(u => this.isGridViewOn = u.isGridViewOn),
      concatMap(u => this.symbioService.getMySymbiocreations(u.id))
    ).subscribe(
      symbios => {
        this.sharedService.nextIsLoading(false);

        this.symbiocreations = symbios;
        // order has to be done in frontend bc of rx backend ?????
        this.symbiocreations.sort((a, b) => a.lastModified > b.lastModified ? -1 : (a.lastModified < b.lastModified ? 1 : 0));

        this.createIsModeratorList();
    });
  }

  createIsModeratorList() {
    for (let s of this.symbiocreations) {
      this.isModeratorList.push(false);
    }

    this.auth.userProfile$.subscribe(u => {

        for (let i = 0; i < this.symbiocreations.length; i++) {
          for (let j = 0; j < this.symbiocreations[i].participants.length; j++) {
            if (this.symbiocreations[i].participants[j].user.email === u.email 
              && this.symbiocreations[i].participants[j].role === 'moderator') {
              this.isModeratorList[i] = true;
              break;
            }
          }
        }
    });
  }

  toggleViewMode() {
    this.isGridViewOn = !this.isGridViewOn;

    this.auth.userProfile$.pipe(
      concatMap(usrProfile => this.userService.getUserByEmail(usrProfile.email)),
      concatMap(user => {
        user.isGridViewOn = this.isGridViewOn;
        return this.userService.updateUser(user);
      })
    ).subscribe();
  }

}
