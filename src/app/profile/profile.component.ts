import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ProfileComponent implements OnInit {

  constructor(
    public auth: AuthService
  ) { }

  ngOnInit(): void {
    
  }

}
