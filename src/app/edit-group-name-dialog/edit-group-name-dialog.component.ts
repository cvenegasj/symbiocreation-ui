import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-edit-group-name-dialog',
    templateUrl: './edit-group-name-dialog.component.html',
    styleUrls: ['./edit-group-name-dialog.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditGroupNameDialogComponent implements OnInit {

  name: string;

  constructor(
    public dialogRef: MatDialogRef<EditGroupNameDialogComponent>
  ) { }

  ngOnInit(): void {
  }

}
