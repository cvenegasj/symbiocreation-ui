import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from '../services/analytics.service';

@Component({
  selector: 'app-trending-topics-ideas',
  templateUrl: './trending-topics-ideas.component.html',
  styleUrls: ['./trending-topics-ideas.component.css']
})
export class TrendingTopicsIdeasComponent implements OnInit {

  data: any[] = [];

  constructor(
    private analyticsService: AnalyticsService,
  ) { }

  ngOnInit(): void {
    this.analyticsService.getTrendingTopicsIdeas()
      .subscribe(resultLines => {
        // console.log(resultLines);
        this.data = resultLines;
        this.data.sort((item1, item2) => item1.topic - item2.topic); // ASC sort
      });
  }
}
