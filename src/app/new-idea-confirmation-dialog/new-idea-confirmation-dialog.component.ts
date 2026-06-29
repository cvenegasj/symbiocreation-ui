import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-new-idea-confirmation-dialog',
    templateUrl: './new-idea-confirmation-dialog.component.html',
    styleUrls: ['./new-idea-confirmation-dialog.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class NewIdeaConfirmationDialogComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
