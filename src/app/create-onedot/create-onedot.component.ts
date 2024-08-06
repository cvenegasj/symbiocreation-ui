import { Component, OnInit } from '@angular/core';
import { OneDot, OneDotParticipant } from '../models/oneDotTypes';
import { OneDotService } from '../services/onedot.service';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';

import { concatMap } from 'rxjs/operators';
import { Location } from '@angular/common';

@Component({
  selector: 'app-create-onedot',
  templateUrl: './create-onedot.component.html',
  styleUrls: ['./create-onedot.component.css']
})
export class CreateOnedotComponent implements OnInit {

  model: any;

  constructor(
    private oneDotService: OneDotService,
    private userService: UserService,
    private auth: AuthService,
    private router: Router,
    public location: Location,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.model = { name: '', gridWidth: 10, gridHeight: 10, participants: [] };
  }

  onSubmit(): void {
    const oneDot: OneDot = { name: this.model.name, grid: [], participants: [], screenshots: [] };
    // create grid of correct size
    for (let i = 0; i < this.model.gridHeight; i++) {
      const row: number[] = [];
      for (let j = 0; j < this.model.gridWidth; j++) {
        row.push(-1);
      }
      oneDot.grid.push(row);
    }

    // add creator as participant
    this.auth.userProfile$.pipe(
      concatMap(user => this.userService.getUserByEmail(user.email)),
      concatMap(u => {
        oneDot.participants.push({u_id: u.id, user: u} as OneDotParticipant);
        return this.oneDotService.createOneDot(oneDot);
      })
    ).subscribe(res => {
      this._snackBar.open('Se creó un nuevo juego One Dot.', 'ok', {
        duration: 2000,
      });
      this.router.navigate(['/onedot', res.id]);
    });
  }
}
