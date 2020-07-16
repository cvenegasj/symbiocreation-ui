import { Component, OnInit } from '@angular/core';
import { Symbiocreation } from '../models/symbioTypes';
import { SymbiocreationService } from '../services/symbiocreation.service';
import { AuthService } from '../services/auth.service';
import { tap, concatMap } from 'rxjs/operators';
import { UserService } from '../services/user.service';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

import { environment } from '../../environments/environment';
import { EditGroupNameDialogComponent } from '../edit-group-name-dialog/edit-group-name-dialog.component';
import { SymbiocreationDetailComponent } from '../symbiocreation-detail/symbiocreation-detail.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  environment = environment;
  symbiocreations: Symbiocreation[];
  isModerator: boolean[];

  constructor(
    private symbioService: SymbiocreationService,
    private userService: UserService,
    private auth: AuthService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
    ) {
    this.symbiocreations = [];
    this.isModerator = [];
  }

  ngOnInit(): void {
    this.auth.userProfile$.pipe(
      concatMap(user => this.userService.getUserByEmail(user.email)),
      concatMap(u => this.symbioService.getMySymbiocreations(u.id))
    ).subscribe(symbios => {
      this.symbiocreations = symbios;
      this.createIsModeratorList();
      console.log('Moderator of: ', this.isModerator);
    });
  }

  createIsModeratorList() {
    for (let s of this.symbiocreations) {
      this.isModerator.push(false);
    }

    this.auth.userProfile$.subscribe(u => {
        for (let i = 0; i < this.symbiocreations.length; i++) {
          for (let j = 0; j < this.symbiocreations[i].participants.length; j++) {
            if (this.symbiocreations[i].participants[j].role === 'moderator') {
              this.isModerator[i] = true;
            }
          }
        }
    });
  }

  deleteSymbiocreation(id: string) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
        confirmationColor: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        this.symbioService.deleteSymbiocreation(id).subscribe(
          res => {
            this.symbiocreations = this.symbiocreations.filter(s => s.id !== id);
          });
      }
    });
  }

  changeNameSymbiocreation(symbio: Symbiocreation) {
    const dialogRef = this.dialog.open(EditGroupNameDialogComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(name => {
      if (name) {
        symbio.name = name;
        this.symbioService.updateSymbiocreationName(symbio).subscribe();
      }
    });
  }

  viewSymbiocreationDetail(symbio: Symbiocreation, isModerator: boolean) {
    const dialogRef = this.dialog.open(SymbiocreationDetailComponent, {
      width: '600px',
      data: {
        symbio: symbio,
        isModerator: isModerator
      }
    });

    dialogRef.afterClosed().subscribe();
  }

}
