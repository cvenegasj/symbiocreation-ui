import { Component, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { AuthService } from './services/auth.service';
import { SharedService } from './services/shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewChecked {

  title = 'Simbiocreación';
  
  constructor(
    public auth: AuthService,
    public sharedService: SharedService,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
  }

}
