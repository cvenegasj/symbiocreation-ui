import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from '../services/analytics.service';

@Component({
  selector: 'app-top-symbiocreations-ranking',
  templateUrl: './top-symbiocreations-ranking.component.html',
  styleUrls: ['./top-symbiocreations-ranking.component.css']
})
export class TopSymbiocreationsRankingComponent implements OnInit {

  symbiocreations: any[] = [];

  constructor(
    private analyticsService: AnalyticsService,
  ) { }

  ngOnInit(): void {
    this.analyticsService.getTopSymbiocreations()
            .subscribe(symbios => this.symbiocreations = symbios);
  }
  
}
