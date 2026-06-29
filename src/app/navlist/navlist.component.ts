import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { SharedService } from '../services/shared.service';

@Component({
    selector: 'app-navlist',
    templateUrl: './navlist.component.html',
    styleUrls: ['./navlist.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class NavlistComponent implements OnInit {

  constructor(
    public sharedService: SharedService
  ) { }

  ngOnInit(): void {
  }

}
