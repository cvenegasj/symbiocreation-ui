import { Component, OnInit } from '@angular/core';
import { User } from '../models/symbioTypes';
import { AnalyticsService } from '../services/analytics.service';

@Component({
  selector: 'app-ranking-users-public',
  templateUrl: './ranking-users-public.component.html',
  styleUrls: ['./ranking-users-public.component.css']
})
export class RankingUsersPublicComponent implements OnInit {

  users: User[] = [];

  constructor(
    private analyticsService: AnalyticsService,
  ) { }

  ngOnInit(): void {
    this.analyticsService.getUsersRankingPublic()
      .subscribe(users => this.users = users);
  }

}
