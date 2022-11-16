import { Component, ChangeDetectorRef, AfterViewChecked, OnInit } from '@angular/core';
import { User } from './models/symbioTypes';
import { AuthService } from './services/auth.service';
import { SharedService } from './services/shared.service';

import { concatMap } from 'rxjs/operators';
import { UserService } from './services/user.service';
import { EMPTY } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewChecked, OnInit {

  title: string = 'Simbiocreación';
  
  constructor(
    public auth: AuthService,
    public sharedService: SharedService,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.auth.isAuthenticated$.pipe(
      concatMap((isAuthenticated: boolean) => {
        console.log("user is authenticated: " + isAuthenticated);

        if (isAuthenticated) {
          return this.auth.userProfile$;
        } else {
          return EMPTY;
        }
      }),
      concatMap(userProfile => userProfile ? this.userService.getUserByEmail(userProfile.email) : EMPTY),
    ).subscribe((appUser: User) => {
      if (appUser) {
        console.log("logged in user: " + JSON.stringify(appUser));
        this.sharedService.nextAppUser(appUser);
      }
    });
  }

  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
  }
}
