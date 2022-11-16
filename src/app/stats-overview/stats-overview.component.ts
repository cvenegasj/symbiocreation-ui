import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from '../services/analytics.service';

@Component({
  selector: 'app-stats-overview',
  templateUrl: './stats-overview.component.html',
  styleUrls: ['./stats-overview.component.css']
})
export class StatsOverviewComponent implements OnInit {

  totalSymbiocreations: number;
  totalUsers: number;
  totalIdeas: number;

  constructor(
    private analyticsService: AnalyticsService
  ) { }

  ngOnInit(): void {
    this.analyticsService.getCountsSummary().subscribe(map => {
      this.totalSymbiocreations = map["symbiocreations"];
      this.totalUsers = map["users"];
      this.totalIdeas = map["ideas"];
    });
  }

}
