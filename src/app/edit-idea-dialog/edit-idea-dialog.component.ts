import { Component, OnInit, Inject } from '@angular/core';
import { Idea } from '../models/symbioTypes';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ImageService } from '../services/image.service';
import { CameraCaptureDialogComponent } from '../camera-capture-dialog/camera-capture-dialog.component';

@Component({
  selector: 'app-edit-idea-dialog',
  templateUrl: './edit-idea-dialog.component.html',
  styleUrls: ['./edit-idea-dialog.component.css']
})
export class EditIdeaDialogComponent implements OnInit {

  idea: Idea = {};
  selectedFile: ImageSnippet;
  capturedImg: ImageSnippet;

  constructor(
    public dialogRef: MatDialogRef<EditIdeaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private imageService: ImageService
  ) {
    if (this.data.idea) this.idea = this.data.idea;
  }

  ngOnInit(): void {
  }

  onOkClick(okButton) {
    // upload img to cloudinary
    okButton.disabled = true;
    okButton._elementRef.nativeElement.innerText = 'Cargando...';

    if (this.selectedFile || this.capturedImg) {
      this.imageService.uploadImage(this.selectedFile? this.selectedFile.file : this.capturedImg.file).subscribe(
        res => {
          //console.log(res);
          this.idea.imgPublicId = res.public_id;
  
          this.dialogRef.close(this.idea);
        },
        err => {
          console.error(err);
          this.dialogRef.close();
        });
    } else {
      this.dialogRef.close(this.idea);
    }
  }

  openCamera() {
    const dialogRef = this.dialog.open(CameraCaptureDialogComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%'
    });

    dialogRef.afterClosed().subscribe(imgSnippet => {
      if (imgSnippet) {
        //console.log('Capture received!');
        //console.log(img);
        this.capturedImg = imgSnippet;
        this.selectedFile = null;
      }
    });
  }
  
  processFile(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();
    
    reader.onload = (event: any) => {
      this.selectedFile = new ImageSnippet(event.target.result, file);
      this.capturedImg = null;
    };

    reader.readAsDataURL(file);
  }
}

class ImageSnippet {
  constructor(public src: string, public file: File) {}
}
