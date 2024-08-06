import { Component, OnInit } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-edit-group-name-dialog',
  templateUrl: './edit-group-name-dialog.component.html',
  styleUrls: ['./edit-group-name-dialog.component.css']
})
export class EditGroupNameDialogComponent implements OnInit {

  name: string;

  constructor(
    public dialogRef: MatDialogRef<EditGroupNameDialogComponent>
  ) { }

  ngOnInit(): void {
  }

}
