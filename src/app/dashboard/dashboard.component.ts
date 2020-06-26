import { Component, OnInit } from '@angular/core';
import { Symbiocreation } from '../models/symbioTypes';
import { SymbiocreationService } from '../services/symbiocreation.service';
import { AuthService } from '../services/auth.service';
import { tap, concatMap } from 'rxjs/operators';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  symbiocreations: Symbiocreation[];
  isModerator: boolean[];

  constructor(
    private symbioService: SymbiocreationService,
    private userService: UserService,
    private auth: AuthService
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

}
