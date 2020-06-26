import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-group-dialog',
  templateUrl: './new-group-dialog.component.html',
  styleUrls: ['./new-group-dialog.component.css']
})
export class NewGroupDialogComponent implements OnInit {

  groupName: string;

  constructor(
    public dialogRef: MatDialogRef<NewGroupDialogComponent>
  ) { }

  ngOnInit(): void {
  }

}
