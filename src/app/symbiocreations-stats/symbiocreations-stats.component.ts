import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { AnalyticsService } from '../services/analytics.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-symbiocreations-stats',
  templateUrl: './symbiocreations-stats.component.html',
  styleUrls: ['./symbiocreations-stats.component.css']
})
export class SymbiocreationsStatsComponent implements OnInit {

  @Input() symbiocreationId: string;

  totalUsers: number;
  totalIdeas: number;

  commonTermsRanking: any[] = [];
  usersRanking: any[] = [];

  constructor(
    private analyticsService: AnalyticsService,
  ) { }

  ngOnInit(): void {
    forkJoin({
      countsSummary: this.analyticsService.getCountsSummarySymbiocreation(this.symbiocreationId),
      commonTerms: this.analyticsService.getCommonTermsInSymbiocreation(this.symbiocreationId),
      usersRanking: this.analyticsService.getUsersRankingSymbiocreation(this.symbiocreationId)
    }).subscribe({
      next: response => {
        this.totalUsers = response.countsSummary.users;
        this.totalIdeas = response.countsSummary.ideas;

        this.commonTermsRanking = response.commonTerms;
        this.usersRanking = response.usersRanking;
      }
    });
  }

}
