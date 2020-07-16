import { Component, OnInit } from '@angular/core';
import { Symbiocreation } from '../models/symbioTypes';
import { SymbiocreationService } from '../services/symbiocreation.service';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css']
})
export class ExploreComponent implements OnInit {

  symbiocreations: Symbiocreation[];

  constructor(
    private symbioService: SymbiocreationService
  ) { }

  ngOnInit(): void {
    this.symbioService.getUpcomingPublicSymbiocreations().subscribe(
      symbios => this.symbiocreations = symbios
    );
  }

  filterSelected(value: string) {
    switch(value) {
      case "upcoming": {
        this.symbioService.getUpcomingPublicSymbiocreations().subscribe(
          symbios => this.symbiocreations = symbios
        );
        break;
      }
      case "past": {
        this.symbioService.getPastPublicSymbiocreations().subscribe(
          symbios => this.symbiocreations = symbios
        );
        break;
      }
      case "all": {
        this.symbioService.getAllPublicSymbiocreations().subscribe(
          symbios => this.symbiocreations = symbios
        );
        break;
      }
      default: { 
        console.log("Invalid choice"); 
        break;              
     } 
    }
  }

}
