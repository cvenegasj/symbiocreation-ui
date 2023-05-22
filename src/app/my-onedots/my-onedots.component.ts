import { Component, Input, OnInit } from '@angular/core';

import { environment } from '../../environments/environment';
import { OneDot } from '../models/oneDotTypes';
import { SharedService } from '../services/shared.service';
import { User } from '../models/symbioTypes';
import { concatMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { OneDotService } from '../services/onedot.service';

@Component({
  selector: 'app-my-onedots',
  templateUrl: './my-onedots.component.html',
  styleUrls: ['./my-onedots.component.css']
})
export class MyOnedotsComponent implements OnInit {

  environment = environment;
  oneDotCount: number;

  @Input() oneDots: OneDot[];

  constructor(
    private oneDotService: OneDotService,
    public sharedService: SharedService,
    private userService: UserService,
    private auth: AuthService,
  ) { }

  ngOnInit(): void {
    this.sharedService.nextIsLoading(true);
    let fetchedUser: User = null;

    this.auth.userProfile$.pipe(
      concatMap(user => this.userService.getUserByEmail(user.email)),
      concatMap(appUser => {
        fetchedUser = appUser;
        return this.oneDotService.countOneDotsByUser(appUser.id);
      }),
      concatMap(oneDotCount => {
        this.oneDotCount = oneDotCount;
        return this.oneDotService.getMyOneDots(fetchedUser.id, 0);
      })
    ).subscribe(
      oneDots => {
        this.oneDots = oneDots;
        // order has to be done in frontend bc of rx backend ?????
        this.oneDots.sort((a, b) => a.lastModifiedAt > b.lastModifiedAt 
          ? -1 : (a.lastModifiedAt < b.lastModifiedAt ? 1 : 0));
        this.sharedService.nextIsLoading(false);
      }
    );
  }

  onPageFired(event) {
    this.sharedService.nextIsLoading(true);

    let fetchedUser: User = null;

    this.auth.userProfile$.pipe(
      concatMap(usrProfile => this.userService.getUserByEmail(usrProfile.email)),
      concatMap(user => {
        fetchedUser = user;
        return this.oneDotService.getMyOneDots(user.id, event.pageIndex);
      }),
    ).subscribe(
      oneDots => {
        this.oneDots = oneDots;
        this.oneDots.sort((a, b) => a.lastModifiedAt > b.lastModifiedAt ? -1 : (a.lastModifiedAt < b.lastModifiedAt ? 1 : 0));
        this.sharedService.nextIsLoading(false);
      }
    );
  }
}
