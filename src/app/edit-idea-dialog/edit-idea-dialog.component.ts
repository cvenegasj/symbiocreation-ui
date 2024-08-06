import { Component, OnInit, Inject } from '@angular/core';
import { Idea } from '../models/symbioTypes';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatLegacyChipInputEvent as MatChipInputEvent } from '@angular/material/legacy-chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ImageService } from '../services/image.service';
import { CameraCaptureDialogComponent } from '../camera-capture-dialog/camera-capture-dialog.component';
import { Observable, forkJoin } from 'rxjs';

@Component({
  selector: 'app-edit-idea-dialog',
  templateUrl: './edit-idea-dialog.component.html',
  styleUrls: ['./edit-idea-dialog.component.css']
})
export class EditIdeaDialogComponent implements OnInit {

  idea: Idea = {};
  selectedImgs: ImageSnippet[];

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(
    public dialogRef: MatDialogRef<EditIdeaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private imageService: ImageService
  ) {
    if (this.data.idea) this.idea = this.data.idea;
  }

  ngOnInit(): void {
    this.selectedImgs = [];
  }

  onOkClick(okButton) {
    // upload img to cloudinary
    okButton.disabled = true;
    okButton._elementRef.nativeElement.innerText = 'Cargando...';
    let observables: Observable<any>[] = [];

    // new images to be uploaded
    for (let img of this.selectedImgs) {
      observables.push(this.imageService.uploadImage(img.file));
    } 

    if (observables.length == 0) {
      this.dialogRef.close(this.idea);
      return;
    }

    forkJoin(observables).subscribe(
      res => {
        if (!this.idea.imgPublicIds) {
          this.idea.imgPublicIds = [];
        }
        for (let item of res) {
          this.idea.imgPublicIds.push(item.public_id);
        }
      },
      err => {
        console.error(err);
      },
      () => {
        this.dialogRef.close(this.idea);
      }
    );
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
        this.selectedImgs.push(imgSnippet);
      }
    });
  }
  
  processFile(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();
    
    reader.onload = (event: any) => {
      const newImgSnippet = new ImageSnippet(event.target.result, file);
      this.selectedImgs.push(newImgSnippet);
    };

    reader.readAsDataURL(file);
  }

  deletePublicId(publicId: string) {
    const index = this.idea.imgPublicIds.indexOf(publicId);
    this.idea.imgPublicIds.splice(index, 1);
  }

  deleteSelectedImg(img: ImageSnippet) {
    const index = this.selectedImgs.indexOf(img);
    this.selectedImgs.splice(index, 1);
  }

  addExternalUrl(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if (!this.idea.externalUrls) {
      this.idea.externalUrls = [];
    }

    // Add the new url
    if ((value || '').trim()) {
      this.idea.externalUrls.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeExternalUrl(url: string): void {
    const index = this.idea.externalUrls.indexOf(url);

    if (index >= 0) {
      this.idea.externalUrls.splice(index, 1);
    }
  }
}

class ImageSnippet {
  constructor(public src: string, public file: File) {}
}
