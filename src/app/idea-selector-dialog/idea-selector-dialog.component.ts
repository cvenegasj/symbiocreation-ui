import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-idea-selector-dialog',
  templateUrl: './idea-selector-dialog.component.html',
  styleUrls: ['./idea-selector-dialog.component.css']
})
export class IdeaSelectorDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<IdeaSelectorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
  }

}
