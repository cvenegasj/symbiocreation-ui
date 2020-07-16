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
    this.symbioService.getPublicSymbiocreations().subscribe(
      symbios => {
        this.symbiocreations = symbios;
        //console.log(this.symbiocreations);
      }
    );
  }

}
