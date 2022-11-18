import { Component, OnInit } from '@angular/core';
import { User } from '../models/symbioTypes';
import { AnalyticsService } from '../services/analytics.service';

@Component({
  selector: 'app-top-users-ranking',
  templateUrl: './top-users-ranking.component.html',
  styleUrls: ['./top-users-ranking.component.css']
})
export class TopUsersRankingComponent implements OnInit {

  users: User[] = [];

  constructor(
    private analyticsService: AnalyticsService,
  ) { }

  ngOnInit(): void {
    this.analyticsService.getTopUsers()
      .subscribe(users => this.users = users);
  }
}
