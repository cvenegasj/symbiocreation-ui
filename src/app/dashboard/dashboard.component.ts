import { Component, OnInit } from '@angular/core';
import { User } from '../models/symbioTypes';
import { AuthService } from '../services/auth.service';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  appUser: User;

  constructor(
    public sharedService: SharedService,
  ) { }

  ngOnInit(): void {
    this.sharedService.appUser$.subscribe(appUser => this.appUser = appUser);
  }
}
