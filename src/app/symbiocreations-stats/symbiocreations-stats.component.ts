import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { AnalyticsService } from '../services/analytics.service';
import { BehaviorSubject, forkJoin, from, pipe, concat } from 'rxjs';
import { SidenavService } from '../services/sidenav.service';

@Component({
  selector: 'app-symbiocreations-stats',
  templateUrl: './symbiocreations-stats.component.html',
  styleUrls: ['./symbiocreations-stats.component.css']
})
export class SymbiocreationsStatsComponent implements OnInit {

  private _symbiocreationId = new BehaviorSubject<string>(null);

  totalUsers: number;
  totalIdeas: number;

  commonTermsRanking: any[] = [];
  usersRanking: any[] = [];

  constructor(
    private analyticsService: AnalyticsService,
    public sidenavService: SidenavService,
  ) { }

  ngOnInit(): void {
    this._symbiocreationId.subscribe(symbiocreationId => {
      forkJoin({
        countsSummary: this.analyticsService.getCountsSummarySymbiocreation(symbiocreationId),
        commonTerms: this.analyticsService.getCommonTermsInSymbiocreation(symbiocreationId),
        usersRanking: this.analyticsService.getUsersRankingSymbiocreation(symbiocreationId)
      }).subscribe({
        next: response => {
          this.totalUsers = response.countsSummary.users;
          this.totalIdeas = response.countsSummary.ideas;
  
          this.commonTermsRanking = response.commonTerms;
          this.usersRanking = response.usersRanking;
        }
      });
    });
  }

  closeSidenavAnalytics() {
    from(this.sidenavService.closeSidenavAnalytics())
      .subscribe();
  }

  // change data to use getter and setter
	@Input()
	set symbiocreationId(value) {
		// set the latest value for _symbiocreationId BehaviorSubject
		this._symbiocreationId.next(value);
	};

	get symbiocreationId() {
		// get the latest value from _data BehaviorSubject
		return this._symbiocreationId.getValue();
	}
}
